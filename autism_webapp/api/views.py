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

   def post(self, request):
       data = request.data

       print(data)

       serializer = self.serializer_class(data=data)
       if serializer.is_valid():

           video: Video = serializer.save()
           predictions = Model().predict_stream(video_path=video.video.path)

           output_path = str(video.patient) + str(video.pk) + "_output.mp4"

           # Mask video with prediction
           save_video_stream_predictions_v2(
               video_path=video.video.path,
               predictions=predictions,
               output_path='media/videos/' + output_path)

           path = Path('media/videos/' + output_path)
           video.results = predictions
           with path.open(mode='rb') as f:
               video.video_output = File(f, name=path.name)
               video.save()

           return Response(serializer.data, status=status.HTTP_201_CREATED)

       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
