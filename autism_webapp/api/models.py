from django.db import models
import uuid
# Create your models here.
from .validators import file_size


class Patient(models.Model):
    patient_id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    patient_name = models.CharField(max_length=50, unique=True)
    raw_results = models.JSONField()
    prediction_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)


class Video (models.Model):
    caption = models.CharField(max_length=100)
    video = models.FileField(upload_to='videos/%y', validators=[file_size])

    def __str__(self):
        return self.caption
