import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Make sure this is set in your .env file

/**
 * Fetch all communication methods
 * @param {string} token - The admin's authentication token
 * @returns {Promise<Array>} - List of communication methods
 */
export const getCommunicationMethods = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/methods`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching communication methods:', error);
    throw error;
  }
};

/**
 * Add a new communication method
 * @param {Object} methodData - The method data to be added
 * @param {string} token - The admin's authentication token
 * @returns {Promise<Object>} - The added method
 */
export const addMethod = async (methodData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/methods`, methodData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding communication method:', error);
    throw error;
  }
};

/**
 * Update an existing communication method
 * @param {string} methodId - The ID of the method to update
 * @param {Object} methodData - The updated method data
 * @param {string} token - The admin's authentication token
 * @returns {Promise<Object>} - The updated method
 */
export const updateMethod = async (methodId, methodData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/admin/methods/${methodId}`, methodData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating communication method:', error);
    throw error;
  }
};

/**
 * Delete a communication method
 * @param {string} methodId - The ID of the method to delete
 * @param {string} token - The admin's authentication token
 * @returns {Promise<Object>} - Confirmation of deletion
 */
export const deleteMethod = async (methodId, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/methods/${methodId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting communication method:', error);
    throw error;
  }
};
