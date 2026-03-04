import axios from "axios";

const API_PROXY_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/backend-proxy`;

const resolveAuthToken = () => {
  const rawToken =
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("scholar_admin_token") ||
    localStorage.getItem("scholar_quiz_token");

  if (!rawToken) return null;
  const token = rawToken.trim();
  if (!token || token === "undefined" || token === "null") return null;
  return token;
};

const normalizePath = (url: string) => (url.startsWith("/") ? url : `/${url}`);

const axiosInstance = axios.create({
  baseURL: API_PROXY_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// URLs that should NOT send Authorization header (public endpoints)
const PUBLIC_ENDPOINTS = [
  "/auth/register",
  "/auth/login",
  "/auth/change-class",
  "/auth/admin-login",
];

axiosInstance.interceptors.request.use((config) => {
  const rawUrl = config.url || "/";
  const url = normalizePath(rawUrl);
  const isPublic = PUBLIC_ENDPOINTS.some((ep) => url.startsWith(ep));

  config.params = {
    ...(config.params || {}),
    path: url,
  };
  config.url = "";

  if (!isPublic) {
    const token = resolveAuthToken();
    if (token) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default axiosInstance;
