import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API URL

export const fetchCurrentUser = async () => {
  try {
    const token = await AsyncStorage.getItem('user_token');
    if (!token) return null;

    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const token = await AsyncStorage.getItem('user_token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.put(`${API_BASE_URL}/users/me`, userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const followUser = async (userId) => {
  try {
    const token = await AsyncStorage.getItem('user_token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.post(`${API_BASE_URL}/users/${userId}/follow`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

export const unfollowUser = async (userId) => {
  try {
    const token = await AsyncStorage.getItem('user_token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.delete(`${API_BASE_URL}/users/${userId}/follow`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};
