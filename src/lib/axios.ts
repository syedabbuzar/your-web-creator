import axios from "axios";

const resolveAuthToken = () =>
  localStorage.getItem("adminToken") ||
  localStorage.getItem("token") ||
  localStorage.getItem("scholar_admin_token") ||
  localStorage.getItem("scholar_quiz_token");

const axiosInstance = axios.create({
  baseURL: "https://scholar-backen.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = resolveAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;