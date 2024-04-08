from django.urls import path
from .views import PatientView
from . import views

urlpatterns = [
    path('home', PatientView.as_view()),
    path('', views.index)
]
