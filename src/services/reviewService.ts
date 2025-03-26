import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API URL

export const fetchReviewsByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/reviews`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews by user with ID ${userId}:`, error);
    throw error;
  }
};

export const fetchRecentReviews = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reviews/recent`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent reviews:', error);
    throw error;
  }
};

export const submitReview = async (reviewData) => {
  try {
    const token = await AsyncStorage.getItem('user_token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.post(`${API_BASE_URL}/reviews`, reviewData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const likeReview = async (reviewId) => {
  try {
    const token = await AsyncStorage.getItem('user_token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.post(`${API_BASE_URL}/reviews/${reviewId}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error liking review with ID ${reviewId}:`, error);
    throw error;
  }
};

export const addCommentToReview = async (reviewId, comment) => {
  try {
    const token = await AsyncStorage.getItem('user_token');
    if (!token) throw new Error('Not authenticated');

    const response = await axios.post(`${API_BASE_URL}/reviews/${reviewId}/comments`, { text: comment }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to review with ID ${reviewId}:`, error);
    throw error;
  }
};
