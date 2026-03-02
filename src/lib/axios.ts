import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://scholar-backen.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 MOST IMPORTANT FIX
axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;