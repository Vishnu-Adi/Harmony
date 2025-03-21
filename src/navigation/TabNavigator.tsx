// File: src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import SpotifyAuthScreen from '../screens/Auth/SpotifyAuthScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ConnectSpotifyScreen from '../screens/Auth/ConnectSpotifyScreen'; // New screen
import ManualEntryScreen from '../screens/Home/ManualEntryScreen'; // Import new screen

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  SpotifyAuth: undefined;
  Home: undefined;
  ConnectSpotify: undefined;
  ManualEntry: undefined; // Add to param list
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SpotifyAuth" component={SpotifyAuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ConnectSpotify" component={ConnectSpotifyScreen} options={{ title: 'Connect Spotify' }} />
      <Stack.Screen
        name="ManualEntry"
        component={ManualEntryScreen}
        options={{ title: 'Enter Top Tracks' }}
      />
    </Stack.Navigator>
  );
}