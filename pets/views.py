from django.shortcuts import render, get_object_or_404
from .models import Pet

def pet_list(request):
    pets = Pet.objects.all()
    return render(request, 'pets/pet_list.html', {'pets': pets})

def pet_detail(request, pet_id):
    pet = get_object_or_404(Pet, id=pet_id)
    return render(request, 'pets/pet_detail.html', {'pet': pet})