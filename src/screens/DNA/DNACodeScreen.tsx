import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { LinearGradient } from 'expo-linear-gradient';

// Complex DNA Code generation using a custom hash.
// Combines track name, artist names, and popularity.
function generateDNACode(tracks: { name: string; artists: { name: string }[]; popularity: number }[]): string {
  // Combine data from each track into one long string.
  const combinedData = tracks
    .map(track => 
      `${track.name.trim().toLowerCase()}-${track.artists.map(a => a.name.trim().toLowerCase()).join(',')}-${track.popularity}`
    )
    .join('|');

  // Use a polynomial rolling hash (similar to djb2 but modified)
  let hash = 5381;
  for (let i = 0; i < combinedData.length; i++) {
    hash = (hash * 33) ^ combinedData.charCodeAt(i);
  }
  // Convert hash to unsigned 32-bit and then to hexadecimal.
  const hexCode = (hash >>> 0).toString(16).padStart(8, '0').toUpperCase();
  return hexCode;
}

type DNAScreenNavigationProp = StackNavigationProp<RootStackParamList, 'DNACode'>;

export default function DNACodeScreen() {
  const navigation = useNavigation<DNAScreenNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [dnaCode, setDnaCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchTopTracksAndGenerateCode = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const spotifyToken = await AsyncStorage.getItem('spotify_token');
      if (!spotifyToken) {
        throw new Error('Spotify not connected. Please authenticate.');
      }
      // Fetch top 50 tracks from Spotify
      const response = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=50', {
        headers: { Authorization: `Bearer ${spotifyToken}` },
      });
      const tracks = response.data.items;
      if (!tracks || tracks.length === 0) {
        throw new Error('No tracks found.');
      }
      // Generate the DNA code using complex logic
      const code = generateDNACode(tracks);
      setDnaCode(code);
    } catch (err: any) {
      console.error('Error generating DNA code:', err);
      setError(err.message || 'Error fetching your top tracks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopTracksAndGenerateCode();
  }, [fetchTopTracksAndGenerateCode]);

  const navigateToHome = () => {
    navigation.navigate('Tab');
  };

  if (loading) {
    return (
      <LinearGradient colors={['#1A1A1A', '#000']} style={styles.container}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Generating your DNA code...</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <LinearGradient colors={['#1A1A1A', '#000']} style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={navigateToHome}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1A1A1A', '#000']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Your DNA Code</Text>
        <Text style={styles.code}>{dnaCode}</Text>
        <Text style={styles.description}>
          This unique 8-digit hexadecimal code is generated based on your top 50 tracks, combining their titles, artists, and popularity.
        </Text>
        <TouchableOpacity style={styles.button} onPress={navigateToHome}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#1DB954',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  code: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#D4AF37', // Gold
    marginBottom: 20,
    letterSpacing: 6,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#CCCCCC',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#D4AF37',
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
