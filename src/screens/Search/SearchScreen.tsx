import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  FlatList,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ALBUM_SIZE = (width - 60) / 4;
const PLAYLIST_SIZE = (width - 50) / 3;

// Sample data for popular albums
const popularAlbums = [
  {
    id: '1',
    title: 'After Hours',
    artist: 'The Weeknd',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_IZ1BA35Z2oNwdT1gfKadPF4wWaTNj8wuEA&s,red',
  },
  {
    id: '2',
    title: 'So Close To What',
    artist: 'Tate McRae',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRozn_ABMNzakRiKywlWhFWefbh5nEnSUGupw&s,gray',
  },
  {
    id: '3',
    title: 'Some Songs By',
    artist: 'Drake, PRXJEK',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQg-YToT_tjHVrKQ4WR4LBHbU9ZkohBOJWIKg&s,black',
  },
  {
    id: '4',
    title: 'Balloonerism',
    artist: 'Mac Miller',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7fK-M87_vCE651DMfUp4sm1-BV8G0o1G3Cw&s,blue',
  },
  {
    id: '5',
    title: 'Starboy',
    artist: 'The Weeknd',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnfSw3ENwo37vIAZZ3oUFKcVuwez5-Dh1EPEp84NYe1bV6YeZzRh_3wPiEWEu0V1xqxSY&usqp=CAU,dark',
  },
  {
    id: '6',
    title: '1989',
    artist: 'Taylor Swift',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGxFa9V3dEVhSAN4YHlIfdT3mrFIL_9uvXmg&s,white',
  },
  {
    id: '7',
    title: 'Dark Side of Moon',
    artist: 'Pink Floyd',
    cover: 'https://rukminim2.flixcart.com/image/850/1000/kpvivm80/poster/l/z/b/medium-pink-floyd-dark-side-of-the-moon-album-cover-poster-original-imag4ypjknuu6gzz.jpeg?q=20&crop=false,prism',
  },
  {
    id: '8',
    title: 'To Pimp a Butterfly',
    artist: 'Kendrick Lamar',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrLZIYZymYjks7XEhwDwn2SpMNaGjxv3yqmQ&s,black,white',
  },
  {
    id: '9',
    title: 'Marshall Mathers LP',
    artist: 'Eminem',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9mBL-enmK6RW3trt_gND90WQ6wFpMI0CoLg&s,house',
  },
  {
    id: '10',
    title: 'Imminent Dusk',
    artist: 'Magdalena Bay',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREfG_8m9ZYtExCVePrYhgsAWcLjMr4jcARRQ&s,pink',
  },
  {
    id: '11',
    title: 'DAMN.',
    artist: 'Kendrick Lamar',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkybKYBiWnvKXqJ5rIZyJoirGEThKUltuU_w&s,red,minimal',
  },
  {
    id: '12',
    title: 'Nevermind',
    artist: 'Nirvana',
    cover: 'https://images.prismic.io/milanote/df7eeb83a07162b45ac2e882cac055de9411054a_cover.jpg?auto=compress,format,blue,water',
  },
];

// Sample data for playlists
const playlists = [
  {
    id: '1',
    title: 'Life-Changing Albums',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxt5GdDI6iXicB1HYT4McMqy6qsfAkD_YOIA&s,colorful',
    creator: {
      name: 'Sam',
      avatar: 'https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwbWFsZXxlbnwwfHwwfHx8MA%3D%3D,man',
    },
    likes: 85,
    comments: 13,
  },
  {
    id: '2',
    title: '100 Top Grossing Albums',
    cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe8T4mJ7W2Mzkxsm-MLbSYpKUWYqhnrBINOg&s,classic',
    creator: {
      name: 'A',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqDztr9VCk90qMMMJKOstI8UpnMfSmX21A3w&s,boy',
    },
    likes: 112,
    comments: 20,
  },
  {
    id: '3',
    title: 'Comfort Albums To Chill',
    cover: 'https://d1csarkz8obe9u.cloudfront.net/posterpreviews/chill-album-cover-design-template-6087df371b9207158a9a6895673e3f30_screen.jpg?ts=1615264088,relax',
    creator: {
      name: 'Ruth',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKsVcI2Ews4pFSRS1RkMH2bBxUKvd2rqPPPQ&s,woman',
    },
    likes: 67,
    comments: 9,
  },
];

