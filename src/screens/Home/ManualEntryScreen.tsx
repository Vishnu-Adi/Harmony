// File: src/screens/Home/ManualEntryScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


type ManualEntryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ManualEntry'
>;

interface Suggestion {
    id: string;
    name: string;
    artists: {name: string}[]; // Array of artists
}


const ManualEntryScreen = () => {
  const navigation = useNavigation<ManualEntryScreenNavigationProp>();
  const [tracks, setTracks] = useState<(string | null)[]>(Array(10).fill(null));
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);


  const handleTrackChange = async (index: number, text: string) => {
    const newTracks = [...tracks];
    newTracks[index] = text;
    setTracks(newTracks);
    setLoading(true)
      try {
          if (text.length > 2)
          {
            const token = await AsyncStorage.getItem('spotify_token');
            const response = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(text)}&type=track&limit=5`,
            {
                headers: {
                Authorization: `Bearer ${token}`, // Use the stored token
                },
            }
            );
            console.log("response", response.data.tracks.items)
             if (response.data.tracks && response.data.tracks.items) {
                setSuggestions(response.data.tracks.items);
            } else {
                setSuggestions([]);
                console.warn("Unexpected response format or empty items array");
            }
        } else {
            setSuggestions([]); // Clear suggestions if text is too short
        }
        }
        catch (error)
        {
        console.error("Error during Spotify search:", error);
        } finally
        {
            setLoading(false)
        }
  };
   const handleSelectSuggestion = (trackName: string, index:number) => {
    const newTracks = [...tracks];
    newTracks[index] = trackName;  // Correctly updates the specific track
    setTracks(newTracks);
    setSuggestions([]); // Clear suggestions after selection
  };

  const handleSubmit = async () => {
    // Basic validation: Check if at least one track is entered
    if (tracks.filter(Boolean).length === 0) {
      Alert.alert('Error', 'Please enter at least one track.');
      return;
    }

    // Store the manually entered tracks.  Crucially, filter out the null entries.
        const filledTracks = tracks.filter((track): track is string => track !== null);
        try {
        await AsyncStorage.setItem('manual_tracks', JSON.stringify(filledTracks));
        navigation.navigate('Home');  // Navigate *after* successful storage
        } catch (error) {
        console.error('Error storing manual tracks:', error);
        Alert.alert('Error', 'Failed to save your tracks. Please try again.');
        }

  };

   const renderSuggestionItem = ({ item }: { item: Suggestion }) => (
        <TouchableOpacity
          style={styles.suggestionItem}
          onPress={() => handleSelectSuggestion(item.name, tracks.findIndex(t => t === null || t === ''))} //Find the available index for that song
        >
            <Text style={styles.suggestionText}>
              {item.name} - {item.artists.map(artist => artist.name).join(', ')}
            </Text>
        </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Top 10 Songs</Text>
       {loading && <ActivityIndicator size="small" color="#0000ff" />}
        <FlatList
        data={suggestions}
        renderItem={renderSuggestionItem}
        keyExtractor={(item) => item.id}
        style={styles.suggestionsList}
      />
      {tracks.map((track, index) => (
        <TextInput
          key={index}
          style={styles.input}
          placeholder={`Song ${index + 1}`}
          value={track || ''}
          onChangeText={(text) => handleTrackChange(index, text)}
        />
      ))}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
    suggestionsList: {
    maxHeight: 150, // Limit the height of the suggestion list
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
  },
});

export default ManualEntryScreen;