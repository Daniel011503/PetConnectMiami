import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TestConnectionScreen() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBasicConnection = async () => {
    try {
      addResult('Testing basic connection...');
      const response = await fetch('http://192.168.1.225:8000/api/test/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Basic connection OK: ${data.status}`);
      } else {
        addResult(`❌ Basic connection failed: ${response.status}`);
      }
    } catch (error: any) {
      addResult(`❌ Basic connection error: ${error.message}`);
    }
  };

  const testMobileConnection = async () => {
    try {
      addResult('Testing mobile connection...');
      const response = await fetch('http://192.168.1.225:8000/api/test-mobile/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          test: 'mobile_connection',
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Mobile connection OK: ${data.status}`);
      } else {
        addResult(`❌ Mobile connection failed: ${response.status}`);
      }
    } catch (error: any) {
      addResult(`❌ Mobile connection error: ${error.message}`);
    }
  };

  const testAuthentication = async () => {
    try {
      addResult('Testing authentication...');
      const token = await AsyncStorage.getItem('authToken');
      
      if (!token) {
        addResult('❌ No auth token found');
        return;
      }
      
      addResult(`Token exists: ${token.substring(0, 10)}...`);
      
      const response = await fetch('http://192.168.1.225:8000/api/pets/my-pets/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Accept': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult(`✅ Authentication OK: Found ${data.length} pets`);
      } else {
        addResult(`❌ Authentication failed: ${response.status}`);
      }
    } catch (error: any) {
      addResult(`❌ Authentication error: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);
    
    await testBasicConnection();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testMobileConnection();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testAuthentication();
    
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connection Test</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={runAllTests}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Testing...' : 'Run All Tests'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearResults}
        >
          <Text style={styles.buttonText}>Clear Results</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {results.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: '#74B9FF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ADB5BD',
  },
  clearButton: {
    backgroundColor: '#FD79A8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
  },
  resultText: {
    fontSize: 12,
    color: '#2D3436',
    marginBottom: 5,
    fontFamily: 'monospace',
  },
});
