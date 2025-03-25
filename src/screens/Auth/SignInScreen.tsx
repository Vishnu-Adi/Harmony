import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ImageBackground, 
  Image, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import qs from 'qs';
import api from '../../services/api';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SignInScreen() {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasSpotifyToken, setHasSpotifyToken] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSpotifyToken = async () => {
      try {
        const token = await AsyncStorage.getItem('spotify_token');
        setHasSpotifyToken(token !== null);
      } catch (error) {
        console.error("Error fetching Spotify token:", error);
      }
    };
    checkSpotifyToken();
  }, []);

  // Use the same functionality as in SignInForm
  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const formData = qs.stringify({
        username: email, 
        password,
      });
      const response = await api.post('/auth/signin', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      
      // Important: Use the same navigation logic as SignInForm
      if (response.data.access_token) {
        await AsyncStorage.setItem('user_token', response.data.access_token);
        navigation.navigate('Home'); // This matches SignInForm's navigation
      } else {
        navigation.navigate('Home'); // This matches SignInForm's fallback
      }
    } catch (error) {
      console.error('Sign in error:', error);
      Alert.alert('Sign In Error', 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert('Coming Soon', 'Password reset functionality coming soon!');
  };

  const handleSpotifyAuth = () => {
    navigation.navigate('SpotifyAuth');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <ImageBackground
          source={require('../../../assets/favicon.png')}
          style={styles.backgroundImage}
        >
          <View style={styles.overlay} />
        </ImageBackground>
      </View>

      <View style={styles.formContainer}>
        <Image source={require('../../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.title}>Harmony</Text>
        <Text style={styles.subtitle}>Login</Text>
        <Text style={styles.description}>Please sign in to continue.</Text>

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            placeholderTextColor="#CCC"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor="#CCC"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Signing in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.spotifyButton} 
          onPress={handleSpotifyAuth}
          disabled={isLoading}
        >
          <Text style={styles.spotifyButtonText}>Sign in with Spotify</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('SignUp')}
          disabled={isLoading}
        >
          <Text style={styles.footerText}>
            Don't have an account? <Text style={styles.signupText}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1F25',
  },
  topSection: {
    flex: 1.5,
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    width: '200%',
    height: '100%',
    backgroundColor: '#2c343f',
    transform: [{ rotate: '-20deg' }],
    top: 205,
    left: 0,
    borderBottomRightRadius: 150,
  },
  formContainer: {
    flex: 2,
    backgroundColor: '#2c343f',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: 40,
    paddingTop: 0,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#EAC85E',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  description: {
    fontSize: 16,
    color: '#CCC',
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#2c343f',
    color: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    width: '100%',
    borderWidth: 1,
    borderColor: '#EAC85E',
  },
  forgotPassword: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'right',
    width: '100%',
    marginLeft: 185,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '45%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#1f1717',
    fontWeight: 'bold',
    fontSize: 16,
  },
  spotifyButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    marginTop: 15,
  },
  spotifyButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    color: '#CCC',
    fontSize: 14,
    marginTop: 20,
  },
  signupText: {
    color: '#1ED760',
    fontWeight: 'bold',
  },
});