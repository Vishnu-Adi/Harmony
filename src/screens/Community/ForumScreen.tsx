//Forum Screen
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ForumScreen = ({ navigation }) => {
  // Sample review data
  const reviews = [
    {
      id: 1,
      name: 'David',
      rating: 4.5,
      reviewCount: 5,
      text: 'It was just over five years ago that The Weeknd\'s After Hours redefined mainstream R&B, hinting at a future where synth-driven melancholia could dominate the charts without compromise. With its cinematic production, deep 80s-inspired beats, and Abel Tesfaye\'s haunting falsetto, After Hours is a cinematic odyssey of heartbreak and modern hedonism. The album creates a sonic universe that often feels more like a neon-lit fever dream than a conventional pop album. With instant classics like "Blinding Lights" and "Nothing Compares," The Weeknd fully realizes his vision with staggering force.'
    },
    {
      id: 2,
      name: 'David',
      rating: 4.5,
      reviewCount: 4,
      text: 'Absolutely amazing—After Hours feels like an immersive, cinematic experience rather than just an album. It is a masterpiece!'
    },
    {
      id: 3,
      name: 'David',
      rating: 4,
      reviewCount: 5,
      text: 'The Weeknd excels in blends nostalgia with modern production, making it a genuine standout in his discography. What a time to live!'
    },
    {
      id: 4,
      name: 'Mason',
      rating: 4.3,
      reviewCount: 10,
      text: 'Believe the hype.\n\nAfter Hours is a dark, synth-drenched odyssey, which immediately sets it apart from The Weeknd\'s previous work and the aspect that I loved the most. The heartbeat and excess ooze out of each track through its immaculate production and are injected into your veins through Tesfaye\'s haunting falsetto and pulsating 80s-inspired beats.'
    },
    {
      id: 5,
      name: 'David',
      rating: 4.5,
      reviewCount: 5,
      text: 'Couldn\'t have said it better—After Hours is an intoxicating blend of nostalgia and new emotion.'
    },
    {
      id: 6,
      name: 'David',
      rating: 4,
      reviewCount: 5,
      text: 'Every track pulls you deeper into its neon-lit world, making it one of The Weeknd\'s most immersive projects yet.'
    },
    {
      id: 7,
      name: 'David',
      rating: 4.5,
      reviewCount: 5,
      text: 'Absolutely—After Hours is a haunting yet mesmerizing journey through heartbreak and excess. The seamless fusion of moody synths and Tesfaye\'s falsetto makes it an unforgettable experience from start to finish.'
    },
    {
      id: 8,
      name: 'David',
      rating: 4,
      reviewCount: 5,
      text: 'Spot on—After Hours feels like a beautifully crafted descent into heartbreak and indulgence. The cinematic production and hypnotic melodies make it impossible to escape its grip.'
    },
  ];

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
            
            <TouchableOpacity style={styles.rateButton}>
              <Ionicons name="star-outline" size={18} color="#fff" />
              <Text style={styles.rateButtonText}>Rate or Review</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Reviews Section */}
        <View style={styles.reviewsSection}>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image 
                  source={{ uri: `https://picsum.photos/200/200?random=${review.id}` }} 
                  style={styles.reviewerImage}
                />
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerNameContainer}>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                    <View style={styles.ratingContainer}>
                      {renderStars(review.rating)}
                      <Text style={styles.reviewCount}>({review.reviewCount})</Text>
                    </View>
                  </View>
                  <View style={styles.reviewByContainer}>
                    <Text style={styles.reviewByText}>Review by {review.name}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText} numberOfLines={review.id === 1 || review.id === 4 ? 6 : 2}>
                {review.text}
              </Text>
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
  bottomSpacing: {
    height: 40,
  },
});

export default ForumScreen;