import { FastAPI } from '../api.js';

export const predictAI = async (text) => {
  try {
    const response = await FastAPI.post('/predict', { text });
    return response.data;
  } catch (error) {
    // Handle error as needed
    throw error;
  }
}; 