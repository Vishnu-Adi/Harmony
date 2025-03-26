import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const favoriteAlbums = [
    'https://imgs.search.brave.com/IOOjYgpwUlWz1HcEoqYxdr4z9hnlhzE1Qax617uHMY0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXZlLmNv/bS93cC93cDk5OTgy/OTIuanBn',
    'https://img.freepik.com/free-vector/gradient-album-cover-template_23-2150597431.jpg',
    'https://c.saavncdn.com/788/Jaan-Ban-Gaye-Tabla-Cover-Hindi-2020-20201119175143-500x500.jpg',
    'https://thunderdungeon.com/wp-content/uploads/2024/09/moo-deng-album-covers-19-9-24-2024.jpg',
    'https://cdn-images.dzcdn.net/images/cover/12c8c55d633ef19e6e24676ec5a0a80b/0x1900-000000-80-0-0.jpg'
  ];

  const recentListens = [
    'https://imgs.search.brave.com/VYvZ_iqo7mt8ERd1zBNWeO5Q49PGyJOOds3pmj0Flqc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pMS5z/bmRjZG4uY29tL2Fy/dHdvcmtzLXN6b3BQ/ZW1pYTc0My0wLXQx/MDgweDEwODAuanBn',
    'https://pagalpro.com/storage/album_images/UXl6xYMZ3aWuwwX3PhPx.webp',
    'https://i.pinimg.com/236x/a0/6f/d8/a06fd8e94e946bf832101ccf8a850d90.jpg',
    'https://i.pinimg.com/736x/20/1d/89/201d89599b31dcc03e50d750a4de8e95.jpg',
    'https://cdn-images.dzcdn.net/images/cover/6c91e64b7157f1332a4f6b0de9e4c714/1900x1900-000000-80-0-0.jpg'
  ];

  const renderStats = () => (
    <View style={styles.statsContainer}>
      {[
        { number: '455', label: 'Total Albums' },
        { number: '33', label: 'Albums This Year' },
        { number: '4', label: 'Playlists' },
        { number: '30', label: 'Reviews' }
      ].map((stat, index) => (
        <View key={index} style={styles.statItem}>
          <Text style={styles.statNumber}>{stat.number}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );

  const renderAlbumRow = (albums: string[], title: string) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.albumsRow}>
        {albums.map((img, index) => (
          <View key={index} style={styles.albumContainer}>
            <Image source={{ uri: img }} style={styles.albumCover} />
            {title.includes('Recent') && (
              <View style={styles.ratingContainer}>
                {Array(5).fill(0).map((_, i) => (
                  <FontAwesome 
                    key={i} 
                    name={i < (5-index) ? "star" : "star-o"} 
                    size={12} 
                    color="#FFD700" 
                    style={styles.starIcon} 
                  />
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Cover Photo and Profile Section */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: 'https://img.freepik.com/free-photo/woman-posing-studio-medium-shot_23-2149883753.jpg' }}
            style={styles.coverPhoto}
          />
          <View style={styles.profilePictureContainer}>
            <Image
              source={{ uri: 'https://img.freepik.com/free-photo/woman-with-trendy-hairstyle-side-view_23-2149883724.jpg' }}
              style={styles.profilePicture}
            />
          </View>
        </View>

        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <View style={styles.nameContainer}>
            <Text style={styles.username}>Vishnu Adithya</Text>
            <View style={styles.proBadge}>
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>
          <View style={styles.followContainer}>
            <Text style={styles.followText}>500 Followers</Text>
            <Text style={styles.followText}>420 Following</Text>
          </View>
        </View>

        {renderStats()}
        {renderAlbumRow(favoriteAlbums, "Vishnu Adithya's Favorite Albums")}
        {renderAlbumRow(recentListens, "Vishnu Adithya's Recent Listens")}

        {/* Recent Reviews Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vishnu Adithya's Recent Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.reviewContainer}>
            <View style={styles.reviewHeader}>
              <Image
                source={{ uri: 'https://img.freepik.com/free-photo/woman-with-trendy-hairstyle-side-view_23-2149883724.jpg' }}
                style={styles.reviewerPic}
              />
              <Text style={styles.reviewByText}>Review by Vishnu Adithya ★★★★★ (215)</Text>
            </View>
            <View style={styles.reviewContent}>
              <View style={styles.reviewTextContainer}>
                <Text style={styles.reviewTitle}>A Phenomenal Album!</Text>
                <Text style={styles.reviewText} numberOfLines={3}>
                  Sure I've said mentioned this before, but I have a very personal feeling that makes an enormous important album. It's a defining piece of musical mastery.
                </Text>
                <TouchableOpacity>
                  <Text style={styles.readMoreText}>Read more {'>'}</Text>
                </TouchableOpacity>
              </View>
              <Image
                source={{ uri: 'https://imgs.search.brave.com/N9d3SMgsmiHMOm4NZMbri0LGbQGeTYJxgeK5hdNymqk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wZW9w/bGUuY29tL3RobWIv/WS0tc01hQzlnbGNG/RUQ5OE56T0d4U2Za/bWtzPS80MDAweDAv/ZmlsdGVyczpub191/cHNjYWxlKCk6bWF4/X2J5dGVzKDE1MDAw/MCk6c3RyaXBfaWNj/KCk6Zm9jYWwoOTk5/eDA6MTAwMXgyKS9i/aWxsaWUtZWlsaXNo/LWhpdC1tZS1oYXJk/LWFuZC1zb2Z0LWNv/dmVyLTA0MDgyNC00/N2ZkZjE0ZWVhNjI0/YTE2ODI5Njk0NDM0/MjgxN2IzYy5qcGc' }}
                style={styles.reviewAlbumCover}
              />
            </View>
          </View>
        </View>
      </ScrollView>


      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="search-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  scrollView: {
    flex: 1,
  },
  coverContainer: {
    height: 200,
    position: 'relative',
  },
  coverPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  profilePictureContainer: {
    position: 'absolute',
    bottom: -40,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#1E1E1E',
    borderRadius: 50,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfoContainer: {
    marginTop: 45,
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginRight: 8,
  },
  proBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  proBadgeText: {
    color: '#1E1E1E',
    fontSize: 12,
    fontWeight: 'bold',
  },
  followContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  followText: {
    color: '#CCCCCC',
    marginHorizontal: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  statLabel: {
    fontSize: 12,
    color: '#CCCCCC',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  seeAllText: {
    color: '#FFD700',
    fontSize: 14,
  },
  albumsRow: {
    marginTop: 12,
  },
  albumContainer: {
    marginRight: 12,
    width: 120,
  },
  albumCover: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  starIcon: {
    marginRight: 2,
  },
  readReview: {
    color: '#CCCCCC',
    fontSize: 12,
    marginTop: 4,
  },
  reviewContainer: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerPic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  reviewByText: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  reviewContent: {
    flexDirection: 'row',
    marginTop: 8,
  },
  reviewTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  reviewTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reviewText: {
    color: '#CCCCCC',
    fontSize: 12,
    lineHeight: 18,
  },
  readMoreText: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 4,
  },
  reviewAlbumCover: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#2A2A2A',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  navItem: {
    alignItems: 'center',
  },
});