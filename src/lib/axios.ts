import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://scholar-backen.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 ADD THIS INTERCEPTOR (MAIN FIX)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ TOKEN ATTACHED
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;