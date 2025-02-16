import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import SignUpForm from '../../components/Auth/SignUpForm';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <SignUpForm />
      <TouchableOpacity onPress={() => navigation.navigate('SpotifyAuth')}>
        <Text style={{ marginTop: 20, color: 'blue', textAlign: 'center' }}>
          Sign up with Spotify
        </Text>
      </TouchableOpacity>
    </View>
  );
}