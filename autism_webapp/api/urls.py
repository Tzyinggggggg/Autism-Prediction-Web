from django.urls import path
from .views import PatientView, VideoUploadView
from . import views

urlpatterns = [
    path('home', PatientView.as_view()),
    path('', views.index),
    path('upload/', VideoUploadView.as_view(), name='video_upload'),
]
