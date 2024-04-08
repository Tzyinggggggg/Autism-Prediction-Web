from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics
from .models import Patient
from .serializers import PatientSerializer
from vcab import Model, save_video_stream_predictions
from .models import Video
from rest_framework.views import APIView
from .serializers import VideoSerializer
from rest_framework.response import Response
from rest_framework import status
# Create your views here.


def index(request):
    # all_videos = Video.objects.all()
    # if request.method == "POST":
    #     form = Video_form(request.POST, request.FILES)
    #     if form.is_valid():
    #         form.save()
    #         return HttpResponse("Video uploaded successfully")
    # else:
    #     form = Video_form()

    # return render(request, 'index.html', {"form:": form})
    return render(request, 'index.html')


class PatientView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    # def post(self, request, *args, **kwargs):
    #     predictions = Model.predict_stream(request.data['video'])
    #     save_video_stream_predictions(request.data['video'], predictions)


class VideoUploadView(APIView):
    def get(self, request, format=None):
        return render(request, 'video.html')

    def post(self, request, format=None):
        # Extract the title from the request data
        title = request.data.get('title')

        # Create a dictionary containing both the video file and the title
        data = {'title': title, 'video': request.data.get('video')}

        # Get video stream predictions
        predictions = Model().predict_stream(video_path=data.video)

        # Mask video with prediction
        save_video_stream_predictions(
            video_path=data.video,
            predictions=predictions,
            output_path=data.title + ".mp4")
        # Pass the combined data to the serializer
        serializer = VideoSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
