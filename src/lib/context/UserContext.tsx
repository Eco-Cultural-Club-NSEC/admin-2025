import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { apiUri } from "../dummy-data";
import { toast } from "sonner";

interface UserType {
  id: number;
  name: string;
  email: string;
  admin: boolean;
  created_at: Date;
}

interface UserContextType {
  users: UserType[];
  setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  fetchUsers: () => Promise<void>;
  updateStatus: (userId: number) => Promise<void>;
  deleteUser: (userId: number) => Promise<void>;
  loading: boolean;
}

export const UserContext = React.createContext<UserContextType | undefined>(
  undefined
);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUri}/user/all`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUsers(res.data.users);
      } else {
        toast.info(res.data.message);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error?.response?.data?.message ?? "Error fetching users");
    } finally {
      setLoading(false);
    }
  }, [apiUri]);

  async function updateStatus(userId: number) {
    try {
      const res = await axios.get(`${apiUri}/user/toggleadmin/?id=${userId}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, admin: res.data.user.admin } : user
          )
        );
        toast.success(res.data.message);
      } else {
        toast.info(res.data.message);
      }
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error(
        error?.response?.data?.message ?? "Error updating user status"
      );
    }
  }

  async function deleteUser(userId: number) {
    try {
      const res = await axios.delete(`${apiUri}/user/delete/?id=${userId}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        toast.success(res.data.message);
      } else {
        toast.info(res.data.message);
      }
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error?.response?.data?.message ?? "Error deleting user");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <UserContext.Provider
      value={{ users, setUsers, fetchUsers, updateStatus, deleteUser, loading }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
