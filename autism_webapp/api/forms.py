from django import forms
from .models import Video, Patient

class VideoUploadForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ['patient', 'video']

    def __init__(self, *args, **kwargs):
        super(VideoUploadForm, self).__init__(*args, **kwargs)
        # self.fields['patient'].queryset = Patient.objects.all()