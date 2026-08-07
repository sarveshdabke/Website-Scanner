import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds — kyunki PageSpeed API scan mein time leta hai
});

// Naya scan start karne ke liye
export const scanWebsite = async (url) => {
  try {
    const response = await apiClient.post('/scan', { url });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Something went wrong while scanning';
  }
};

// Saare past scans (history) nikalne ke liye
export const getScanHistory = async () => {
  try {
    const response = await apiClient.get('/history');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Could not fetch scan history';
  }
};

// Ek specific scan ka detail nikalne ke liye (ID se)
export const getScanById = async (id) => {
  try {
    const response = await apiClient.get(`/scan/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Could not fetch scan details';
  }
};