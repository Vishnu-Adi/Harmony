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
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const spotifyToken = await AsyncStorage.getItem('spotify_token');
        if (!spotifyToken) {
          setIsSpotifyConnected(false);
          setLoadingTracks(false);
          return;
        }
        setIsSpotifyConnected(true);
        
        // Verify token validity and fetch user info and top tracks
        try {
          const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${spotifyToken}` },
          });
          setUserName(userResponse.data.display_name);
          
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

      <Ionicons name="ellipsis-vertical" size={20} color="#fff" style={styles.moreIcon} />
    </View>
  );

  const navigateToDNACode = () => {
    navigation.navigate('DNACode');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.greeting}>Hello, {userName || 'User'}!</Text>
          <TouchableOpacity>
            <Image source={{ uri: 'https://via.placeholder.com/40' }} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
        {/* New DNA Code Button */}
        <TouchableOpacity 
          style={styles.dnaButton}
          onPress={navigateToDNACode}
        >
          <Text style={styles.dnaButtonText}>See Your DNA Code</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Most Listened Tracks</Text>
        {loadingTracks ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <FlatList
            data={topTracks}
            renderItem={renderTrackItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />
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
});