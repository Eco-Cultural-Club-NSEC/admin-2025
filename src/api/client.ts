import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Add timeout
  timeout: 10000,
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
      return Promise.reject(new Error("Request timeout"));
    }

    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject(
        new Error("Network error - please check your connection")
      );
    }

    if (error.response?.status === 401) {
      // Handle unauthorized
      window.location.href = "/login";
      return Promise.reject(new Error("Please log in to continue"));
    }

    if (error.response?.status === 403) {
      // Handle forbidden
      return Promise.reject(
        new Error("You don't have permission to access this resource")
      );
    }

    return Promise.reject(error);
  }
);

export default api;
