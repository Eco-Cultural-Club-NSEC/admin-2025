import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const usersApi = {
  getUsers: async () => {
    const response = await axios.get(`${API_URL}/user/all`, {
      withCredentials: true,
    });
    return response.data.users;
  },

  getUser: async (id: string) => {
    const response = await axios.get(`${API_URL}/user/${id}`, {
      withCredentials: true,
    });
    return response.data.user;
  },

  createUser: async (userData: any) => {
    const response = await axios.post(`${API_URL}/user`, userData, {
      withCredentials: true,
    });
    return response.data.user;
  },

  updateUser: async (id: string, userData: any) => {
    const response = await axios.put(`${API_URL}/user/${id}`, userData, {
      withCredentials: true,
    });
    return response.data.user;
  },

  deleteUser: async (id: string) => {
    const response = await axios.delete(`${API_URL}/user/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  toggleAdmin: async (userId: number) => {
    const response = await axios.post(
      `${API_URL}/user/toggleadmin`,
      { id: userId },
      { withCredentials: true }
    );
    return response.data;
  },
};
