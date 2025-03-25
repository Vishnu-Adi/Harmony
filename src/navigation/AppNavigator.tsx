//// filepath: /Users/vishnuadithya/Documents/Projects/Harmony/Music-app/src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import SpotifyAuthScreen from '../screens/Auth/SpotifyAuthScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import MainPage from '../screens/Home/MainPage'; // Import the new screen   
import DNACodeScreen from '../screens/DNA/DNACodeScreen'; // Import the new screen
import TabNavigator from './TabNavigator';  // Updated to use the tab navigation flow
import ForumScreen from '../screens/Community/ForumScreen';
import ReviewScreen from '../screens/Community/ReviewScreen';
import AlbumScreen from '../screens/Community/AlbumScreen';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  SpotifyAuth: undefined;
  Home: undefined;
  DNACode: undefined; 
  Main: undefined;
  Forum: undefined;
  Review: undefined;
  Album: undefined;
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
      <Stack.Screen name="Main" component={MainPage} options={{ headerShown: false }} />
      <Stack.Screen name="Forum" component={ForumScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Album" component={AlbumScreen} options={{ headerShown: false }} />

    </Stack.Navigator>
  );
}