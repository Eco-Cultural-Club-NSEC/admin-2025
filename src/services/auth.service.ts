import api from "../api/client";
import { getAdminUrl } from "../lib/utils";

interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    is_admin: boolean;
  };
  url?: string;
}

export const authService = {
  async getGoogleAuthUrl(): Promise<AuthResponse> {
    try {
      const adminUrl = getAdminUrl();
      const response = await api.get<AuthResponse>("/auth/google", {
        headers: {
          Origin: adminUrl,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to get Google auth URL"
      );
    }
  },

  async logout(): Promise<AuthResponse> {
    const response = await api.get(
      `${import.meta.env.VITE_API_URL}/auth/logout`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  },

  async getCurrentUser(): Promise<AuthResponse> {
    try {
      const response = await api.get<AuthResponse>("/auth/me");
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  async verifyOTP(userId: string, code: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/verify-otp",
        { userId, code },
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return {
          success: false,
          message: error.response.data.message || "Invalid verification code",
        };
      }
      throw error;
    }
  },
};
