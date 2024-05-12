from django.db import models
from .validators import file_size

class Video(models.Model):
    # Update field name to match database
    patient = models.CharField(max_length=100)
    video = models.FileField(upload_to='videos/', validators=[file_size])
    video_output = models.FileField(
        upload_to='output/', validators=[file_size], null=True, default=None)
    results = models.JSONField(null=True, default=None)
    emotion_results = models.JSONField(null=True, default=None)
    prediction_percentage = models.DecimalField(
        max_digits=5, decimal_places=2, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.patient
