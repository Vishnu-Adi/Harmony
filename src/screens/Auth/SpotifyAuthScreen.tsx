import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
  // Use the Expo proxy redirect URI
  const redirectUri = makeRedirectUri({ useProxy: true });
  console.log('Redirect URI:', redirectUri);
  // Replace with your actual Spotify client id or load from environment
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
          // Navigate to HomeScreen
          navigation.navigate('Home');
        } catch (error) {
          console.error('Error storing the token:', error);
        }
      }
    };
    handleResponse();
  }, [response]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Authenticate with Spotify to continue</Text>
      <TouchableOpacity onPress={() => promptAsync()} disabled={!request}>
        <Text style={{ marginTop: 20, color: 'blue' }}>Sign in via Spotify</Text>
      </TouchableOpacity>
    </View>
  );
}