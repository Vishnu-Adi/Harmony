import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const ALBUM_COVER = 'https://i.scdn.co/image/ab67616d0000b273ef017e899c0547766997d874';

const AlbumScreen = () => {
  const navigation = useNavigation();
  const [isFavorite, setIsFavorite] = useState(false);
  const [likeCount, setLikeCount] = useState(30);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setLikeCount(isFavorite ? likeCount - 1 : likeCount + 1);
  };

  const goToReview = () => navigation.navigate('Review');
  const goToForum = () => navigation.navigate('Forum');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Hero Section with Floating Header */}
      <View style={styles.heroSection}>
        <Image 
          source={{ uri: ALBUM_COVER }} 
          style={styles.backdropImage}
          blurRadius={Platform.OS === 'ios' ? 10 : 5}
        />
        <LinearGradient
          colors={['rgba(26,27,37,0.5)', '#1A1B25']}
          style={styles.backdropGradient}
        />
        
        {/* Floating Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      {/* Album Info Section */}
      <View style={styles.albumInfoSection}>
        <View style={styles.albumMainInfo}>
          <Image source={{ uri: ALBUM_COVER }} style={styles.albumCover} />
          
          <View style={styles.titleSection}>
            <Text style={styles.albumTitle}>After Hours</Text>
            <Text style={styles.albumArtist}>The Weeknd</Text>
            <Text style={styles.albumDetails}>2020 • 14 tracks • 56 min</Text>
            
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingValue}>4.4</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((_, i) => (
                  <FontAwesome 
                    key={i} 
                    name={i < 4 ? "star" : i < 4.5 ? "star-half-empty" : "star-o"} 
                    size={12} 
                    color="#EAC85E" 
                  />
                ))}
              </View>
              <Text style={styles.ratingsCount}>462 ratings</Text>
            </View>
          </View>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            style={[styles.actionButton, isFavorite && styles.likedButton]}
            onPress={toggleFavorite}
          >
            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? "#FFF" : "#FFF"} />
            <Text style={styles.actionButtonText}>Like</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={goToReview}
          >
            <Ionicons name="star-outline" size={22} color="#FFF" />
            <Text style={styles.actionButtonText}>Rate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={goToForum}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Reviews</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social-outline" size={20} color="#FFF" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>About</Text>
          <Text style={styles.descriptionText}>
            After Hours is The Weeknds fourth studio album, featuring hit singles "Blinding Lights" and "Heartless." 
            The album explores themes of hedonism, heartbreak, and self-loathing through an 80s-inspired synth-wave soundscape.
            It received widespread critical acclaim and commercial success, cementing The Weeknd's position as one of the most influential artists of his generation.
          </Text>
        </View>
        
        {/* Rating Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Rating Distribution</Text>
          <View style={styles.ratingDistribution}>
            {/* Rating Bars */}
            <View style={styles.ratingBars}>
              {[5, 4, 3, 2, 1].map((rating) => (
                <View key={rating} style={styles.ratingBarRow}>
                  <Text style={styles.ratingBarLabel}>{rating}.0</Text>
                  <View style={styles.ratingBarContainer}>
                    <View 
                      style={[
                        styles.ratingBar, 
                        { width: `${rating === 5 ? 45 : rating === 4 ? 30 : rating === 3 ? 15 : rating === 2 ? 7 : 3}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.ratingBarCount}>
                    {rating === 5 ? '195' : rating === 4 ? '154' : rating === 3 ? '68' : rating === 2 ? '30' : '15'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        
        {/* Contributors Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeading}>Contributors</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllLink}>View all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.contributorsScrollView}
          >
            {['The Weeknd', 'Max Martin', 'Illangelo', 'Metro Boomin', 'Oneohtrix Point Never'].map((name, index) => (
              <TouchableOpacity key={index} style={styles.contributorCard}>
                <Image 
                  source={{ uri: `https://picsum.photos/200/200?random=${index+10}` }} 
                  style={styles.contributorImage} 
                />
                <Text style={styles.contributorName} numberOfLines={2}>{name}</Text>
                <Text style={styles.contributorRole}>
                  {index === 0 ? 'Artist' : 'Producer'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Popular Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeading}>Popular Reviews</Text>
            <TouchableOpacity onPress={goToForum}>
              <Text style={styles.viewAllLink}>View all</Text>
            </TouchableOpacity>
          </View>
          
          {[
            {
              name: 'David',
              avatar: `https://picsum.photos/200/200?random=1`,
              date: 'Mar 22, 2022',
              rating: 4.5,
              text: "The Weeknd's After Hours redefined mainstream R&B, hinting at a future where synth-driven melancholia could dominate the charts without compromise."
            },
            {
              name: 'Mason',
              avatar: `https://picsum.photos/200/200?random=2`,
              date: 'Dec 5, 2021',
              rating: 5.0,
              text: "Believe the hype. After Hours is a dark, synth-drenched odyssey, which immediately sets it apart from The Weeknd's previous work and the aspect that I loved the most."
            }
          ].map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image 
                  source={{ uri: review.avatar }} 
                  style={styles.reviewerAvatar} 
                />
                <View style={styles.reviewHeaderText}>
                  <Text style={styles.reviewerName}>{review.name}</Text>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                    <View style={styles.reviewRating}>
                      {Array(5).fill(0).map((_, i) => (
                        <FontAwesome 
                          key={i} 
                          name={i < Math.floor(review.rating) ? "star" : i < review.rating ? "star-half-empty" : "star-o"} 
                          size={10} 
                          color="#EAC85E" 
                          style={{marginHorizontal: 1}}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText} numberOfLines={3}>
                {review.text}
              </Text>
              <TouchableOpacity style={styles.reviewFooter}>
                <Text style={styles.readMoreLink}>Read full review</Text>
                <View style={styles.reviewActions}>
                  <TouchableOpacity style={styles.reviewAction}>
                    <Ionicons name="heart-outline" size={14} color="#8E8E93" />
                    <Text style={styles.reviewActionCount}>24</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.reviewAction}>
                    <Ionicons name="chatbubble-outline" size={14} color="#8E8E93" />
                    <Text style={styles.reviewActionCount}>3</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          ))}
          
          {/* View All Reviews Button */}
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={goToForum}
          >
            <Text style={styles.viewAllButtonText}>View All Reviews</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1B25',
  },
  heroSection: {
    height: height * 0.25,
    width: width,
    position: 'relative',
  },
  backdropImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  backdropGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 40 : 20,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  albumInfoSection: {
    marginTop: -60,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  albumMainInfo: {
    flexDirection: 'row',
  },
  albumCover: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#222',
    marginRight: 16,
  },
  titleSection: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  albumTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  albumArtist: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  albumDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  ratingValue: {
    color: '#EAC85E',
    fontWeight: 'bold',
    marginRight: 5,
  },
  starsRow: {
    flexDirection: 'row',
    marginRight: 5,
  },
  ratingsCount: {
    color: '#8E8E93',
    fontSize: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButton: {
    alignItems: 'center',
    minWidth: 65,
  },
  likedButton: {
    opacity: 1,
  },
  actionButtonText: {
    color: '#CCCCCC',
    marginTop: 6,
    fontSize: 12,
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  viewAllLink: {
    color: '#5E81AC',
    fontSize: 14,
  },
  descriptionText: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 22,
  },
  ratingDistribution: {
    marginBottom: 16,
  },
  ratingBars: {
    width: '100%',
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBarLabel: {
    color: '#8E8E93',
    fontSize: 13,
    width: 30,
  },
  ratingBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  ratingBar: {
    height: '100%',
    backgroundColor: '#5E81AC',
    borderRadius: 4,
  },
  ratingBarCount: {
    color: '#8E8E93',
    fontSize: 13,
    width: 30,
    textAlign: 'right',
  },
  contributorsScrollView: {
    marginBottom: 16,
  },
  contributorCard: {
    width: 90,
    marginRight: 16,
    alignItems: 'center',
  },
  contributorImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  contributorName: {
    color: '#FFFFFF',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 2,
  },
  contributorRole: {
    color: '#8E8E93',
    fontSize: 12,
    textAlign: 'center',
  },
  reviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  reviewHeaderText: {
    flex: 1,
    justifyContent: 'center',
  },
  reviewerName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewDate: {
    color: '#8E8E93',
    fontSize: 12,
    marginRight: 8,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readMoreLink: {
    color: '#5E81AC',
    fontSize: 13,
  },
  reviewActions: {
    flexDirection: 'row',
  },
  reviewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  reviewActionCount: {
    color: '#8E8E93',
    fontSize: 12,
    marginLeft: 4,
  },
  viewAllButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 8,
  },
  viewAllButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bottomPadding: {
    height: 40,
  },
});

export default AlbumScreen;