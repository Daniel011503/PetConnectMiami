import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

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

export default function HomeScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async (): Promise<void> => {
    try {
      console.log('Fetching pets from API...');
      const response = await fetch('http://192.168.1.225:8000/api/pets/search/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      if (response.ok) {
        const data: Pet[] = JSON.parse(responseText);
        console.log('Parsed data:', data);
        setPets(data);
      } else {
        console.error('API Error:', responseText);
        console.error('Response status:', response.status);
        console.error('Response statusText:', response.statusText);
        setPets([]); // Set empty array on error
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pets:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      setPets([]); // Set empty array on error
      setLoading(false);
    }
  };

  const navigateToPetDetail = (petId: number) => {
    router.push({
      pathname: '/pet/[id]',
      params: { id: petId.toString() }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading pets...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Pet Connect Miami</Text>
      {pets.length === 0 ? (
        <View style={styles.noPetsContainer}>
          <Text style={styles.noPetsText}>No pets found. Please check your connection or try again later.</Text>
        </View>
      ) : (
        pets.map((pet: Pet) => (
          <View key={pet.id} style={styles.petCard}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petBreed}>{pet.breed}</Text>
            <Text style={styles.petAge}>Age: {pet.age} years</Text>
            <Text style={styles.petDescription} numberOfLines={2}>
              {pet.description}
            </Text>
            <Text style={styles.petOwner}>Owner: {pet.owner.username}</Text>
            
            <TouchableOpacity 
              style={styles.detailsButton} 
              onPress={() => navigateToPetDetail(pet.id)}
            >
              <Text style={styles.detailsButtonText}>View Details →</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 100, // Extra space at bottom to ensure last item is visible
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#74B9FF',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#74B9FF',
    marginTop: 100,
  },
  noPetsContainer: {
    alignItems: 'center',
    marginTop: 50,
    padding: 20,
  },
  noPetsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#FF6B6B',
    fontStyle: 'italic',
  },
  petCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A2D2FF',
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#74B9FF',
    marginBottom: 5,
  },
  petBreed: {
    fontSize: 16,
    color: '#34495E',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  petAge: {
    fontSize: 14,
    color: '#FF6B6B',
    marginBottom: 5,
  },
  petDescription: {
    fontSize: 14,
    color: '#2D3436',
    marginBottom: 5,
  },
  petOwner: {
    fontSize: 12,
    color: '#34495E',
    backgroundColor: '#B2F7EF',
    padding: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  detailsButton: {
    backgroundColor: '#74B9FF',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-end',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  detailsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});