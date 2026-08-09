import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

export const scanWebsite = async (url) => {
  try {
    const response = await apiClient.post('/scan', { url });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Something went wrong while scanning';
  }
};

export const getScanHistory = async () => {
  try {
    const response = await apiClient.get('/history');
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Could not fetch scan history';
  }
};

export const getScanById = async (id) => {
  try {
    const response = await apiClient.get(`/scan/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Could not fetch scan details';
  }
};

// Naya — AI analysis nikalne ke liye
export const getAIAnalysis = async (id) => {
  try {
    const response = await apiClient.post(`/ai-analysis/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Could not generate AI analysis';
  }
};

// Naya — SSE se live scan progress track karne ke liye
// Isse EventSource use karke call karenge, isliye ye sirf URL banata hai
export const getScanStreamUrl = (url) => {
  return `${API_BASE_URL}/scan-stream?url=${encodeURIComponent(url)}`;
};