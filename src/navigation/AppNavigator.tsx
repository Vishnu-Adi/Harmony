import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import SpotifyAuthScreen from '../screens/Auth/SpotifyAuthScreen';
import ConnectSpotifyScreen from '../screens/Auth/ConnectSpotifyScreen';
import ManualEntryScreen from '../screens/Home/ManualEntryScreen';
import TabNavigator from './TabNavigator';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  SpotifyAuth: undefined;
  ConnectSpotify: undefined;
  ManualEntry: undefined;
  Home : undefined;
  Main: undefined; // New route for bottom tab navigator
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SpotifyAuth" component={SpotifyAuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ConnectSpotify" component={ConnectSpotifyScreen} options={{ title: 'Connect Spotify' }} />
      <Stack.Screen name="ManualEntry" component={ManualEntryScreen} options={{ title: 'Enter Top Tracks' }} />
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}