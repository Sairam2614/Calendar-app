import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Login user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Axios response
 */
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
    return response;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Register user
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} role - User's role (admin/user)
 * @returns {Promise} - Axios response
 */
export const register = async (name, email, password, role) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, {
      name,
      email,
      password,
      role,
    });
    return response;
  } catch (error) {
    console.error("Error during registration:", error.response?.data || error.message);
    throw error;
  }
};
