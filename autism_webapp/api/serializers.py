from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ('patient_id', 'patient_name', 'raw_results',
                  'prediction_percentage', 'created_at')
