import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

interface Pet {
  id: number;
  name: string;
  breed: string;
  age: number;
  description: string;
  photo: string | null;
  owner: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPetDetails();
  }, [id]);

  const fetchPetDetails = async (): Promise<void> => {
    try {
      console.log('Fetching pet details for ID:', id);
      const response = await fetch(`http://192.168.1.225:8000/api/pets/${id}/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const data: Pet = await response.json();
        console.log('Pet details:', data);
        setPet(data);
        setError(null);
      } else {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        setError(`Failed to fetch pet details: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching pet details:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#74B9FF" />
        <Text style={styles.loadingText}>Loading pet details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Pet not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={goBack}>
        <Text style={styles.backButtonText}>← Back to Pets</Text>
      </TouchableOpacity>

      <View style={styles.petDetailCard}>
        {pet.photo && (
          <View style={styles.photoContainer}>
            <Image 
              source={{ uri: pet.photo }} 
              style={styles.petPhoto} 
              resizeMode="cover"
            />
          </View>
        )}
        
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petBreed}>{pet.breed}</Text>
        <Text style={styles.petAge}>Age: {pet.age} years old</Text>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About {pet.name}:</Text>
          <Text style={styles.petDescription}>{pet.description}</Text>
        </View>

        <View style={styles.ownerContainer}>
          <Text style={styles.ownerTitle}>Owner Information:</Text>
          <Text style={styles.ownerName}>
            {pet.owner.first_name && pet.owner.last_name 
              ? `${pet.owner.first_name} ${pet.owner.last_name}` 
              : pet.owner.username}
          </Text>
          <Text style={styles.ownerUsername}>@{pet.owner.username}</Text>
          {pet.owner.email && (
            <Text style={styles.ownerEmail}>{pet.owner.email}</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    padding: 20,
    paddingTop: 60,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#74B9FF',
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#74B9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  petDetailCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#A2D2FF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  petPhoto: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  petName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#74B9FF',
    marginBottom: 8,
    textAlign: 'center',
  },
  petBreed: {
    fontSize: 20,
    color: '#34495E',
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  petAge: {
    fontSize: 18,
    color: '#FF6B6B',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 25,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 8,
  },
  petDescription: {
    fontSize: 16,
    color: '#2D3436',
    lineHeight: 24,
  },
  ownerContainer: {
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  ownerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 10,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#74B9FF',
    marginBottom: 5,
  },
  ownerUsername: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 5,
  },
  ownerEmail: {
    fontSize: 14,
    color: '#6C757D',
  },
});