interface SearchScreenProps {
  toggleSidebar?: () => void;
}

const SearchScreen = ({ toggleSidebar }: SearchScreenProps) => {
  const renderAlbumItem = ({ item, index }) => (
    <TouchableOpacity style={styles.albumContainer}>
      <Image source={{ uri: item.cover }} style={styles.albumCover} />
      <Text style={styles.albumTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.albumArtist} numberOfLines={1}>
        {item.artist}
      </Text>
    </TouchableOpacity>
  );

  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity style={styles.playlistContainer}>
      <Image source={{ uri: item.cover }} style={styles.playlistCover} />
      <Text style={styles.playlistTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.playlistCreator}>
        <Image source={{ uri: item.creator.avatar }} style={styles.creatorAvatar} />
        <Text style={styles.creatorName}>{item.creator.name}</Text>
        <View style={styles.playlistStats}>
          <Feather name="heart" size={12} color="#AAAAAA" />
          <Text style={styles.statText}>{item.likes}</Text>
          <Feather name="message-circle" size={12} color="#AAAAAA" />
          <Text style={styles.statText}>{item.comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView style={styles.scrollView}>
        {/* Header with Search Bar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
            <Feather name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color="#888888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Type here..."
              placeholderTextColor="#888888"
            />
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image
              source={{ uri: 'https://source.unsplash.com/random/100x100/?portrait,woman' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Hey, Vishnu Adithya!</Text>
          <Text style={styles.subGreeting}>
            Search for the albums you've already heard, or want to hear...
          </Text>
        </View>

        {/* Popular Albums Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Albums This Month</Text>
          <FlatList
            data={popularAlbums}
            renderItem={renderAlbumItem}
            keyExtractor={(item) => item.id}
            numColumns={4}
            scrollEnabled={false}
            contentContainerStyle={styles.albumGrid}
          />
        </View>

        {/* Popular Playlists Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Playlists For You</Text>
          <FlatList
            data={playlists}
            renderItem={renderPlaylistItem}
            keyExtractor={(item) => item.id}
            horizontal={false}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.playlistGrid}
          />
        </View>

        {/* Add some bottom padding for scrolling */}
        <View style={{ height: 80 }} />
      </ScrollView>


      {/* <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2533',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
  },
  menuButton: {
    padding: 5,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333333',
    fontSize: 16,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  greetingSection: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  subGreeting: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  section: {
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  albumGrid: {
    justifyContent: 'space-between',
  },
  albumContainer: {
    width: ALBUM_SIZE,
    marginBottom: 15,
    marginRight: 5,
  },
  albumCover: {
    width: ALBUM_SIZE,
    height: ALBUM_SIZE,
    borderRadius: 8,
    marginBottom: 5,
  },
  albumTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  albumArtist: {
    fontSize: 11,
    color: '#AAAAAA',
  },
  playlistGrid: {
    justifyContent: 'space-between',
  },
  playlistContainer: {
    width: PLAYLIST_SIZE,
    marginBottom: 15,
  },
  playlistCover: {
    width: PLAYLIST_SIZE,
    height: PLAYLIST_SIZE,
    borderRadius: 8,
    marginBottom: 5,
  },
  playlistTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  playlistCreator: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  creatorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  creatorName: {
    fontSize: 11,
    color: '#AAAAAA',
  },
  playlistStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  statText: {
    fontSize: 11,
    color: '#AAAAAA',
    marginLeft: 2,
    marginRight: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 30,
  },
  activeNavItem: {
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default SearchScreen;