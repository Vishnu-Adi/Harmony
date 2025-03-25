// export default MusicAppScreen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple navigation hook
const useAnyNavigation = () => useNavigation<any>();

// Define the Artist type – popularity comes directly from Spotify (0-100)
interface Artist {
  name: string;
  url: string;
  image: string;
  popularity: number;
}

// Fallback data in case API fails
const FALLBACK_ARTISTS: Artist[] = [
  {
    name: 'A. R. Rahman',
    url: 'https://open.spotify.com/artist/0FQkQFzQm5m08YarGmmXcS',
    image: 'https://via.placeholder.com/100',
    popularity: 85,
  },
  {
    name: 'Anirudh Ravichander',
    url: 'https://open.spotify.com/artist/1B2G6m6ytYYUmY1jSbsBlL',
    image: 'https://via.placeholder.com/100',
    popularity: 90,
  },
  {
    name: 'Dua Lipa',
    url: 'https://open.spotify.com/artist/6M2wZ9GZgrQXHCFfjv46we',
    image: 'https://via.placeholder.com/100',
    popularity: 92,
  },
  {
    name: 'The Weeknd',
    url: 'https://open.spotify.com/artist/1Xyo4u8uXC1ZmMpatF05PJ',
    image: 'https://via.placeholder.com/100',
    popularity: 95,
  },
  {
    name: 'Taylor Swift',
    url: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
    image: 'https://via.placeholder.com/100',
    popularity: 93,
  },
];

