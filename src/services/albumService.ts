import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API URL

export const fetchPopularAlbums = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/albums/popular`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular albums:', error);
    throw error;
  }
};

export const fetchAlbumById = async (albumId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/albums/${albumId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching album with ID ${albumId}:`, error);
    throw error;
  }
};

export const fetchAlbumReviews = async (albumId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/albums/${albumId}/reviews`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for album with ID ${albumId}:`, error);
    throw error;
  }
};

export const toggleFavoriteAlbum = async (albumId) => {
  try {
    const token = await AsyncStorage.getItem('user_token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.post(`${API_BASE_URL}/albums/${albumId}/favorite`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error toggling favorite status for album with ID ${albumId}:`, error);
    throw error;
  }
};

export const searchAlbums = async (query) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/albums/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching albums with query "${query}":`, error);
    throw error;
  }
};
