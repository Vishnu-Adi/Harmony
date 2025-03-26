import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

interface SidebarProps {
  isVisible: boolean; 
  onClose: () => void;
  slideAnim: Animated.Value;
}

export default function Sidebar({ isVisible, onClose, slideAnim }: SidebarProps) {
  const navigation = useNavigation();

  const navigateToScreen = (screenName: string, isStackScreen: boolean = false) => {
    if (isStackScreen) {
      // Direct navigation for stack screens
      navigation.navigate(screenName);
    } else {
      // Tab navigation reset
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { 
              name: 'Tab',
              state: {
                routes: [{ name: screenName }]
              }
            }
          ],
        })
      );
    }
    onClose();
  };

  const menuItems = [
    {
      icon: 'account',
      label: 'Profile',
      onPress: () => navigateToScreen('Profile'),
    },
    {
      icon: 'magnify',
      label: 'Search',
      onPress: () => navigateToScreen('Search'),
    },
    {
      icon: 'music',
      label: 'Library',
      onPress: () => navigateToScreen('Main'),
    },
    {
      icon: 'compass-outline',
      label: 'For You',
      onPress: () => navigateToScreen('Recommendations'),
    },
    {
      icon: 'chat-outline',
      label: 'Mood Chatbot',
      onPress: () => navigateToScreen('MoodChatbot', true), // Note the true flag for stack navigation
    },
  ];

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      />
      <Animated.View style={[
        styles.sidebar,
        { transform: [{ translateX: slideAnim }] }
      ]}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john@example.com</Text>
        </View>

        <View style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <MaterialCommunityIcons 
                name={item.icon as any} 
                size={24} 
                color="#EAC85E" 
              />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={24} color="#FF6B6B" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: '#1A1A1A',
    paddingTop: 50,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    color: '#8E8E93',
    fontSize: 14,
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginLeft: 15,
  },
});
