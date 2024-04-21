from django.conf import settings
from django.conf.urls.static import static
from django.urls import path
from .views import PatientView, VideoAPIView
from . import views

urlpatterns = [
    # path('home', PatientView.as_view()),
    path('upload/', VideoAPIView.as_view(), name='video'),
]

if settings.DEBUG:
  urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)