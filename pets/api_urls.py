from django.urls import path
from . import api_views

urlpatterns = [
    path('pets/', api_views.PetListCreateView.as_view(), name='api_pet_list'),
    path('pets/<int:pk>/', api_views.PetDetailView.as_view(), name='api_pet_detail'),
    path('pets/search/', api_views.pet_search, name='api_pet_search'),
    path('pets/create/', api_views.create_pet, name='api_pet_create'),
    path('pets/delete/<int:pet_id>/', api_views.delete_pet, name='api_pet_delete'),
    path('profile/', api_views.user_profile, name='api_user_profile'),
]