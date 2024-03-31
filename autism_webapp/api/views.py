from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework import generics
from .models import Patient
from .serializers import PatientSerializer

# Create your views here.


class PatientView(generics.CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            patient_data = serializer.data  # Serialized patient data
            # Return JSON response
            return JsonResponse(patient_data, status=201)
        else:
            # Return errors if serializer is invalid
            return JsonResponse(serializer.errors, status=400)
