import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function AddPetTab() {
  useEffect(() => {
    // Immediately redirect to the add-pet screen outside of tabs
    router.push('/add-pet');
  }, []);

  // Return empty view since we're redirecting
  return <View />;
}
