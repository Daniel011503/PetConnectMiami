from django import forms
from .models import Pet

class PetForm(forms.ModelForm):
    class Meta:
        model = Pet
        fields = ['name', 'breed', 'age', 'description', 'photo']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Enter your pet\'s name'}),
            'breed': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'e.g., Golden Retriever'}),
            'age': forms.NumberInput(attrs={'class': 'form-control', 'placeholder': 'Age in years'}),
            'description': forms.Textarea(attrs={'class': 'form-control', 'rows': 4, 'placeholder': 'Tell us about your pet\'s personality...'}),
            'photo': forms.FileInput(attrs={'class': 'form-control'}),
        }