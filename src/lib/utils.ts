import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { authService } from "../services/auth.service";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Remove hook usage from non-component function
export const checkAuth = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
    if (!baseUrl) {
      console.error("API URL is not configured");
      return false;
    }

    const response = await fetch(`${baseUrl}/auth/admin/verify`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error("Auth check failed:", response.status);
      return false;
    }

    const data = await response.json();
    return data.valid === true;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
};

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
  if (!baseUrl) {
    throw new Error("API URL is not configured");
  }

  const url = endpoint.startsWith("/")
    ? `${baseUrl}${endpoint}`
    : `${baseUrl}/${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {}),
      },
    });

    if (response.status === 401) {
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};
