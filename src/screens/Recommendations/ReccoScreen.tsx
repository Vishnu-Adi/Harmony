//// filepath: /Users/vishnuadithya/Documents/Projects/Harmony/Music-app/src/components/Recommendations/ReccoScreen.tsx
import React, { useEffect, useState } from 'react';
import { 
    SafeAreaView, 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    Image, 
    TouchableOpacity, 
    StyleSheet 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

export default function ReccoScreen() {
  const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = await AsyncStorage.getItem('spotify_token');
        if (!token) {
          setError('Spotify not connected. Please authenticate.');
          setLoading(false);
          return;
        }
        // Fetch user's top 50 tracks
        const topTracksResponse = await axios.get(
          'https://api.spotify.com/v1/me/top/tracks?limit=50',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const topTracks: Track[] = topTracksResponse.data.items;
        if (topTracks.length === 0) {
          setError('No top tracks found.');
          setLoading(false);
          return;
        }
        // Use first 5 track IDs as seed for recommendations
        const seedTracks = topTracks.slice(0, 5).map(track => track.id).join(',');
        const recommendationsResponse = await axios.get(
          `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracks}&limit=20`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecommendedTracks(recommendationsResponse.data.tracks);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to fetch recommendations.');
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const renderTrackItem = ({ item }: { item: Track }) => (
    <TouchableOpacity style={styles.trackCard}>
      <Image source={{ uri: item.album.images[0]?.url }} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.trackArtist} numberOfLines={1}>{item.artists.map(a => a.name).join(', ')}</Text>
      </View>
      <Ionicons name="ellipsis-vertical" size={20} color="#fff" style={styles.moreIcon} />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
          <Text style={styles.loadingText}>Fetching recommendations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Recommended Songs</Text>
        <FlatList
          data={recommendedTracks}
          renderItem={renderTrackItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  listContent: {
    paddingBottom: 20,
  },
  trackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  trackImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  trackInfo: {
    flex: 1,
  },
  trackName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  trackArtist: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  moreIcon: {
    marginLeft: 'auto',
  },
});