import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function SpotifyAuthScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SpotifyAuth'>>();
  // Use the Expo redirect URI (update as needed)
  const redirectUri = makeRedirectUri({ useProxy: false });
  const clientId = '1b35d33191ef4618a7926d9347d13bcc';

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['user-read-email', 'user-read-private', 'user-top-read'],
      redirectUri,
      responseType: 'token',
    },
    discovery
  );

  useEffect(() => {
    const handleResponse = async () => {
      if (response?.type === 'success' && response.authentication?.accessToken) {
        const token = response.authentication.accessToken;
        try {
          // Store the access token for later use in HomeScreen
          await AsyncStorage.setItem('spotify_token', token);
          console.log('Spotify token stored:', token);
          // Navigate to HomeScreen (or Main for the tab navigation)
          navigation.navigate('Home');
        } catch (error) {
          console.error('Error storing the token:', error);
        }
      }
    };
    handleResponse();
  }, [response]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Connect with Spotify</Text>
        <Text style={styles.subtitle}>
          Sign in with your Spotify account to access personalized recommendations and track your top songs.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => promptAsync()} disabled={!request}>
          <Text style={styles.buttonText}>Sign in via Spotify</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1F25',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  innerContainer: {
    width: '100%',
    backgroundColor: '#2C343F',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    color: '#EAC85E',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonText: {
    color: '#1F1717',
    fontSize: 16,
    fontWeight: 'bold',
  },
});