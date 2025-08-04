from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import Pet
from .serializers import PetSerializer, UserSerializer

class PetListCreateView(generics.ListCreateAPIView):
    serializer_class = PetSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Pet.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class PetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pet.objects.all()
    serializer_class = PetSerializer
    permission_classes = [AllowAny]  # Allow public access for viewing pet details

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow public access
@csrf_exempt
def pet_search(request):
    try:
        pets = Pet.objects.all()
        
        # Search parameters
        search = request.GET.get('search', '')
        age_min = request.GET.get('age_min', '')
        age_max = request.GET.get('age_max', '')
        
        if search:
            pets = pets.filter(name__icontains=search) | pets.filter(breed__icontains=search)
        
        if age_min:
            try:
                pets = pets.filter(age__gte=int(age_min))
            except ValueError:
                pass
                
        if age_max:
            try:
                pets = pets.filter(age__lte=int(age_max))
            except ValueError:
                pass
        
        serializer = PetSerializer(pets, many=True, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=500)