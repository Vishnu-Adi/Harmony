import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Playlist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
}

export default function HomeScreen() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const token = await AsyncStorage.getItem('spotify_token');
        if (!token) {
          console.error('No Spotify token stored.');
          Alert.alert("Error", "Spotify token not found. Please sign in with Spotify again.");
          return;
        }

        const response = await axios.get(
          'https://api.spotify.com/v1/me/playlists?limit=50',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.items && Array.isArray(response.data.items)) {
          setPlaylists(response.data.items);
        } else {
          console.warn("Unexpected response format:", response.data);
          Alert.alert("Error", "Failed to load playlists.");
          setPlaylists([]);
        }
      } catch (error) {
        console.error('Error fetching playlists:', error);
        Alert.alert("Error", "Failed to fetch playlists. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Loading playlists...</Text>
      </View>
    );
  }

  if (playlists.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No playlists found. Create some on Spotify!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Playlists</Text>
      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.playlistItem}>
            <Text style={styles.playlistName}>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  playlistName: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});