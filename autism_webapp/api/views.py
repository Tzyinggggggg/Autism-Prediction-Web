from django.shortcuts import render, redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
from rest_framework import generics
from .models import Patient
from .serializers import PatientSerializer
from vcab import Model, save_video_stream_predictions_v2
from .models import Video
from rest_framework.views import APIView
from .serializers import VideoSerializer
from rest_framework.response import Response
from rest_framework import status
import os
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from .forms import VideoUploadForm
from django.urls import reverse
from django.middleware.csrf import get_token
import json
import requests
from pathlib import Path
from django.core.files import File
import cv2
import ffmpegcv
from collections import defaultdict

from MEGraphAU.OpenGraphAU.predict import predict
from MEGraphAU.OpenGraphAU.utils import Image, draw_text
from MEGraphAU.download_checkpoints import download_checkpoints

from ultralytics import YOLO
import json


def index(request):
    if request.method == 'POST':
        form = VideoUploadForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()

            patient = form.cleaned_data['patient']
            video = form.cleaned_data['video']

            csrf_token = get_token(request=request)
            headers = {'X-CSRFToken': csrf_token}
            data = {
                "csrfmiddlewaretoken": csrf_token,
                "patient": patient,
                "results": {},
                "prediction_percentage": "",
                "video_output": ""
            }

            # Replace with your API endpoint URL
            api_url = 'http://127.0.0.1:8000/api/upload/'
            response = requests.post(
                api_url, data=data, files={'video': video}, headers=headers)

            if response.status_code == 201:
                print(response.json())

                id = response.json().get('id')
                video = Video.objects.get(id=id)
                print(video.video.url, video.video_output.url)
                return render(request, 'index.html', {
                    'video_path': video.video,
                    'video_output_path': video.video_output,
                    'results': video.results,
                    'status': 'success',
                    'form': form
                })
            else:

                return render(request, 'index.html', {'error_message': 'Failed to upload video', 'form': form})
    else:
        form = VideoUploadForm()
    return render(request, 'index.html', {'form': form})


class VideoAPIView(APIView):
    serializer_class = VideoSerializer

    def calculate_emotion(self, probs, threshold=0.15):
        emotions = {
            "Happy": (float(probs[4]) > threshold) and (float(probs[9]) > threshold),
            "Sad": (float(probs[0]) > threshold) and (float(probs[2]) > threshold) and (float(probs[12]) > threshold),
            "Surprise": (float(probs[0]) > threshold) and (float(probs[1]) > threshold) and (float(probs[3]) > threshold) and (float(probs[22]) > threshold),
            "Fear": (float(probs[0]) > threshold) and (float(probs[1]) > threshold) and (float(probs[2]) > threshold) and (float(probs[3]) > threshold) and (float(probs[5]) > threshold) and (float(probs[17]) > threshold) and (float(probs[23]) > threshold),
            "Anger": (float(probs[2]) > threshold) and (float(probs[3]) > threshold) and (float(probs[5]) > threshold) and (float(probs[19]) > threshold),
            "Disgust": (float(probs[6]) > threshold) and (float(probs[12]) > threshold) and (float(probs[13]) > threshold),
            "Contempt": (float(probs[38]) > threshold) and (float(probs[40]) > threshold)
        }

        return "-".join([emotion for emotion, is_true in emotions.items() if is_true])

    def post(self, request):
        data = request.data

        print(data)

        serializer = self.serializer_class(data=data)
        if serializer.is_valid():

            video: Video = serializer.save()

            print("action")
            # ----------------
            # ACTION
            # ----------------
            predictions = Model().predict_stream(video_path=video.video.path)

            output_path = str(video.patient) + str(video.pk) + "_output.mp4"

            # Mask video with prediction
            save_video_stream_predictions_v2(
                video_path=video.video.path,
                predictions=predictions,
                output_path='media/videos/' + output_path)

            path = Path('media/videos/' + output_path)
            print("face")

            # ----------------------
            # FACE ACTION UNIT (FAU)
            # ----------------------
            print(path.name)
            cap = cv2.VideoCapture('media/videos/' + path.name)
            fps = cap.get(cv2.CAP_PROP_FPS)
            output_frames = []
            emotions_result = {}
            results = {}
            yolo = YOLO(
                "/Users/tzeying/Documents/Autism-Prediction-Web/autism_webapp/api/yolov8n-face.pt")

            # Read video frame by frame.
            while (cap.isOpened()):
                ret, frame = cap.read()

                if ret == True:
                    frame_number = cap.get(cv2.CAP_PROP_POS_FRAMES)
                    current_time = frame_number / fps

                    faces = yolo.predict(frame, conf=0.40, iou=0.3)
                    for face in faces:
                        parameters = face.boxes

                        for box in parameters:
                            x1, y1, x2, y2 = box.xyxy[0]
                            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                            h, w = y2 - y1, x2 - x1
                            faces = frame[y1:y1 + h, x1:x1 + w]

                            infostr_aus, pred = predict(Image.fromarray(faces))
                            res, f = draw_text(frame, list(infostr_aus),
                                               pred, ((x1, y1), (x1+w, y1+h)))
                            emotion = self.calculate_emotion(pred)
                            print(emotion)
                            if emotion in emotions_result:
                                emotions_result[emotion] += 1
                            else:
                                emotions_result[emotion] = 1

                            results[current_time] = res

                            frame = cv2.rectangle(
                                frame, (x1, y1), (x1+w, y1+h), (0, 0, 255), 2)

                    output_frames.append(frame)

                    if cv2.waitKey(25) & 0xFF == ord('q'):
                        break

                else:
                    break

            cap.release()
            for key in emotions_result:
                emotions_result[key] /= fps
            print(emotions_result)
            # size = output_frames[0].shape
            output_video = ffmpegcv.VideoWriter(
                'media/videos/' + path.name, None, fps)

            for of in output_frames:
                output_video.write(of)
            output_video.release()

            print("before")
            video.results = predictions
            with path.open(mode='rb') as f:
                video.video_output = File(f, name=path.name)
                video.emotion_results = emotions_result
                print()
                video.save()
                
            with open(f"{path.name[:-4]}_emotion.json", 'w') as f:
                json.dump(results, f)
            print("final")
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
