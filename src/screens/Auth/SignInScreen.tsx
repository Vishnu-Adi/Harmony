// File: src/screens/Auth/SignInScreen.tsx
import React, { useState, useEffect } from 'react'; // Import useEffect
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SignInForm from '../../components/Auth/SignInForm';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SignInScreen() {
  const navigation = useNavigation<SignInScreenNavigationProp>();
   const [hasSpotifyToken, setHasSpotifyToken] = useState(false);

   useEffect(() => {
    const checkSpotifyToken = async () => {
      const token = await AsyncStorage.getItem('spotify_token');
      setHasSpotifyToken(!!token); // Convert to boolean (true if token exists, false otherwise)
    };

    checkSpotifyToken();
  }, []);
  
  return (
    <View style={styles.container}>
      <SignInForm />
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SpotifyAuth')}>
        <Text style={styles.linkText}>
          Sign in with Spotify
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {/* Implement forgot password flow */ }}>
        <Text style={styles.forgotPasswordText}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  linkText: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
  forgotPasswordText: {
    marginTop: 20,
    color: 'red',
    textAlign: 'center',
  },
});