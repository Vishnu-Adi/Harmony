// File: src/screens/Auth/ConnectSpotifyScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type ConnectSpotifyScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ConnectSpotify'>;

const ConnectSpotifyScreen = () => {
  const navigation = useNavigation<ConnectSpotifyScreenNavigationProp>();

  const handleConnectSpotify = () => {
    navigation.navigate('SpotifyAuth');
  };

  const handleManualEntry = () => {
    navigation.navigate('ManualEntry');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect to Spotify</Text>
      <Text style={styles.description}>
        To get personalized recommendations, please connect your Spotify account or manually enter your top 10 songs.
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleConnectSpotify}>
        <Text style={styles.buttonText}>Connect with Spotify</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleManualEntry}>
        <Text style={styles.buttonText}>Enter Songs Manually</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e3a8a',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#4b5563',
  },
  button: {
    backgroundColor: '#1db954', // Spotify green
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
    width: '80%', // Consistent width
    alignItems: 'center', // Center text in button
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ConnectSpotifyScreen;