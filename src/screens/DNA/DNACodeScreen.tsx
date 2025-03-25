import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

// A simple function that "analyzes" track names and returns a 6-digit code.
// In a real implementation you might use more advanced NLP techniques.
function generateDNACode(tracks: { name: string }[]): string {
  const combinedText = tracks.map((track) => track.name).join(' ');
  let sum = 0;
  for (let i = 0; i < combinedText.length; i++) {
    sum += combinedText.charCodeAt(i);
  }
  const code = (sum % 1000000).toString().padStart(6, '0');
  return code;
}

type DNAScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DNACode'>;

export default function DNACodeScreen() {
  const navigation = useNavigation<DNAScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [dnaCode, setDnaCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopTracksAndGenerateCode = async () => {
      try {
        const spotifyToken = await AsyncStorage.getItem('spotify_token');
        if (!spotifyToken) {
          setError('Spotify not connected. Please authenticate.');
          return;
        }
        // Fetch top 50 tracks from Spotify
        const response = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=50', {
          headers: { Authorization: `Bearer ${spotifyToken}` },
        });
        if (!response.data.items || response.data.items.length === 0) {
          setError('No tracks found.');
          return;
        }
        // Generate DNA code from the track names
        const code = generateDNACode(response.data.items);
        setDnaCode(code);
      } catch (err) {
        console.error('Error generating DNA code:', err);
        setError('Error fetching your top tracks.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracksAndGenerateCode();
  }, []);

  const navigateToHome = () => {
    navigation.navigate('Main');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Generating your DNA code ...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={navigateToHome}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your DNA Code</Text>
      <Text style={styles.code}>{dnaCode}</Text>
      <Text style={styles.description}>This unique 6-digit code is generated based on your top 50 tracks.</Text>
      
      <TouchableOpacity style={styles.button} onPress={navigateToHome}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1DB954',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  code: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#D4AF37', // Gold color matching other screens
    marginBottom: 20,
    letterSpacing: 4, // Adds spacing between digits for better readability
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#CCCCCC',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#D4AF37', // Gold color matching other screens
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});