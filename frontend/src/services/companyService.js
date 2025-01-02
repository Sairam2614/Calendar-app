import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // Set in your .env file

/**
 * Get all companies
 * @param {string} token - The admin's authentication token
 * @returns {Promise<Array>} - List of companies
 */
export const getCompanies = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/admin/companies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

/**
 * Add a new company
 * @param {Object} companyData - The company data to be added
 * @param {string} token - The admin's authentication token
 * @returns {Promise<Object>} - The added company
 */
export const addCompany = async (companyData, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/admin/company`, companyData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding company:', error);
    throw error;
  }
};

/**
 * Update an existing company
 * @param {string} companyId - The ID of the company to update
 * @param {Object} companyData - The updated company data
 * @param {string} token - The admin's authentication token
 * @returns {Promise<Object>} - The updated company
 */
export const updateCompany = async (companyId, companyData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/admin/company/${companyId}`, companyData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

/**
 * Delete a company
 * @param {string} companyId - The ID of the company to delete
 * @param {string} token - The admin's authentication token
 * @returns {Promise<Object>} - Confirmation of deletion
 */
export const deleteCompany = async (companyId, token) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/admin/company/${companyId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting company:', error);
    throw error;
  }
};
