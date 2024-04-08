from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics
from .models import Patient
from .serializers import PatientSerializer
# from vcab import Model, save_video_stream_predictions
from .models import Video
# Create your views here.


def index(request):
    video = Video.objects.all()
    return render(request, 'index.html', {'video': video})


class PatientView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
