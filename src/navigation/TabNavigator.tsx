import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/Home/HomeScreen';
import DNACodeScreen from '../screens/DNA/DNACodeScreen';
import MainPage from '../screens/Home/MainPage';
import ReccoScreen from '../screens/Recommendations/ReccoScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SearchScreen from '../screens/Search/SearchScreen';
import SidebarLayout from '../components/SidebarLayout';

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Main: undefined;
  Recommendations: undefined;
  Profile: undefined;
  DNACode: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Wrapper function to add SidebarLayout to screens
const withSidebar = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <SidebarLayout>
      <Component {...props} />
    </SidebarLayout>
  );
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string = '';
          
          switch (route.name) {
            case 'Home':
              iconName = 'home-variant';
              break;
            case 'Search':
              iconName = 'magnify';
              break;
            case 'Main':
              iconName = 'playlist-music';
              break;
            case 'Recommendations':
              iconName = 'compass-outline';
              break;
            case 'Profile':
              iconName = 'account';
              break;
            case 'DNACode':
              iconName = 'dna';
              break;
            default:
              iconName = 'help';
          }
          
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#EAC85E',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 60,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
      initialRouteName="Home"
    >
      <Tab.Screen 
        name="Home" 
        component={withSidebar(HomeScreen)} 
        options={{ tabBarLabel: 'Home' }} 
      />
      <Tab.Screen 
        name="Search" 
        component={withSidebar(SearchScreen)} 
        options={{ tabBarLabel: 'Search' }} 
      />
      <Tab.Screen 
        name="Main" 
        component={withSidebar(MainPage)} 
        options={{ tabBarLabel: 'Library' }} 
      />
      <Tab.Screen 
        name="Recommendations" 
        component={withSidebar(ReccoScreen)} 
        options={{ tabBarLabel: 'For You' }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={withSidebar(ProfileScreen)} 
        options={{ tabBarLabel: 'Profile' }} 
      />
      <Tab.Screen 
        name="DNACode" 
        component={DNACodeScreen}
        options={{ 
          tabBarLabel: 'DNA',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="dna" size={size} color={color} />
          )
        }} 
      />
    </Tab.Navigator>
  );
}