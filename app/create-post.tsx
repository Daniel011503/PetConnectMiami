import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Pet {
  id: number;
  name: string;
  breed: string;
}

export default function CreatePostScreen() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserPets();
  }, []);

  const fetchUserPets = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await fetch('http://192.168.1.225:8000/api/pets/my-pets/', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (response.ok) {
          const myPets = await response.json();
          setUserPets(myPets);
        } else {
          console.error('Failed to fetch user pets:', response.status);
        }
      }
    } catch (error) {
      console.error('Error fetching user pets:', error);
    }
  };

  const pickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Please allow access to your photo library to add photos.');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!caption.trim()) {
      Alert.alert('Error', 'Please add a caption');
      return;
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('authToken');
      
      console.log('Create post - Auth token exists:', !!token);
      console.log('Create post - Token length:', token?.length);
      
      if (!token) {
        Alert.alert('Error', 'Please log in first');
        return;
      }
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('caption', caption.trim());
      
      console.log('Create post data:', {
        caption: caption.trim(),
        selectedPetId,
        hasImage: !!image
      });
      
      if (selectedPetId) {
        formData.append('pet_id', selectedPetId.toString());
      }

      // Add image if selected
      if (image) {
        formData.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'post_image.jpg',
        } as any);
      }

      const response = await fetch('http://192.168.1.225:8000/api/social/posts/create/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
        },
        body: formData,
      });

      console.log('Create post response status:', response.status);
      const responseText = await response.text();
      console.log('Create post response:', responseText);

      if (response.ok) {
        Alert.alert('Success', 'Post created successfully!', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        let errorMessage = 'Failed to create post';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorData.message || 'Failed to create post';
        } catch (e) {
          errorMessage = responseText || 'Failed to create post';
        }
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Post</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Caption</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={caption}
            onChangeText={setCaption}
            placeholder="What's happening with your pet?"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tag a Pet (Optional)</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedPetId}
              onValueChange={(itemValue: number | null) => setSelectedPetId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="No pet selected" value={null} />
              {userPets.map((pet) => (
                <Picker.Item 
                  key={pet.id} 
                  label={`${pet.name} (${pet.breed})`} 
                  value={pet.id} 
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Photo (Optional)</Text>
          <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageButtonText}>📷 Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Share Post</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#74B9FF',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D3436',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
  },
  picker: {
    height: 50,
  },
  imageButton: {
    borderWidth: 2,
    borderColor: '#DEE2E6',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#6C757D',
    fontSize: 16,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#74B9FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#ADB5BD',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
