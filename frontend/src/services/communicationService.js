import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Get all companies
export const getCompanies = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/companies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error.response?.data || error.message);
    throw error;
  }
};

// Get overdue communications
export const getOverdueCommunications = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/communications/overdue`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching overdue communications:", error.response?.data || error.message);
    throw error;
  }
};

// Get today's communications
export const getTodaysCommunications = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/communications/today`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching today's communications:", error.response?.data || error.message);
    throw error;
  }
};

// Log a new communication
export const logCommunication = async (communicationData, token) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/user/communications/log`,
      communicationData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error logging communication:", error.response?.data || error.message);
    throw error;
  }
};
