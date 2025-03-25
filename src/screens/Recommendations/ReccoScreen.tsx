import React, { useEffect, useState } from 'react';
import { 
    SafeAreaView, 
    View, 
    Text, 
    FlatList, 
    ActivityIndicator, 
    Image, 
    TouchableOpacity, 
    StyleSheet,
    Alert
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';

interface Artist {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
  followers: { total: number };
  popularity: number;
}

type ReccoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

// Sample popular artists to use as fallback when user has no listening history
const FALLBACK_ARTISTS: Partial<Artist>[] = [
  { 
    id: '1', 
    name: 'Taylor Swift', 
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0' }],
    genres: ['pop', 'country pop'],
    followers: { total: 82000000 },
    popularity: 95
  },
  { 
    id: '2', 
    name: 'The Weeknd', 
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb48968df3d9b48f8c6a6c794e' }],
    genres: ['canadian pop', 'r&b'],
    followers: { total: 60000000 },
    popularity: 93
  },
  { 
    id: '3', 
    name: 'Kendrick Lamar', 
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022' }],
    genres: ['hip hop', 'rap', 'west coast rap'],
    followers: { total: 40000000 },
    popularity: 90
  },
  { 
    id: '4', 
    name: 'Dua Lipa', 
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb97f5306b2fad517bca8238ec' }],
    genres: ['dance pop', 'pop'],
    followers: { total: 36000000 },
    popularity: 88
  },
  { 
    id: '5', 
    name: 'Drake', 
    images: [{ url: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9' }],
    genres: ['canadian hip hop', 'rap'],
    followers: { total: 70000000 },
    popularity: 96
  }
];

export default function ReccoScreen() {
  const navigation = useNavigation<ReccoScreenNavigationProp>();
  const [recommendedArtists, setRecommendedArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const fetchArtistRecommendations = async () => {
      try {
        const token = await AsyncStorage.getItem('spotify_token');
        if (!token) {
          setError('Spotify not connected. Please authenticate.');
          setLoading(false);
          return;
        }

        try {
          // First, fetch user's top artists with expanded timeframes for better results
          const topArtistsResponse = await axios.get(
            'https://api.spotify.com/v1/me/top/artists?limit=5&time_range=medium_term',
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          const topArtists = topArtistsResponse.data.items;
          
          // If no top artists found with medium_term, try long_term
          if (topArtists.length === 0) {
            try {
              const longTermResponse = await axios.get(
                'https://api.spotify.com/v1/me/top/artists?limit=5&time_range=long_term',
                { headers: { Authorization: `Bearer ${token}` } }
              );
              
              if (longTermResponse.data.items.length > 0) {
                // If we found artists with long_term, use those
                const relatedArtistsPromises = longTermResponse.data.items.map((artist: any) => 
                  axios.get(
                    `https://api.spotify.com/v1/artists/${artist.id}/related-artists`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  )
                );

                const relatedArtistsResponses = await Promise.all(relatedArtistsPromises);
                processArtistData(relatedArtistsResponses);
                return;
              } else {
                // If still no history, use fallback artists
                useFallbackArtists();
                return;
              }
            } catch (timeRangeError) {
              // If error with long_term, use fallback
              console.error('Error fetching long-term artists:', timeRangeError);
              useFallbackArtists();
              return;
            }
          }

          // For each top artist, get related artists
          const relatedArtistsPromises = topArtists.map(artist => 
            axios.get(
              `https://api.spotify.com/v1/artists/${artist.id}/related-artists`,
              { headers: { Authorization: `Bearer ${token}` } }
            )
          );

          const relatedArtistsResponses = await Promise.all(relatedArtistsPromises);
          processArtistData(relatedArtistsResponses);
          
        } catch (apiError: any) {
          console.error('API Error:', apiError.response?.status, apiError.response?.data);
          
          if (apiError.response?.status === 404) {
            Alert.alert(
              'Data Not Found',
              'Either this endpoint is not available or you need to build more Spotify listening history.',
              [
                { text: 'Use Sample Data', onPress: () => useFallbackArtists() },
                { text: 'Reconnect Spotify', onPress: () => navigation.navigate('SpotifyAuth') }
              ]
            );
          } else if (apiError.response?.status === 401) {
            Alert.alert(
              'Authentication Error',
              'Your Spotify session has expired. Please reconnect.',
              [{ text: 'Reconnect', onPress: () => navigation.navigate('SpotifyAuth') }]
            );
          } else {
            // For other errors, use fallback
            useFallbackArtists();
          }
        }
      } catch (err) {
        console.error('Error fetching artist recommendations:', err);
        useFallbackArtists();
      } finally {
        setLoading(false);
      }
    };
    
    fetchArtistRecommendations();
  }, [navigation]);

  const processArtistData = (relatedArtistsResponses: any[]) => {
    // Combine all related artists into a single array and remove duplicates
    let allRelatedArtists: Artist[] = [];
    relatedArtistsResponses.forEach(response => {
      allRelatedArtists = [...allRelatedArtists, ...response.data.artists];
    });
    
    // Remove duplicates by ID
    const uniqueArtists = Array.from(
      new Map(allRelatedArtists.map(artist => [artist.id, artist])).values()
    );
    
    // Limit to 20 artists max
    setRecommendedArtists(uniqueArtists.slice(0, 20));
  };

  const useFallbackArtists = () => {
    setIsUsingFallback(true);
    setRecommendedArtists(FALLBACK_ARTISTS as Artist[]);
  };

  const renderArtistItem = ({ item }: { item: Artist }) => (
    <TouchableOpacity style={styles.artistCard}>
      <Image 
        source={{ uri: item.images[0]?.url || 'https://via.placeholder.com/80' }} 
        style={styles.artistImage} 
      />
      <View style={styles.artistInfo}>
        <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.artistGenres} numberOfLines={1}>
          {(item.genres || []).slice(0, 3).join(', ')}
        </Text>
        <View style={styles.statsContainer}>
          <Text style={styles.followersText}>
            {formatFollowers(item.followers?.total || 0)} followers
          </Text>
          <View style={styles.popularityContainer}>
            <Text style={styles.popularityText}>Popularity: </Text>
            <View style={styles.popularityMeter}>
              <View style={[styles.popularityFill, { width: `${item.popularity || 0}%` }]} />
            </View>
          </View>
        </View>
      </View>
      <Ionicons name="ellipsis-vertical" size={20} color="#fff" style={styles.moreIcon} />
    </TouchableOpacity>
  );

  const formatFollowers = (number: number) => {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
          <Text style={styles.loadingText}>Finding artists you'll love...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !isUsingFallback) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.reconnectButton}
            onPress={() => navigation.navigate('SpotifyAuth')}
          >
            <Text style={styles.reconnectText}>Reconnect with Spotify</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.reconnectButton, {backgroundColor: '#333'}]}
            onPress={() => useFallbackArtists()}
          >
            <Text style={styles.reconnectText}>Use Sample Data</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Artists You Might Like</Text>
        {isUsingFallback && (
          <View style={styles.fallbackBanner}>
            <Text style={styles.fallbackText}>
              Using sample recommendations. Connect Spotify for personalized suggestions.
            </Text>
            <TouchableOpacity 
              style={styles.smallButton}
              onPress={() => navigation.navigate('SpotifyAuth')}
            >
              <Text style={styles.smallButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        )}
        {!isUsingFallback && (
          <Text style={styles.subHeader}>Based on your listening history</Text>
        )}
        <FlatList
          data={recommendedArtists}
          renderItem={renderArtistItem}
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
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 14,
    color: '#CBD5E1',
    marginBottom: 20,
  },
  fallbackBanner: {
    backgroundColor: 'rgba(29, 185, 84, 0.2)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fallbackText: {
    color: '#CBD5E1',
    fontSize: 12,
    flex: 1,
    marginRight: 10,
  },
  smallButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  smallButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginBottom: 20,
  },
  reconnectButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 15,
    alignItems: 'center',
    width: '80%',
  },
  reconnectText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  artistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artistGenres: {
    fontSize: 13,
    color: '#CBD5E1',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'column',
  },
  followersText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  popularityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularityText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  popularityMeter: {
    height: 4,
    width: 60,
    backgroundColor: '#475569',
    borderRadius: 2,
    overflow: 'hidden',
    marginLeft: 4,
  },
  popularityFill: {
    height: '100%',
    backgroundColor: '#1DB954',
  },
  moreIcon: {
    marginLeft: 10,
  },
});