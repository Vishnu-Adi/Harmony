import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../../services/api';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [profileName, setProfileName] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const handleSignUp = async () => {
    try {
      const response = await api.post('/auth/signup', { email, password, name, profile_name: profileName });
      if (response.data.token) {
        navigation.navigate('Home');
      }
    } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log('Error response:', error.response);
          console.log('Error message:', error.message);
        }
        Alert.alert('Sign Up Error', 'Unable to register');
      }
  };

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Profile Name"
        value={profileName}
        onChangeText={setProfileName}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}