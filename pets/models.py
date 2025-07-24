from django.db import models
from django.contrib.auth.models import User

class Pet(models.Model):
    name = models.CharField(max_length=100)
    breed = models.CharField(max_length=100)
    age = models.IntegerField()
    description = models.TextField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='pet_photos/', blank=True, null=True)
    
    def __str__(self):
        return self.name