export default function ArtistRecoScreen() {
  const navigation = useAnyNavigation();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters: language, genre and minimum popularity
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [minPopularity, setMinPopularity] = useState(0);

  // Dropdown visibility state
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showGenrePicker, setShowGenrePicker] = useState(false);

  // Mapping for language tags – used to append to the query if needed.
  const languageMapping: { [key: string]: string } = {
    en: '', // For English, we leave it blank.
    ta: 'tamil',
    hi: 'hindustani',
    te: 'telugu',
  };

  const languages = [
    { label: 'English', value: 'en' },
    { label: 'Tamil', value: 'ta' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Telugu', value: 'te' },
  ];

  // Extended list of genres; feel free to add more genres as needed.
  const genres = [
    { label: 'All Genres', value: '' },
    { label: 'Rock', value: 'rock' },
    { label: 'Pop', value: 'pop' },
    { label: 'Soundtrack', value: 'soundtrack' },
    { label: 'Hip-Hop/Rap', value: 'hip-hop' },
    { label: 'R&B/Soul', value: 'r&b' },
    { label: 'Electronic', value: 'electronic' },
    { label: 'Jazz', value: 'jazz' },
    { label: 'Classical', value: 'classical' },
    { label: 'Country', value: 'country' },
    { label: 'classic kollywood', value: 'classic kollywood' },
    { label: 'Indie', value: 'indie' },
    { label: 'Metal', value: 'metal' },
    { label: 'Reggae', value: 'reggae' },
    { label: 'Blues', value: 'blues' },
    { label: 'Folk', value: 'folk' },
  
  ];

  // When filters change, fetch recommendations.
  useEffect(() => {
    fetchArtists();
  }, [selectedLanguage, selectedGenre, minPopularity]);

  // Build query for Spotify API using genre and language mapping.
  const buildQuery = (): string => {
    const baseQuery = selectedGenre !== '' ? selectedGenre : 'pop';
    const langTag = languageMapping[selectedLanguage];
    return langTag ? `${baseQuery} ${langTag}` : baseQuery;
  };

  // Fetch artists from Spotify API using the search endpoint.
  // Then filter the results based on the minPopularity slider value.
  const fetchArtists = async () => {
    setLoading(true);
    setError(null);
    try {
      const spotifyToken = await AsyncStorage.getItem('spotify_token');
      if (!spotifyToken) {
        setError('Spotify token not found.');
        setArtists(FALLBACK_ARTISTS);
        setLoading(false);
        return;
      }

      const query = buildQuery();
      // Use the Spotify search endpoint with the genre filter operator.
      const searchQuery = `genre:"${query}"`;
      const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        searchQuery
      )}&type=artist&limit=20`;

      console.log('Fetching from Spotify URL:', url);
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${spotifyToken}` },
      });

      if (response.data.artists && response.data.artists.items) {
        // Filter artists by the minPopularity slider value.
        const fetchedArtists: Artist[] = response.data.artists.items
          .map((item: any) => ({
            name: item.name,
            url: item.external_urls.spotify,
            image:
              item.images && item.images.length > 0
                ? item.images[0].url
                : 'https://via.placeholder.com/100',
            popularity: item.popularity,
          }))
          .filter((artist: Artist) => artist.popularity >= minPopularity);
        setArtists(fetchedArtists);
      } else {
        setArtists(FALLBACK_ARTISTS);
      }
    } catch (err) {
      console.error('Error fetching artists from Spotify:', err);
      setError('Failed to fetch artists. Showing fallback data.');
      setArtists(FALLBACK_ARTISTS);
    } finally {
      setLoading(false);
    }
  };

  const renderArtistItem = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      style={styles.artistCard}
      onPress={() => console.log(`Selected artist: ${item.name}`)}
    >
      <Image source={{ uri: item.image }} style={styles.artistImage} />
      <View style={styles.artistInfo}>
        <Text style={styles.artistName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.artistGenre} numberOfLines={1}>
          {item.url}
        </Text>
        <Text style={styles.popularityText}>Popularity: {item.popularity}</Text>
      </View>
      <Ionicons name="ellipsis-vertical" size={20} color="#fff" style={styles.moreIcon} />
    </TouchableOpacity>
  );

  const getLanguageLabel = () => {
    const lang = languages.find((l) => l.value === selectedLanguage);
    return lang ? lang.label : 'English';
  };

  const getGenreLabel = () => {
    const genre = genres.find((g) => g.value === selectedGenre);
    return genre ? genre.label : 'All Genres';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Artist Recommendations</Text>
        <View style={styles.filterRow}>
          {/* Language Filter */}
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Language:</Text>
            <TouchableOpacity
              style={styles.customPickerButton}
              onPress={() => setShowLanguagePicker(!showLanguagePicker)}
            >
              <Text style={styles.customPickerButtonText}>{getLanguageLabel()}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#fff" />
            </TouchableOpacity>
            {showLanguagePicker && (
              <View style={styles.pickerDropdown}>
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.value}
                    style={[
                      styles.pickerOption,
                      selectedLanguage === lang.value && styles.pickerOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedLanguage(lang.value);
                      setShowLanguagePicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        selectedLanguage === lang.value && styles.pickerOptionTextSelected,
                      ]}
                    >
                      {lang.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          {/* Genre Filter */}
          <View style={styles.pickerWrapper}>
            <Text style={styles.pickerLabel}>Genre:</Text>
            <TouchableOpacity
              style={styles.customPickerButton}
              onPress={() => setShowGenrePicker(!showGenrePicker)}
            >
              <Text style={styles.customPickerButtonText}>{getGenreLabel()}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="#fff" />
            </TouchableOpacity>
            {showGenrePicker && (
              <View style={styles.pickerDropdown}>
                {genres.map((genre) => (
                  <TouchableOpacity
                    key={genre.value}
                    style={[
                      styles.pickerOption,
                      selectedGenre === genre.value && styles.pickerOptionSelected,
                    ]}
                    onPress={() => {
                      setSelectedGenre(genre.value);
                      setShowGenrePicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        selectedGenre === genre.value && styles.pickerOptionTextSelected,
                      ]}
                    >
                      {genre.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
        {/* Popularity Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>
            Minimum Popularity: {minPopularity}
          </Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={1}
            value={minPopularity}
            minimumTrackTintColor="#1DB954"
            maximumTrackTintColor="#fff"
            thumbTintColor="#1DB954"
            onValueChange={(value) => setMinPopularity(value)}
          />
        </View>
        <TouchableOpacity
          style={styles.applyFilterButton}
          onPress={() => {
            fetchArtists();
            setShowLanguagePicker(false);
            setShowGenrePicker(false);
          }}
        >
          <Text style={styles.applyFilterText}>Apply Filters</Text>
        </TouchableOpacity>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1DB954" />
            <Text style={styles.loadingText}>Loading artists...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={artists}
            renderItem={renderArtistItem}
            keyExtractor={(item) => item.name}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No artists found.</Text>
              </View>
            }
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
  headerTitle: {
    fontSize: 28,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  pickerWrapper: {
    flex: 1,
    marginHorizontal: 5,
    zIndex: 2,
  },
  pickerLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  customPickerButton: {
    backgroundColor: '#334155',
    borderRadius: 12,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  customPickerButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  pickerDropdown: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    backgroundColor: '#475569',
    borderRadius: 12,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  pickerOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  pickerOptionSelected: {
    backgroundColor: 'rgba(29, 185, 84, 0.3)',
  },
  pickerOptionText: {
    color: '#fff',
    fontSize: 14,
  },
  pickerOptionTextSelected: {
    fontWeight: 'bold',
    color: '#1DB954',
  },
  sliderContainer: {
    marginBottom: 20,
  },
  sliderLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  applyFilterButton: {
    backgroundColor: '#1DB954',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 1,
  },
  applyFilterText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    color: '#1DB954',
    fontSize: 16,
  },
  errorContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 30,
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
  },
  artistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    backgroundColor: '#1E293B',
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  artistGenre: {
    fontSize: 14,
    color: '#CBD5E1',
    fontStyle: 'italic',
  },
  popularityText: {
    fontSize: 12,
    color: '#1DB954',
    marginTop: 4,
  },
  moreIcon: {
    marginLeft: 10,
  },
});

