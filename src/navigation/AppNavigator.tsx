//// filepath: /Users/vishnuadithya/Documents/Projects/Harmony/Music-app/src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import SpotifyAuthScreen from '../screens/Auth/SpotifyAuthScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import DNACodeScreen from '../screens/DNA/DNACodeScreen'; // Import the new screen
import TabNavigator from './TabNavigator';  // Updated to use the tab navigation flow

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  SpotifyAuth: undefined;
  Home: undefined;
  DNACode: undefined; 
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SpotifyAuth" component={SpotifyAuthScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DNACode" component={DNACodeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}