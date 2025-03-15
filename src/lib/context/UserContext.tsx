import React, { useEffect, useState } from "react";
import api from "../../api/client";
import { toast } from "sonner";
import { useAuth } from "../auth"; // Import useAuth

interface UserType {
  id: number;
  name: string;
  email: string;
  is_admin: boolean; // Changed from admin to is_admin
  created_at: Date;
}

interface UserContextType {
  users: UserType[];
  setUsers: (users: UserType[]) => void;
  updateStatus: (userId: number) => void;
  loading: boolean;
}

export const UserContext = React.createContext<UserContextType>({
  users: [],
  setUsers: () => {},
  updateStatus: () => {},
  loading: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  async function fetchUsers() {
    if (!user?.is_admin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get("/user/all");

      if (response.data?.users) {
        setUsers(response.data.users);
      } else {
        setUsers([]);
        toast.error("No users data received");
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(userId: number) {
    try {
      const res = await axios.get(`${apiUri}/user/toggleadmin/?id=${userId}`, {
        withCredentials: true,
      });
      console.log("res", res);

      if (res.status == 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? { ...user, is_admin: res.data.user.is_admin }
              : user
          )
        );
        toast.success(res.data.message);
      } else {
        toast.info(res.data.message);
      }
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error("Error updating user status");
      if (error.response?.data?.message)
        toast.error(error.response.data.message);
    }
  }

  useEffect(() => {
    if (user?.is_admin) {
      fetchUsers();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ users, setUsers, updateStatus, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error(
      "useParticipants must be used within a ParticipantsProvider"
    );
  }
  return context;
}
