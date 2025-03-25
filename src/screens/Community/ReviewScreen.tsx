//Review Screen
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
  Pressable,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios'; // Import axios for API calls

const ReviewScreen = ({ navigation, route }) => {
  // State for form values
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [date, setDate] = useState(new Date('2022-03-06'));
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  
  // Animation values
  const publishScale = useRef(new Animated.Value(1)).current;
  
  // Handle star rating
  const handleRating = (selectedRating) => {
    setRating(selectedRating);
  };
  
  // Handle half star rating with touch position
  const handleStarPress = (starIndex, event) => {
    const { locationX, width } = event.nativeEvent;
    const position = locationX / width;
    
    if (position <= 0.5) {
      // User pressed on the left half of the star
      setRating(starIndex + 0.5);
    } else {
      // User pressed on the right half of the star
      setRating(starIndex + 1);
    }
  };
  
  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  // Date picker handlers
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  
  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };
  
  const handleConfirmDate = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };
  
  // Format date for display
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };
  
  // Publish button animation
  const animatePublish = () => {
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
      // Create the new review object
      const newReview = {
        _id: Date.now().toString(), // Generate a unique ID for the review
        user: 'John Doe', // Replace with dynamic user data if available
        review,
        rating,
        isFavorite,
        date: formatDate(date),
      };

      // Pass the new review to ForumScreen
      navigation.navigate('Forum', { newReview });
    });
  };
  
  // Render stars based on rating
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
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Review Page</Text>
      </View>
      
      {/* Review Form */}
      <View style={styles.content}>
        {/* Back Button and Title */}
        <View style={styles.titleRow}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Write Your Review</Text>
        </View>
        
        {/* Album Info */}
        <View style={styles.albumSection}>
          <View style={styles.albumInfo}>
            <Text style={styles.albumTitle}>After Hours <Text style={styles.albumYear}>2020</Text></Text>
            
            {/* Date Selection */}
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>Specify the date you watched it</Text>
              <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
                <MaterialIcons name="date-range" size={20} color="#fff" style={styles.dateIcon} />
                <Text style={styles.dateText}>{formatDate(date)}</Text>
                <TouchableOpacity style={styles.changeButton} onPress={showDatePicker}>
                  <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            
            {/* Rating Section */}
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Give your rating</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {renderStars()}
                </View>
                <TouchableOpacity 
                  style={styles.heartButton}
                  onPress={toggleFavorite}
                >
                  <Ionicons 
                    name={isFavorite ? "heart" : "heart-outline"} 
                    size={32} 
                    color={isFavorite ? "#FF6B6B" : "#fff"} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Album Cover */}
          <Image 
            source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KVAKyY2Q5Ua0Kzhc2yaoslK44qxpYh.png' }} 
            style={styles.albumCover}
          />
        </View>
        
        {/* Review Text Input */}
        <View style={styles.reviewInputContainer}>
          <TextInput
            style={styles.reviewInput}
            placeholder="Write down your review..."
            placeholderTextColor="#8C8C9E"
            multiline
            textAlignVertical="top"
            value={review}
            onChangeText={setReview}
          />
        </View>
        
        {/* Publish Button */}
        <View style={styles.publishContainer}>
          <Animated.View style={{ transform: [{ scale: publishScale }] }}>
            <TouchableOpacity 
              style={styles.publishButton}
              onPress={animatePublish}
              activeOpacity={0.8}
            >
              <Text style={styles.publishButtonText}>Publish</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
      
      {/* Date Picker Modal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        date={date}
        maximumDate={new Date()}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2130',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: '#9A9A9A',
    fontSize: 20,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  albumSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  albumInfo: {
    flex: 1,
    marginRight: 16,
  },
  albumTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  albumYear: {
    fontSize: 20,
    color: '#9A9A9A',
    fontWeight: 'normal',
  },
  dateSection: {
    marginBottom: 20,
  },
  dateLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dateIcon: {
    marginRight: 8,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  changeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  changeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  ratingSection: {
    marginTop: 8,
  },
  ratingLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  starContainer: {
    padding: 4,
    marginRight: 4,
  },
  heartButton: {
    padding: 8,
  },
  albumCover: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  reviewInputContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 4,
    marginBottom: 24,
  },
  reviewInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    padding: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  publishContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  publishButton: {
    backgroundColor: '#6B7280',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  publishButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default ReviewScreen;