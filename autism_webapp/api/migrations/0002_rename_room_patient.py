# Generated by Django 5.0.3 on 2024-03-23 08:39

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.RenameModel(
            old_name="Room",
            new_name="Patient",
        ),
    ]
