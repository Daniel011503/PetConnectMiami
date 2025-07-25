from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from .models import Pet
from .forms import PetForm, PetSearchForm

def pet_list(request):
    pets = Pet.objects.all()
    search_form = PetSearchForm(request.GET)
    
    if search_form.is_valid():
        search_query = search_form.cleaned_data.get('search')
        age_min = search_form.cleaned_data.get('age_min')
        age_max = search_form.cleaned_data.get('age_max')
        
        if search_query:
            pets = pets.filter(
                Q(name__icontains=search_query) | 
                Q(breed__icontains=search_query)
            )
        
        if age_min is not None:
            pets = pets.filter(age__gte=age_min)
            
        if age_max is not None:
            pets = pets.filter(age__lte=age_max)
    
    return render(request, 'pets/pet_list.html', {
        'pets': pets,
        'search_form': search_form
    })

def pet_detail(request, pet_id):
    pet = get_object_or_404(Pet, id=pet_id)
    return render(request, 'pets/pet_detail.html', {'pet': pet})

@login_required
def add_pet(request):
    if request.method == 'POST':
        form = PetForm(request.POST, request.FILES)
        if form.is_valid():
            pet = form.save(commit=False)
            pet.owner = request.user
            pet.save()
            return redirect('pet_detail', pet_id=pet.id)
    else:
        form = PetForm()
    return render(request, 'pets/add_pet.html', {'form': form})