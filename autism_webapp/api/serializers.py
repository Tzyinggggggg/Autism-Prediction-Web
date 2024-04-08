from rest_framework import serializers
from .models import Patient, Video

# Help Django convert JSON data to Python native objects


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ('patient_id', 'patient_name', 'raw_results',
                  'prediction_percentage', 'created_at')


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ['title', 'video']
