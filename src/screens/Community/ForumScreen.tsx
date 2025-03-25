//Forum Screen
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const ForumScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Initialize reviews with hardcoded data
  const [reviews, setReviews] = useState([
    {
      _id: '1',
      user: 'Alice',
      review: 'This album is a masterpiece! The Weeknd never disappoints.',
      rating: 5,
      isFavorite: true,
      date: 'March 25, 2025',
    },
    {
      _id: '2',
      user: 'Bob',
      review: 'Loved the beats and the lyrics. A must-listen for everyone!',
      rating: 4,
      isFavorite: false,
      date: 'March 24, 2025',
    },
    {
      _id: '3',
      user: 'Charlie',
      review: 'The production quality is top-notch. Highly recommended!',
      rating: 5,
      isFavorite: true,
      date: 'March 23, 2025',
    },
  ]);

  // Handle new review passed from ReviewScreen
  useEffect(() => {
    if (route.params?.newReview) {
      // Add the new review to the top of the reviews list
      setReviews((prevReviews) => [route.params.newReview, ...prevReviews]);
    }
  }, [route.params?.newReview]);

  const goToReview = () => {
    navigation.navigate('Review');
  };

  // Render stars based on rating
  const renderStars = (rating, size = 14) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons key={i} name="star" size={size} color="#FFD700" style={styles.starIcon} />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={size} color="#FFD700" style={styles.starIcon} />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={size} color="#FFD700" style={styles.starIcon} />
        );
      }
    }

    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Forum Page</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Album Header */}
        <View style={styles.albumHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>

          <View style={styles.albumTitleContainer}>
            <Text style={styles.albumTitle}>After Hours <Text style={styles.albumYear}>2020</Text></Text>
            <View style={styles.viewsContainer}>
              <Ionicons name="eye-outline" size={20} color="#fff" />
              <Text style={styles.viewsText}>40k</Text>
            </View>
          </View>
        </View>

        {/* Album Info Section */}
        <View style={styles.albumInfoSection}>
          <Image 
            source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-9yQBX9pKJvyzF2V7aFQjhYGv2AGKwW.png' }} 
            style={styles.albumCover}
          />

          <View style={styles.albumDetails}>
            <Text style={styles.artistName}>The Weeknd</Text>
            <Text style={styles.albumMeta}>65 mins • 17 songs</Text>

            <View style={styles.albumDescription}>
              <Text style={styles.descriptionTitle}>UNMASK THE TRUTH</Text>
              <Text style={styles.descriptionText}>
                After Hours is The Weeknd's fourth studio album. It was released on March 20, 2020, to critical acclaim, with some calling it his best work to date. The album contains themes surrounding loneliness, heartbreak, withdrawal, infidelity, and recklessness.
              </Text>
            </View>

            <TouchableOpacity style={styles.rateButton} onPress={goToReview}>
              <Ionicons name="star-outline" size={18} color="#fff" />
              <Text style={styles.rateButtonText}>Rate or Review</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          {reviews.map((review) => (
            <View key={review._id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image 
                  source={{ uri: `https://picsum.photos/200/200?random=${review._id}` }} 
                  style={styles.reviewerImage}
                />
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>{review.user}</Text>
                  <View style={styles.ratingContainer}>{renderStars(review.rating)}</View>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.review}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
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
  },
  scrollView: {
    flex: 1,
  },
  albumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  albumTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  albumTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  albumYear: {
    fontSize: 20,
    color: '#9A9A9A',
    fontWeight: 'normal',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 6,
  },
  albumInfoSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  albumCover: {
    width: 140,
    height: 140,
    borderRadius: 8,
  },
  albumDetails: {
    flex: 1,
    marginLeft: 16,
  },
  artistName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
  albumMeta: {
    color: '#9A9A9A',
    fontSize: 16,
    marginTop: 4,
  },
  albumDescription: {
    marginTop: 12,
  },
  descriptionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  descriptionText: {
    color: '#CCCCCC',
    fontSize: 15,
    lineHeight: 22,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  rateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },
  reviewsSection: {
    paddingHorizontal: 16,
  },
  reviewItem: {
    backgroundColor: 'rgba(30, 33, 48, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewerImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  reviewerInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  reviewerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewerName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  reviewCount: {
    color: '#9A9A9A',
    fontSize: 14,
    marginLeft: 4,
  },
  reviewByContainer: {
    marginTop: 4,
  },
  reviewByText: {
    color: '#9A9A9A',
    fontSize: 15,
  },
  reviewText: {
    color: '#CCCCCC',
    fontSize: 16,
    lineHeight: 24,
  },
  reviewDate: {
    color: '#9A9A9A',
    fontSize: 14,
    marginTop: 4,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default ForumScreen;