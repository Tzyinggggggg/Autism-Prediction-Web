from django.urls import path
from .views import PatientView

urlpatterns = [
    path('home', PatientView.as_view()),
]
