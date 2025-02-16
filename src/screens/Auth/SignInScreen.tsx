import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import SignInForm from '../../components/Auth/SignInForm';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

export default function SignInScreen() {
  const navigation = useNavigation<SignInScreenNavigationProp>();

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <SignInForm />
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={{ marginTop: 20, color: 'blue', textAlign: 'center' }}>
          Don't have an account? Register
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SpotifyAuth')}>
        <Text style={{ marginTop: 20, color: 'blue', textAlign: 'center' }}>
          Sign in with Spotify
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {/* Implement forgot password flow if needed */}}>
        <Text style={{ marginTop: 20, color: 'red', textAlign: 'center' }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  );
}