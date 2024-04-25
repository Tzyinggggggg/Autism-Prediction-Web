# Generated by Django 5.0.4 on 2024-04-24 07:07

import api.validators
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Patient",
            fields=[
                (
                    "patient_id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                ("patient_name", models.CharField(max_length=50, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name="Video",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("patient", models.CharField(max_length=100)),
                (
                    "video",
                    models.FileField(
                        upload_to="videos/", validators=[api.validators.file_size]
                    ),
                ),
                (
                    "video_output",
                    models.FileField(
                        default=None,
                        null=True,
                        upload_to="output/",
                        validators=[api.validators.file_size],
                    ),
                ),
                ("results", models.JSONField(default=None, null=True)),
                (
                    "prediction_percentage",
                    models.DecimalField(decimal_places=2, max_digits=5, null=True),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
