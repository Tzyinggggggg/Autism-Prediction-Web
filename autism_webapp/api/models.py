from django.db import models
import uuid
from .validators import file_size


class Patient(models.Model):
    patient_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    patient_name = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.patient_name


class Video(models.Model):
    # Update field name to match database
    patient = models.CharField(max_length=100)
    video = models.FileField(upload_to='videos/', validators=[file_size])
    video_output = models.FileField(
        upload_to='output/', validators=[file_size], null=True, default=None)
    results = models.JSONField(null=True, default=None)
    prediction_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.patient
