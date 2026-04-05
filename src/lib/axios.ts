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
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auto-retry on network errors (DNS fail, timeout, etc.)
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;
    if (
      !config._retryCount &&
      (!error.response || error.code === "ERR_NETWORK" || error.code === "ECONNABORTED")
    ) {
      config._retryCount = (config._retryCount || 0) + 1;
      if (config._retryCount <= 2) {
        await new Promise((r) => setTimeout(r, 1000 * config._retryCount));
        return axiosInstance(config);
      }
    }
    return Promise.reject(error);
  }
);

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
