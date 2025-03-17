import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { apiUri } from "../dummy-data";
import { toast } from "sonner";

interface ParticipantType {
  id: number;
  name: string[];
  email: string;
  whatsapp_no: string;
  alt_phone: string;
  event: string;
  event_date: string;
  event_location: string;
  collage_name: string;
  amount_paid: number;
  transaction_id: string | null;
  transaction_screenshot: string | null;
  status: "approved" | "pending" | "rejected";
  created_at: string;
}

interface ParticipantsContextType {
  participants: ParticipantType[];
  setParticipants: React.Dispatch<React.SetStateAction<ParticipantType[]>>;
  updateStatus: (userId: number, status: "approved" | "rejected") => Promise<void>;
  fetchParticipants: () => void;
  deleteParticipants: (userId: number) => void;
  loading: boolean;
}

export const ParticipantsContext = React.createContext<ParticipantsContextType | undefined>(undefined);

export function ParticipantsProvider({ children }: { children: React.ReactNode }) {
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchParticipants = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${apiUri}/participants`, { withCredentials: true });
      if (res.status === 200) {
        setParticipants(res.data.participants);
      } else {
        toast.info(res.data.message);
      }
    } catch (error: any) {
      console.error("Error fetching participants:", error.message);
      toast.error(error.response?.data?.message || "Error fetching participants");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = async (userId: number, status: string) => {
    try {
      const res = await axios.get(
        `${apiUri}/participants/togglestatus?id=${userId}&status=${status}`,
        {
          withCredentials: true,
        }
      );
      if (res.status == 200) {
        setParticipants((prevParticipants) =>
          prevParticipants.map((participant) =>
            participant.id === userId
              ? { ...participant, status: res.data.participant.status }
              : participant
          )
        );
        toast.success(
          `Participant ${
            status === "approved" ? "approved" : "rejected"
          } successfully`
        );
      } else {
        toast.info(res.data.message);
      }
    } catch (error: any) {
      console.error("Error updating user status:", error);
      toast.error(
        error?.response?.data?.message ?? "Error updating user status"
      );
    }
  };

  const deleteParticipants = async (userId: number) => {
    try {
      const res = await axios.delete(`${apiUri}/participants/delete?id=${userId}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setParticipants((prevParticipants) =>
          prevParticipants.filter((participant) => participant.id !== userId)
        );
        toast.success("Participant deleted successfully");
      } else {
        toast.info(res.data.message);
      }
    } catch (error: any) {
      console.error("Error deleting participant:", error);
      toast.error(
        error?.response?.data?.message ?? "Error deleting participant"
      );
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  return (
    <ParticipantsContext.Provider value={{ participants, setParticipants, updateStatus, fetchParticipants, deleteParticipants, loading }}>
      {children}
    </ParticipantsContext.Provider>
  );
}

export function useParticipants() {
  const context = React.useContext(ParticipantsContext);
  if (!context) {
    throw new Error("useParticipants must be used within a ParticipantsProvider");
  }
  return context;
}