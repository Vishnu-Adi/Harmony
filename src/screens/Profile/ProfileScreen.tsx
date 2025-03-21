import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Profile {
  name: string;
  dna: string;
}

export default function ProfileScreen() {
  const [profile, setProfile] = useState<Profile>({ name: '', dna: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Assume that after registration (via Spotify or traditional signin) the backend returns a user token  
        const userToken = await AsyncStorage.getItem('user_token');
        if (!userToken) {
          Alert.alert('Error', 'User not authenticated.');
          return;
        }
        // Call your backend endpoint to get the user’s profile info (including the DNA code)
        const response = await axios.get('http://<BACKEND_IP_OR_URL>:8000/auth/profile', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setProfile({ name: response.data.name, dna: response.data.dna });
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Failed to fetch profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#000" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.label}>Username:</Text>
      <Text style={styles.value}>{profile.name}</Text>
      <Text style={styles.label}>DNA Code:</Text>
      <Text style={styles.value}>{profile.dna}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#e0f2fe',
    padding: 20,
  },
  title: {
    fontSize:24,
    fontWeight:'bold',
    marginBottom:20,
    color: '#0369a1',
  },
  label: {
    fontSize:18,
    fontWeight:'600',
    marginTop: 10,
    color: '#0369a1',
  },
  value: {
    fontSize:16,
    marginBottom:10,
    color: '#4b5563',
  },
});