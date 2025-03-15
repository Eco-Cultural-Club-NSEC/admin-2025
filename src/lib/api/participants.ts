import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface FilterParams {
  day?: string;
  event?: string;
  status?: string;
  search?: string;
}

export const participantsApi = {
  getParticipants: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/participant/registrations`, {
        withCredentials: true,
      });
      return data.registrations || [];
    } catch (error) {
      console.error("Error fetching participants:", error);
      return [];
    }
  },

  updateParticipantStatus: async ({
    userId,
    status,
    reason,
  }: {
    userId: number;
    status: string;
    reason?: string;
  }) => {
    const { data } = await axios.post(
      `${API_URL}/participant/registration/${userId}/status`,
      { status, reason },
      { withCredentials: true }
    );
    return data.registration;
  },

  async updateStatus(id: string, status: string, reason?: string) {
    try {
      const response = await axios.post(
        `${API_URL}/participant/registration/${id}/status`,
        {
          status,
          reason,
        },
        { withCredentials: true }
      );
      return response.data.registration;
    } catch (error: any) {
      // Enhance error handling
      const errorMessage =
        error.response?.data?.message || "Failed to update status";
      throw new Error(errorMessage);
    }
  },

  getParticipantDetails: async (id: number) => {
    const { data } = await axios.get(
      `${API_URL}/participant/registration/${id}`,
      { withCredentials: true }
    );
    return data.registration;
  },
};
