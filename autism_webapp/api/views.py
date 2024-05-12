from vcab import Model, save_video_stream_predictions_v3
from .models import Video
from rest_framework.views import APIView
from .serializers import VideoSerializer
from rest_framework.response import Response
from rest_framework import status
from pathlib import Path
from django.core.files import File
import cv2
class VideoAPIView(APIView):
    serializer_class = VideoSerializer

    def calculate_emotion(self, probs, threshold=0.15):
        emotions = {
            "Happy": (float(probs['Cheek raiser -- AU6']) > threshold) and (float(probs['Lip corner puller -- AU12']) > threshold),
            "Sad": (float(probs['Inner brow raiser -- AU1']) > threshold) and (float(probs['Brow lowerer -- AU4']) > threshold) and (float(probs['Lip corner depressor -- AU15']) > threshold),
            "Surprise": (float(probs['Inner brow raiser -- AU1']) > threshold) and (float(probs[ 'Outer brow raiser -- AU2']) > threshold) and (float(probs['Upper lid raiser -- AU5']) > threshold) and (float(probs['Jaw drop -- AU26']) > threshold),
            "Fear": (float(probs['Inner brow raiser -- AU1']) > threshold) and (float(probs[ 'Outer brow raiser -- AU2']) > threshold) and (float(probs['Brow lowerer -- AU4']) > threshold) and (float(probs['Upper lid raiser -- AU5']) > threshold) and (float(probs['Lid tightener -- AU7']) > threshold) and (float(probs['Lip stretcher -- AU20']) > threshold) and (float(probs['Jaw drop -- AU26']) > threshold),
            "Anger": (float(probs['Brow lowerer -- AU4']) > threshold) and (float(probs['Upper lid raiser -- AU5']) > threshold) and (float(probs['Lid tightener -- AU7']) > threshold) and (float(probs['Lip tightener -- AU23']) > threshold),
            "Disgust": (float(probs['Nose wrinkler -- AU9']) > threshold) and (float(probs['Lip corner depressor -- AU15']) > threshold) and (float(probs['Lower lip depressor -- AU16']) > threshold),
            "Contempt": (float(probs['Lip corner puller -- AU12']) > threshold) and (float(probs['Dimpler -- AU14']) > threshold)
        }

        return "-".join([emotion for emotion, is_true in emotions.items() if is_true])

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)

        if serializer.is_valid():

            video: Video = serializer.save()

            cap = cv2.VideoCapture(video.video.path)
            fps = cap.get(cv2.CAP_PROP_FPS)
            cap.release()

            output_path = str(video.patient) + str(video.pk) + "_output.mp4"

            actions, emotions, autism, autism_percentage, video_output = Model(
            ).predict_stream_emotion(video_path=video.video.path)
            save_video_stream_predictions_v3(
                video_path=video_output,
                action_predictions=actions,
                autism_predictions=autism,
                output_path='media/videos/' + output_path)

            path = Path('media/videos/' + output_path)

            emotions_result = {}
            for _, probs in emotions.items():
                emotion = self.calculate_emotion(probs)
                
                if emotion in emotions_result:
                    emotions_result[emotion] += 1
                else:
                    emotions_result[emotion] = 1

            for key in emotions_result:
                emotions_result[key] /= fps
                
            video.results = actions
            video.prediction_percentage = autism_percentage
            with path.open(mode='rb') as f:
                video.video_output = File(f, name=path.name)
                video.emotion_results = emotions_result
                video.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
