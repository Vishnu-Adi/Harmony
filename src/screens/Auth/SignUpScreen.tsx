import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../../services/api';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profileName, setProfileName] = useState('');

  const handleSignUp = async () => {
    try {
      const response = await api.post('/auth/signup', { 
        email, 
        password, 
        name, 
        profile_name: profileName 
      });
      if (response.data.token) {
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Sign Up Error', 'Unable to register');
    }
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
        <Text style={styles.subtitle}>Sign Up</Text>
        <Text style={styles.description}>Create an account to get started.</Text>

        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Name" 
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Profile Name" 
            placeholderTextColor="#666"
            value={profileName}
            onChangeText={setProfileName}
          />
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.spotifyButton} 
          onPress={() => navigation.navigate('SpotifyAuth')}
        >
          <Text style={styles.spotifyButtonText}>Sign up with Spotify</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already have an account?
          <Text 
            style={styles.signupText}
            onPress={() => navigation.navigate('SignIn')}
          > Sign in</Text> instead.
        </Text>
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
    paddingHorizontal: 40,
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
    backgroundColor: '#ffffff',
    color: '#000', // Black text inside input
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    width: '100%',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#1f1717',
    fontWeight: 'bold',
    fontSize: 16,
  },
  spotifyButton: {
    backgroundColor: '#1DB954', // Spotify green
    paddingVertical: 12,
    borderRadius: 30,
    width: '60%',
    alignItems: 'center',
    marginTop: 10,
  },
  spotifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    color: '#CCC',
    fontSize: 14,
    marginTop: 20,
  },
  signupText: {
    color: '#EAC85E',
    fontWeight: 'bold',
  },

});