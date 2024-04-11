from django.contrib import admin

# Register your models here.
from .models import Patient, Video

admin.site.register(Patient)
admin.site.register(Video)
