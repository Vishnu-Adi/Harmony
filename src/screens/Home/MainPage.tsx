import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Animated } from "react-native"
import { Feather, Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import Sidebar from '../../components/Sidebar';
import { useState, useRef } from 'react';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function MainPage() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Album'>>();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.75)).current;

  const toggleSidebar = () => {
    const toValue = isSidebarVisible ? -width * 0.75 : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsSidebarVisible(!isSidebarVisible);
  };

  const goToAlbumScreen = () => {
    navigation.navigate('Album');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <Sidebar 
        isVisible={isSidebarVisible}
        onClose={toggleSidebar}
        slideAnim={slideAnim}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar}>
          <Feather name="menu" size={24} color="#8E8E93" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.greeting}>Hello, Vishnu Adithya!</Text>
          <TouchableOpacity>
            <Feather name="search" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Image
            source={{
              uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKqR6f1atfI04lCqjB3_KYrd5u0XERd3r9Pg&s",
            }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Review, rate and discuss about the albums you've heard...</Text>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Popular Albums Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Albums This Month</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {popularAlbums.map((album, index) => (
              <TouchableOpacity key={index} style={styles.albumCard} onPress={goToAlbumScreen}>
                <Image source={{ uri: album.cover }} style={styles.albumCover} />
                <Text style={styles.albumTitle} numberOfLines={1}>
                  {album.title}
                </Text>
                <Text style={styles.albumArtist} numberOfLines={1}>
                  {album.artist}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Playlists Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Playlists For You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {popularPlaylists.map((playlist, index) => (
              <TouchableOpacity key={index} style={styles.playlistCard}>
                <Image source={{ uri: playlist.cover }} style={styles.playlistCover} />
                <Text style={styles.playlistTitle} numberOfLines={1}>
                  {playlist.title}
                </Text>
                <View style={styles.playlistUsers}>
                  {playlist.users.map((user, userIndex) => (
                    <Image
                      key={userIndex}
                      source={{ uri: user }}
                      style={[styles.playlistUserPic, { marginLeft: userIndex > 0 ? -10 : 0 }]}
                    />
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recent Friends' Reviews Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Friends' Review</Text>
          {friendReviews.map((review, index) => (
            <View key={index} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: review.userPic }} style={styles.reviewUserPic} />
                <View style={styles.reviewHeaderText}>
                  <Text style={styles.reviewUserName}>{review.userName}</Text>
                  <View style={styles.reviewRating}>
                    <Text style={styles.reviewAlbumName}>Review by {review.reviewedBy}</Text>
                    <View style={styles.starsContainer}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < review.rating ? "star" : "star-outline"}
                          size={12}
                          color="#FFD700"
                        />
                      ))}
                      <Text style={styles.ratingText}>{review.ratingText}</Text>
                    </View>
                  </View>
                </View>
                <Image source={{ uri: review.albumCover }} style={styles.reviewAlbumCover} />
              </View>
              <Text style={styles.reviewText} numberOfLines={3}>
                {review.text}
              </Text>
              <TouchableOpacity>
                <Text style={styles.readMore}>Read more...</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>


      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search" size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications-outline" size={24} color="#8E8E93" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  )
}

// Sample data
const popularAlbums = [
  {
    title: "Blonde",
    artist: "Frank Ocean",
    cover: "https://miro.medium.com/v2/resize:fit:550/1*lfE1NRGhG2uwkAcRNGTq4g@2x.jpeg?height=150&width=150",
  },
  {
    title: "An Easy To Wear Grey",
    artist: "Laufey",
    cover: "https://cdn-images.dzcdn.net/images/cover/823a340856f4242cd7195a2582b395e7/0x1900-000000-80-0-0.jpg?height=150&width=150",
  },
  {
    title: "Come Home The Kids Miss You",
    artist: "Jack Harlow",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQurBTj7rKzhu2B3YzJmbz-IYFqd2VMexUHag&s?height=150&width=150",
  },
  {
    title: "Kaleidoscope",
    artist: "Coldplay",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZm-RT0d2Ql9IK7rWROQ6qd9nGIPG70w6n1g&s?height=150&width=150",
  },
]

const popularPlaylists = [
  {
    title: "Life-Changing Albums",
    cover: "https://marketplace.canva.com/EAEdeiU-IeI/1/0/1600w/canva-purple-and-red-orange-tumblr-aesthetic-chill-acoustic-classical-lo-fi-playlist-cover-jGlDSM71rNM.jpg?height=150&width=150",
    users: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZm-RT0d2Ql9IK7rWROQ6qd9nGIPG70w6n1g&s?height=30&width=30",
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHVzZXIlMjBwcm9maWxlfGVufDB8fDB8fHww?height=30&width=30",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D?height=30&width=30",
    ],
  },
  {
    title: "100 Top Streaming Albums",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTk8rFStFCAJKum7i9lupG30qWDtK6277Dx9w&s?height=150&width=150",
    users: ["https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOGZpFZKQVdkcFBqhV0apckEr6CQk4s6bB_Q&s?height=30&width=30", 
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkAJEkJQ1WumU0hXNpXdgBt9NUKc0QDVIiaw&s?height=30&width=30"],
  },
  {
    title: "Comfort Albums To Chill",
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKOUA6JFXYBc_HelVwX1QMZHb-gqaAhqHkKg&s?height=150&width=150",
    users: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTQLDneZM4Ymoi7mRUgZD5OF0Y9rDJkpyhOg&s?height=30&width=30",
      "https://www.morganstanley.com/content/dam/msdotcom/people/tiles/isaiah-dwuma.jpg.img.380.medium.jpg/1594668408164.jpg?height=30&width=30",
      "/placeholder.svg?height=30&width=30",
    ],
  },
]

const friendReviews = [
  {
    userName: "This Slow Rush",
    userPic: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D?height=40&width=40",
    reviewedBy: "Adeline",
    rating: 4,
    ratingText: "4.7",
    text: "Kendrick Lamar's 'Mr. Morale & The Big Steppers' is a raw personal exploration of his struggles with fame, family, and identity. The album features introspective lyrics and innovative production that showcase his evolution as an artist. It's a must-listen for any hip-hop fan.",
    albumCover: "https://i.scdn.co/image/ab67616d0000b2732e02117d76426a08ac7c174f?height=60&width=60",
  },
  {
    userName: "Hayley",
    userPic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOGZpFZKQVdkcFBqhV0apckEr6CQk4s6bB_Q&s?height=40&width=40",
    reviewedBy: "Audrey",
    rating: 5,
    ratingText: "5.0",
    text: "Billie Eilish's 'Happier Than Ever' is an evolution through pop music that showcases her growth as an artist. The production is pristine, the lyrics are raw and honest, and her vocal performance is stellar. This album solidifies her place as one of the most important voices in modern music.",
    albumCover: "https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e?height=60&width=60",
  },
  {
    userName: "Will, The GOAT",
    userPic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZm-RT0d2Ql9IK7rWROQ6qd9nGIPG70w6n1g&s?height=40&width=40",
    reviewedBy: "Samantha",
    rating: 4,
    ratingText: "4.5",
    text: "The Weeknd's 'Dawn FM' is a conceptual masterpiece that takes listeners on a journey through a radio station in purgatory. The 80s-inspired production, coupled with Abel's signature vocals, creates an immersive experience that's both nostalgic and forward-thinking.",
    albumCover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOGZpFZKQVdkcFBqhV0apckEr6CQk4s6bB_Q&s?height=60&width=60",
  },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  greeting: {
    color: "#D4AF37", // Gold color for "Hello, Leena!"
    fontSize: 18,
    fontWeight: "bold",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  subtitle: {
    color: "#8E8E93",
    fontSize: 12,
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  horizontalScroll: {
    paddingLeft: 16,
  },
  albumCard: {
    width: 120,
    marginRight: 12,
  },
  albumCover: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  albumTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  albumArtist: {
    color: "#8E8E93",
    fontSize: 11,
  },
  playlistCard: {
    width: 150,
    marginRight: 12,
  },
  playlistCover: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistTitle: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  playlistUsers: {
    flexDirection: "row",
  },
  playlistUserPic: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1A1A1A",
  },
  reviewCard: {
    backgroundColor: "#252525",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  reviewUserPic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewHeaderText: {
    flex: 1,
  },
  reviewUserName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  reviewRating: {
    marginTop: 4,
  },
  reviewAlbumName: {
    color: "#8E8E93",
    fontSize: 12,
  },
  starsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  ratingText: {
    color: "#8E8E93",
    fontSize: 12,
    marginLeft: 4,
  },
  reviewAlbumCover: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  reviewText: {
    color: "#CCCCCC",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  readMore: {
    color: "#D4AF37",
    fontSize: 12,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  navItem: {
    alignItems: "center",
  },
})

