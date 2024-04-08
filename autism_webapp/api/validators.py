from django.core.exceptions import ValidationError


def file_size(value):
    file_size = value.size
    if file_size > 100000000:
        raise ValidationError(
            "The maximum file size that can be uploaded is 100MB")
