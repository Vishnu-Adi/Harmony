//Album Screen
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
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { db } from './firebase'; 

const AlbumScreen = ({ navigation }) => {

  const [isFavorite, setIsFavorite] = useState(false);
  const [likeCount, setLikeCount] = useState(30);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  
    if (isFavorite) {
      setLikeCount(likeCount - 1); // Decrease like count if unfavoriting
    } else {
      setLikeCount(likeCount + 1); // Increase like count if favoriting
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Album Page</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {/* Album Hero Section */}
        <View style={styles.albumHero}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Image 
            source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DW226otLXNn5BunBBolecrbwShg72C.png' }} 
            style={styles.albumBackground}
            blurRadius={1}
          />
          
          <View style={styles.albumInfoContainer}>
            <Image 
              source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DW226otLXNn5BunBBolecrbwShg72C.png' }} 
              style={styles.albumCover}
            />
            
            <View style={styles.albumDetails}>
              <Text style={styles.albumTitle}>After Hours <Text style={styles.albumYear}>2020</Text></Text>
              <Text style={styles.artistName}>The Weeknd</Text>
              <Text style={styles.albumMeta}>65 mins • 17 songs</Text>
              
              <View style={styles.albumDescription}>
                <Text style={styles.descriptionTitle}>UNMASK THE TRUTH</Text>
                <Text style={styles.descriptionText}>
                  After Hours is The Weeknd's fourth studio album. It was released on March 20, 2020, to critical acclaim, with some calling it his best work to date. The album contains themes surrounding loneliness, heartbreak, withdrawal, infidelity, and recklessness.
                </Text>
              </View>
            </View>
          </View>
          
          {/* Engagement Stats */}
          <View style={styles.engagementContainer}>
            <View style={styles.engagementItem}>
              <Ionicons name="eye-outline" size={22} color="#4CD964" />
              <Text style={styles.engagementCount}>40K</Text>
            </View>
            <TouchableOpacity style={styles.engagementItem} onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color="#fff"
              />
              <Text style={styles.engagementCount}>
                {likeCount >= 1000 ? `${(likeCount / 1000).toFixed(0)}K` : likeCount} 
              </Text>
            </TouchableOpacity>
            <View style={styles.engagementItem}>
              <MaterialCommunityIcons name="share-variant" size={22} color="#3B82F6" />
              <Text style={styles.engagementCount}>12K</Text>
            </View>
          </View>
        </View>
        
        {/* Ratings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ratings</Text>
          
          <View style={styles.ratingsContainer}>
            <View style={styles.ratingBars}>
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.ratingBar, 
                    { height: 10 + (index * 5) }
                  ]} 
                />
              ))}
            </View>
            
            <View style={styles.ratingScore}>
              <Text style={styles.ratingNumber}>4.4</Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <FontAwesome 
                    key={index} 
                    name={index < 4 ? "star" : "star-half-empty"} 
                    size={16} 
                    color="#FFD700" 
                  />
                ))}
              </View>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="star-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Rate or Review</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="list-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonText}>Go to Forum</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Contributors Section */}
        <View style={styles.section}>
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Artists</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Producers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Details</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.contributorsScroll}>
            {[1, 2, 3, 4, 5].map((_, index) => (
              <TouchableOpacity key={index} style={styles.contributor}>
                <Image 
                  source={{ uri: `https://picsum.photos/200/200?random=${index}` }} 
                  style={styles.contributorImage}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Reviews Section */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>All Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {/* Review Items */}
          {[
            {
              name: 'David',
              rating: 4.5,
              review: 'It was just over five years ago that The Weeknd\'s After Hours redefined mainstream R&B, hinting at a future where synth-driven melancholia could dominate the charts without compromise. With its cinematic production, the 80s-inspired sound, and Abel Tesfaye\'s haunting falsetto, the album created a sonic universe that often feels more like a neon-lit fever dream than a conventional pop album. With instant classics like "Blinding Lights" and "In Your Eyes," The Weeknd fully realizes his vision with staggering force.'
            },
            {
              name: 'Mason',
              rating: 4.3,
              review: 'Believe the hype.\n\nAfter Hours is a dark, synth-drenched odyssey, which immediately sets it apart from The Weeknd\'s previous work and the aspect that I loved the most. The heartbeat and excess ooze out of each track through its immaculate production and are injected into your veins through Tesfaye\'s haunting falsetto and pulsating 80s-inspired beats.'
            }
          ].map((review, index) => (
            <View key={index} style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Image 
                  source={{ uri: `https://picsum.photos/200/200?random=${index + 10}` }} 
                  style={styles.reviewerImage}
                />
                <View style={styles.reviewerInfo}>
                  <Text style={styles.reviewerName}>Review by {review.name}</Text>
                  <View style={styles.reviewRating}>
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <FontAwesome 
                        key={i} 
                        name={i < Math.floor(review.rating) ? "star" : i < review.rating ? "star-half-empty" : "star-o"} 
                        size={14} 
                        color="#FFD700" 
                      />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.review}</Text>
              <TouchableOpacity style={styles.readMore}>
                <Text style={styles.readMoreText}>Read more</Text>
              </TouchableOpacity>
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
    backgroundColor: '#1A1B25',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    color: '#9A9A9A',
    fontSize: 18,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  albumHero: {
    position: 'relative',
    height: 400,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  albumInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  albumCover: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  albumDetails: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'flex-end',
  },
  albumTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  albumYear: {
    fontSize: 18,
    color: '#9A9A9A',
  },
  artistName: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 4,
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
    color: '#9A9A9A',
    fontSize: 14,
    lineHeight: 20,
  },
  engagementContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: -30,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(26, 27, 37, 0.9)',
    borderRadius: 8,
    padding: 12,
  },
  engagementItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  engagementCount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 6,
  },
  section: {
    marginTop: 40,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  ratingBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    height: 40,
    marginRight: 16,
  },
  ratingBar: {
    width: 16,
    backgroundColor: '#FFFFFF',
    marginRight: 6,
    borderRadius: 2,
  },
  ratingScore: {
    alignItems: 'center',
  },
  ratingNumber: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  stars: {
    flexDirection: 'row',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 24,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFFFFF',
  },
  tabText: {
    color: '#9A9A9A',
    fontSize: 18,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  contributorsScroll: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  contributor: {
    marginRight: 16,
  },
  contributorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#9A9A9A',
    fontSize: 16,
  },
  reviewItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerInfo: {
    marginLeft: 12,
    justifyContent: 'center',
  },
  reviewerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  reviewRating: {
    flexDirection: 'row',
    marginTop: 4,
  },
  reviewText: {
    color: '#CCCCCC',
    fontSize: 15,
    lineHeight: 22,
  },
  readMore: {
    marginTop: 8,
  },
  readMoreText: {
    color: '#9A9A9A',
    fontSize: 14,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default AlbumScreen;