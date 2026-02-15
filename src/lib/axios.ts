import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://scholar-backen.vercel.app/api", // backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
