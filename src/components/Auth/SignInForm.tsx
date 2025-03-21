import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import qs from 'qs';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import api from '../../services/api';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const handleSignIn = async () => {
    try {
      const formData = qs.stringify({
        username: email, 
        password,
      });
      const response = await api.post('/auth/signin', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      if (response.data.access_token) {
        navigation.navigate('ManualEntry');
      }else{
        navigation.navigate('ManualEntry');
      }
    } catch (error) {
      Alert.alert('Sign In Error', 'Invalid credentials');
    }
  };

  return (
    <View>
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
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
}