from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics
from .models import Patient
from .serializers import PatientSerializer
# from vcab import Model, save_video_stream_predictions
from .forms import Video_form
from .models import Video
# Create your views here.


def index(request):
    all_videos = Video.objects.all()
    if request.method == "POST":
        form = Video_form(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return HttpResponse("Video uploaded successfully")
    else:
        form = Video_form()

    return render(request, 'index.html', {"form:": form})


class PatientView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    # def post(self, request, *args, **kwargs):
    #     predictions = Model.predict_stream(request.data['video'])
    #     save_video_stream_predictions(request.data['video'], predictions)
