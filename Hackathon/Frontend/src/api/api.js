import axios from "axios";

const API = axios.create({
  // baseURL: "https://api.okrion.ai/api/v1/",
  baseURL: "http://localhost:5000/api/",
  // baseURL: "http://localhost:5030/api/v1/",
  //   timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// FastAPI instance
export const FastAPI = axios.create({
  baseURL: "http://localhost:8000/", // FastAPI default port
  headers: { "Content-Type": "application/json" },
});

// Global request/response interceptors
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default API;
