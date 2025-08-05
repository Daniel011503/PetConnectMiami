from django.urls import path
from . import api_views

urlpatterns = [
    path('register/', api_views.register, name='api_register'),
    path('login/', api_views.login, name='api_login'),
    path('logout/', api_views.logout, name='api_logout'),
    path('profile/', api_views.profile, name='api_profile'),
    path('profile/update/', api_views.update_profile, name='api_update_profile'),
]
