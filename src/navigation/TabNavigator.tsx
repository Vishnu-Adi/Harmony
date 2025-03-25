//// filepath: /Users/vishnuadithya/Documents/Projects/Harmony/Music-app/src/navigation/TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, Feather } from '@expo/vector-icons';
import MainPage from '../screens/Home/MainPage';
import ReccoScreen from '../screens/Recommendations/ReccoScreen';
// Optionally add profile and fourth dummy screens, or leave them commented out.
import ProfileScreen from '../screens/Profile/ProfileScreen';
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#1DB954',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: { backgroundColor: '#1E293B' },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'HomeTab') {
            return <Ionicons name="home" size={size} color={color} />;
          } else if (route.name === 'Recco') {
            return <Feather name="star" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <Ionicons name="person-outline" size={size} color={color} />;
          } else if (route.name === 'Fourth') {
            return <Ionicons name="settings-outline" size={size} color={color} />;
          }
          return null;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={MainPage} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Recco" component={ReccoScreen} options={{ tabBarLabel: 'Recco' }} />
      Optionally add additional tabs:
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
      {/* <Tab.Screen name="Fourth" component={DummyFourthScreen} options={{ tabBarLabel: 'More' }} />  */}
     
    </Tab.Navigator>
  );
}