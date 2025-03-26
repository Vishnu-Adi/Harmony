import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../screens/Auth/SignInScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import SpotifyAuthScreen from '../screens/Auth/SpotifyAuthScreen';
import TabNavigator from './TabNavigator';
import AlbumScreen from '../screens/Community/AlbumScreen';
import ReviewScreen from '../screens/Community/ReviewScreen';
import ForumScreen from '../screens/Community/ForumScreen';
import DNACodeScreen from '../screens/DNA/DNACodeScreen';
import MoodChatbotScreen from '../screens/Recommendations/MoodChatbotScreen';
import ReccoScreen from '../screens/Recommendations/ReccoScreen';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  SpotifyAuth: undefined;
  Tab: undefined;
  Album: undefined;
  Review: undefined;
  Forum: { newReview?: any };
  DNACode: undefined;
  MoodChatbot: undefined;
  ReccoScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="SignIn"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SpotifyAuth" component={SpotifyAuthScreen} />
      <Stack.Screen name="Tab" component={TabNavigator} />
      <Stack.Screen name="Album" component={AlbumScreen} />
      <Stack.Screen name="Review" component={ReviewScreen} />
      <Stack.Screen name="Forum" component={ForumScreen} />
      <Stack.Screen name="DNACode" component={DNACodeScreen} />
      <Stack.Screen name="MoodChatbot" component={MoodChatbotScreen} />
      <Stack.Screen name="ReccoScreen" component={ReccoScreen} />
    </Stack.Navigator>
  );
}