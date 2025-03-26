import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Animated,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { LinearGradient } from 'expo-linear-gradient';

const ALBUM_COVER = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DW226otLXNn5BunBBolecrbwShg72C.png';

export default function ReviewScreen({ navigation }) {
  // State management
  const [rating, setRating] = useState(4.5);
  const [review, setReview] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  
  // Animation for publish button
  const publishScale = useRef(new Animated.Value(1)).current;
  
  // Handle star rating selection
  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };
  
  // Star precision handling for half stars
  const handleStarPress = (starIndex, event) => {
    const { locationX, width } = event.nativeEvent;
    const position = locationX / width;
    
    if (position <= 0.5) {
      setRating(starIndex + 0.5);
    } else {
      setRating(starIndex + 1);
    }
  };
  
  // Toggle favorite state
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  // Date picker handlers
  const showDatePicker = () => setDatePickerVisible(true);
  const hideDatePicker = () => setDatePickerVisible(false);
  
  const handleConfirmDate = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };
  
  // Format date for display
  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Publish animation and navigation
  const publishReview = () => {
    Animated.sequence([
      Animated.timing(publishScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(publishScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const newReview = {
        id: Date.now().toString(),
        user: 'John Doe',
        review,
        rating,
        isFavorite,
        date: formatDate(date),
      };
      navigation.navigate('Forum', { newReview });
    });
  };
  
  // Render stars with current rating
  const renderStars = () => {
    const stars = [];
    
    for (let i = 0; i < 5; i++) {
      const starValue = i + 1;
      let starName = 'star-o';
      
      if (rating >= starValue) {
        starName = 'star';
      } else if (rating > i && rating < starValue) {
        starName = 'star-half-o';
      }
      
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRating(starValue)}
          onStartShouldSetResponder={() => true}
          onResponderGrant={(event) => handleStarPress(i, event)}
          style={styles.starContainer}
        >
          <FontAwesome name={starName} size={36} color="#FFD700" />
        </TouchableOpacity>
      );
    }
    
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header with background image and gradient overlay */}
          <View style={styles.header}>
            <Image 
              source={{ uri: ALBUM_COVER }} 
              style={styles.headerBackground}
              blurRadius={Platform.OS === 'ios' ? 10 : 5}
            />
            <LinearGradient
              colors={['rgba(18, 18, 18, 0.5)', 'rgba(18, 18, 18, 0.9)', '#121212']}
              style={styles.headerGradient}
            >
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              
              <Text style={styles.pageTitle}>Write A Review</Text>
            </LinearGradient>
          </View>
          
          {/* Album Info Section */}
          <View style={styles.albumInfoSection}>
            <Image source={{ uri: ALBUM_COVER }} style={styles.albumCover} />
            
            <View style={styles.albumInfo}>
              <Text style={styles.albumTitle}>After Hours</Text>
              <Text style={styles.artistName}>The Weeknd</Text>
              <Text style={styles.albumYear}>2020 • 14 tracks</Text>
            </View>
          </View>
          
          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Rating</Text>
              <Text style={styles.ratingNumber}>{rating.toFixed(1)}/5.0</Text>
            </View>
            
            <View style={styles.starsRow}>
              {renderStars()}
            </View>
            
            <TouchableOpacity 
              style={[styles.favoriteButton, isFavorite ? styles.favoritedButton : {}]}
              onPress={toggleFavorite}
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={20} 
                color={isFavorite ? "#fff" : "#fff"} 
              />
              <Text style={styles.favoriteText}>
                {isFavorite ? "Added to Favorites" : "Add to Favorites"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Watch Date Section */}
          <View style={styles.dateSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Listen Date</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.dateSelector}
              onPress={showDatePicker}
            >
              <MaterialIcons name="calendar-today" size={20} color="#fff" />
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <Text style={styles.changeDateText}>Change</Text>
            </TouchableOpacity>
          </View>
          
          {/* Review Text Section */}
          <View style={styles.reviewSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Review</Text>
            </View>
            
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your thoughts about this album..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              multiline
              textAlignVertical="top"
              value={review}
              onChangeText={setReview}
            />
            
            <View style={styles.publishButtonContainer}>
              <Animated.View style={{ transform: [{ scale: publishScale }] }}>
                <TouchableOpacity 
                  style={styles.publishButton}
                  onPress={publishReview}
                >
                  <Text style={styles.publishText}>Publish Review</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        date={date}
        maximumDate={new Date()}
        themeVariant="dark"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 220,
    position: 'relative',
  },
  headerBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  albumInfoSection: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  albumCover: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  albumInfo: {
    marginLeft: 15,
    flex: 1,
  },
  albumTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  artistName: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 4,
    opacity: 0.8,
  },
  albumYear: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  ratingSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ratingNumber: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  starContainer: {
    padding: 5,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    borderRadius: 8,
  },
  favoritedButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
  },
  favoriteText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 15,
  },
  dateSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    padding: 14,
  },
  dateText: {
    flex: 1,
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
  changeDateText: {
    color: '#5E81AC',
    fontSize: 14,
  },
  reviewSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  reviewInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 16,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  publishButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  publishButton: {
    backgroundColor: '#5E81AC',
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  publishText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});