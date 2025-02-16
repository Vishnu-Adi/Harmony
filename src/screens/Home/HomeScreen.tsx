//// filepath: Music-app/src/screens/Home/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
}

export default function HomeScreen() {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        // Retrieve the access token from AsyncStorage
        const token = await AsyncStorage.getItem('spotify_token');
        if (!token) {
          console.error('No Spotify token stored.');
          return;
        }
        const response = await axios.get(
          'https://api.spotify.com/v1/me/top/tracks?limit=50',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopTracks(response.data.items);
      } catch (error) {
        console.error('Error fetching top tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading top tracks...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={topTracks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15, padding: 10, backgroundColor: '#f0f0f0' }}>
            <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
            <Text>by {item.artists.map((artist) => artist.name).join(', ')}</Text>
          </View>
        )}
      />
    </View>
  );
}