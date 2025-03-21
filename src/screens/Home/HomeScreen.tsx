// File: src/screens/Home/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  images: { url: string }[];
}

export default function HomeScreen() {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
    const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);

  useEffect(() => {
      const fetchData = async () => {
      const spotifyToken = await AsyncStorage.getItem('spotify_token');
      const manualTracksString = await AsyncStorage.getItem('manual_tracks');
      setIsSpotifyConnected(!!spotifyToken);
            if (!spotifyToken && !manualTracksString) {
              setLoadingTracks(false);
              setLoadingPlaylists(false);
              return; // Exit if no Spotify token and no manual tracks
            }

    // Fetch User Profile
        if (spotifyToken) {
          try {
            const userResponse = await axios.get('https://api.spotify.com/v1/me', {
              headers: { Authorization: `Bearer ${spotifyToken}` },
            });
            setUserName(userResponse.data.display_name);
          } catch (userError) {
            console.error('Error fetching user profile:', userError);
             Alert.alert("Error", "Failed to fetch user profile. Please check your internet connection.");
          }
        }

       if (spotifyToken) {
        // Fetch Top Tracks (Spotify)
        try {
          const tracksResponse = await axios.get(
            'https://api.spotify.com/v1/me/top/tracks?limit=5', // Change back to 50
            { headers: { Authorization: `Bearer ${spotifyToken}` } }
          );

          if (tracksResponse.data.items && Array.isArray(tracksResponse.data.items)) {
            setTopTracks(tracksResponse.data.items);
          } else {
            console.warn('Unexpected tracks response format:', tracksResponse.data);
            Alert.alert('Error', 'Failed to load top tracks.');
            setTopTracks([]);
          }
        } catch (tracksError) {
          console.error('Error fetching top tracks:', tracksError);
          Alert.alert('Error', 'Failed to fetch top tracks.');
        } finally {
          setLoadingTracks(false);
        }
       }
       else if (manualTracksString)
       {
            // Use manual tracks if no Spotify connection
            try {
                const manualTracks: string[] = JSON.parse(manualTracksString);
                //Since manual tracks are not from Spotify, we can't directly use them.
                //We need to convert them to a similar format as the `Track` interface.
                const transformedTracks: Track[] = manualTracks.map((trackName, index) => ({
                id: `manual-${index}`, // Create a unique ID
                name: trackName,
                artists: [{ name: 'Unknown Artist' }], // Placeholder artist
                album: { images: [] }, // Placeholder album
                }));

                setTopTracks(transformedTracks);
            } catch (parseError)
            {
                console.error('Error parsing manual tracks:', parseError);
                Alert.alert('Error', 'Failed to load your manually entered tracks.');
            } finally {
                setLoadingTracks(false); // Ensure loading is set to false
            }

       }


      // Fetch Playlists (Only if Spotify is connected)
        if (spotifyToken) {
        try {
            const playlistsResponse = await axios.get(
            'https://api.spotify.com/v1/me/playlists?limit=5',
            { headers: { Authorization: `Bearer ${spotifyToken}` } }
            );

            if (
            playlistsResponse.data.items &&
            Array.isArray(playlistsResponse.data.items)
            ) {
            setPlaylists(playlistsResponse.data.items);
            } else {
            console.warn('Unexpected playlists response format:', playlistsResponse.data);
            Alert.alert('Error', 'Failed to load playlists.');
            setPlaylists([]);
            }
        } catch (playlistsError) {
            console.error('Error fetching playlists:', playlistsError);
            Alert.alert('Error', 'Failed to fetch playlists.');
        } finally {
            setLoadingPlaylists(false);
        }
        } else {
          setLoadingPlaylists(false); // If no Spotify, don't load playlists.
        }
    };

    fetchData();
  }, []);

  const renderTrackItem = ({ item }: { item: Track }) => (
     <View style={styles.trackItem}>
      {/* Display a placeholder if no album image exists */}
      {item.album.images.length > 0 ? (
        <Image source={{ uri: item.album.images[0].url }} style={styles.trackImage} />
      ) : (
        <View style={[styles.trackImage, styles.placeholderImage]} /> // Use a placeholder style
      )}
      <View style={styles.trackInfo}>
        <Text style={styles.trackName}>{item.name}</Text>
        <Text style={styles.trackArtist}>
          by {item.artists.map((artist) => artist.name).join(', ')}
        </Text>
      </View>
    </View>
  );

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <View style={styles.playlistItem}>
      {/* Display a placeholder if no playlist image exists */}
      {item.images.length > 0 ? (
        <Image source={{ uri: item.images[0].url }} style={styles.playlistImage} />
      ) : (
        <View style={[styles.playlistImage, styles.placeholderImage]} /> // Use a placeholder style
      )}
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistDescription}>
          {item.description || 'No description'}
        </Text>
      </View>
    </View>
  );

  return (
     <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome, {userName || 'User'}!</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {isSpotifyConnected ? 'Your Top 5 Songs' : 'Your Top Songs'}
        </Text>
        {loadingTracks ? (
          <ActivityIndicator size="small" color="#2dd4bf" />
        ) : topTracks.length > 0 ? (
          <FlatList
            data={topTracks}
            renderItem={renderTrackItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          <Text style={styles.emptyText}>No top tracks found.</Text>
        )}
      </View>

      {isSpotifyConnected && (  // Conditionally render playlists
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Playlists</Text>
          {loadingPlaylists ? (
            <ActivityIndicator size="small" color="#2dd4bf" />
          ) : playlists.length > 0 ? (
            <FlatList
              data={playlists}
              renderItem={renderPlaylistItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <Text style={styles.emptyText}>No playlists found.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0f2fe',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0369a1',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0369a1',
  },
  trackItem: {
    width: 150,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  trackImage: {
    width: 150,
    height: 150,
  },
  trackInfo: {
    padding: 10,
  },
  trackName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  trackArtist: {
    fontSize: 12,
    color: '#6b7280',
  },
  playlistItem: {
    width: 150,
    marginRight: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  playlistImage: {
    width: 150,
    height: 150,
  },
  playlistInfo: {
    padding: 10,
  },
  playlistName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  playlistDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyText: {
    color: '#6b7280',
  },
  horizontalList: {
    paddingVertical: 10,
  },
    placeholderImage: {
    backgroundColor: '#ddd', // Light gray background
    justifyContent: 'center',
    alignItems: 'center',
  },
});