//// filepath: /Users/vishnuadithya/Documents/Projects/Harmony/Music-app/src/screens/DNACodeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A simple function that “analyzes” track names and returns a 6-digit code.
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

export default function DNACodeScreen() {
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your DNA Code</Text>
      <Text style={styles.code}>{dnaCode}</Text>
      <Text style={styles.description}>This unique 6-digit code is generated based on your top 50 tracks.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  code: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1DB954',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
});