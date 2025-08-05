from rest_framework import generics, permissions, status
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def create_pet(request):
    """Create a new pet for the authenticated user"""
    try:
        serializer = PetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=500)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def delete_pet(request, pet_id):
    """Delete a pet (only owner can delete)"""
    try:
        pet = Pet.objects.get(id=pet_id, owner=request.user)
        pet.delete()
        return Response({'message': 'Pet deleted successfully'}, status=status.HTTP_200_OK)
    except Pet.DoesNotExist:
        return Response({'error': 'Pet not found or you do not have permission to delete it'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=500)