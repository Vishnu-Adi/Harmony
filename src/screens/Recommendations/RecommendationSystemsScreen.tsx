import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function RecommendationSystemsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Music Discovery</Text>
          <Text style={styles.subtitle}>Choose your path to discover new music</Text>
        </View>
      </View>

      {/* Cards Container */}
      <View style={styles.cardsContainer}>
        {/* Artist-based Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('ReccoScreen')} // Updated navigation target
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1000&auto=format&fit=crop' }}
            style={StyleSheet.absoluteFill}
            blurRadius={3}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="account-music" size={32} color="#EAC85E" />
              </View>
              <Text style={styles.cardTitle}>Artist Explorer</Text>
              <Text style={styles.cardDescription}>
                Find artists based on language, genre, and popularity preferences
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.startText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#EAC85E" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Mood-based Card */}
        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('MoodChatbot')}
        >
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop' }}
            style={StyleSheet.absoluteFill}
            blurRadius={3}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="chat-processing" size={32} color="#EAC85E" />
              </View>
              <Text style={styles.cardTitle}>Mood Assistant</Text>
              <Text style={styles.cardDescription}>
                Let our AI find the perfect songs for your current mood
              </Text>
              <View style={styles.cardFooter}>
                <Text style={styles.startText}>Start Chat</Text>
                <Ionicons name="arrow-forward" size={20} color="#EAC85E" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  titleContainer: {
    marginBottom: 10,
    
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EAC85E',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
  },
  cardsContainer: {
    
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    gap: 20,
  },
  card: {
    height: height * 0.25,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'flex-end',
  },
  cardContent: {

    gap: 12,
  },
  iconContainer: {
    
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardDescription: {
    fontSize: 14,
    color: '#CCC',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  startText: {
    color: '#EAC85E',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    gap: 8,
  },
  infoText: {
    color: '#666',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
});
