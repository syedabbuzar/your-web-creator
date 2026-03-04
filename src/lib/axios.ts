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

// URLs that should NOT send Authorization header (public endpoints)
const PUBLIC_ENDPOINTS = ["/auth/register", "/auth/login", "/auth/change-class"];

axiosInstance.interceptors.request.use((config) => {
  const url = config.url || "";
  const isPublic = PUBLIC_ENDPOINTS.some((ep) => url.startsWith(ep));
  if (!isPublic) {
    const token = resolveAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default axiosInstance;
