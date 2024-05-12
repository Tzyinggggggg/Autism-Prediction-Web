# Generated by Django 5.0.6 on 2024-05-12 13:09

import api.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Video',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('patient', models.CharField(max_length=100)),
                ('video', models.FileField(upload_to='videos/', validators=[api.validators.file_size])),
                ('video_output', models.FileField(default=None, null=True, upload_to='output/', validators=[api.validators.file_size])),
                ('results', models.JSONField(default=None, null=True)),
                ('emotion_results', models.JSONField(default=None, null=True)),
                ('prediction_percentage', models.DecimalField(decimal_places=2, max_digits=5, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
