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
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import type { TabParamList } from '../../navigation/TabNavigator';
import { fetchCurrentUser } from '../../services/userService';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

interface HomeScreenProps {
  toggleSidebar?: () => void;
}

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

export default function HomeScreen({ toggleSidebar }: HomeScreenProps) {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile and Spotify data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Try to fetch user profile from your API
        const userData = await fetchCurrentUser();
        if (userData) {
          setUserProfile(userData);
          setUserName(userData.displayName);
        }
        
        // Check Spotify connection
        const spotifyToken = await AsyncStorage.getItem('spotify_token');
        if (!spotifyToken) {
          setIsSpotifyConnected(false);
          setLoadingTracks(false);
          setLoading(false);
          return;
        }

        setIsSpotifyConnected(true);
        
        // Fetch user data from Spotify
        try {
          // Only fetch from Spotify if we don't have user data
          if (!userData || !userData.displayName) {
            const userResponse = await axios.get('https://api.spotify.com/v1/me', {
              headers: { Authorization: `Bearer ${spotifyToken}` },
            });
            setUserName(userResponse.data.display_name);
          }
          
          // Fetch top tracks from Spotify
          const tracksResponse = await axios.get(
            'https://api.spotify.com/v1/me/top/tracks?limit=50',
            { headers: { Authorization: `Bearer ${spotifyToken}` } }
          );
          setTopTracks(tracksResponse.data.items);
        } catch (error: any) {
          console.error('API Error status:', error.response?.status);
          if (error.response?.status === 401) {
            console.log('Token expired, need to re-authenticate');
            setIsSpotifyConnected(false);
          } else {
            console.error('Error fetching data:', error);
          }
        }
      } catch (networkError) {
        console.error('Network error:', networkError);
      } finally {
        setLoadingTracks(false);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const renderTrackItem = ({ item }: { item: Track }) => (
    <View style={styles.trackItem}>
      <Image source={{ uri: item.album.images[0]?.url }} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackName}>{item.name}</Text>
        <Text style={styles.trackArtist}>
          {item.artists.map(artist => artist.name).join(', ')}
        </Text>
      </View>
      <Text style={styles.trackDuration}>5:33</Text>
      <Ionicons name="ellipsis-vertical" size={20} color="#fff" style={styles.moreIcon} />
    </View>
  );

  const navigateToDNACode = () => {
    navigation.navigate('DNACode');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading your music profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.greeting}>Hello, {userName || 'Music Lover'}!</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image 
              source={{ 
                uri: userProfile?.profileImage || 'https://via.placeholder.com/40'
              }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>
        
        {/* DNA Code Button */}
        <TouchableOpacity 
          style={styles.dnaButton}
          onPress={navigateToDNACode}
        >
          <Text style={styles.dnaButtonText}>See Your DNA Code</Text>
        </TouchableOpacity>
        
        <Text style={styles.sectionTitle}>Most Listened Tracks</Text>
        
        {loadingTracks ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : topTracks.length > 0 ? (
          <FlatList
            data={topTracks}
            renderItem={renderTrackItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No tracks found. Start listening to music on Spotify to see your most played tracks!
            </Text>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  dnaButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  dnaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#FFD700',
    marginBottom: 10,
  },
  trackItem: {
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
  trackDuration: {
    fontSize: 12,
    color: '#fff',
    marginRight: 10,
  },
  moreIcon: {
    marginLeft: 'auto',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  loadingText: {
    marginTop: 15,
    color: '#FFD700',
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});