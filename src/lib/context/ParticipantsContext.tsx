import React, { useEffect, useState } from "react";
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
  setParticipants: (participants: ParticipantType[]) => void;
  updateStatus: (userId: number, status: string) => void;
}

export const ParticipantsContext = React.createContext<ParticipantsContextType>(
  {
    participants: [],
    setParticipants: () => {},
    updateStatus: () => {},
  }
);

export function ParticipantsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [participants, setParticipants] = useState<ParticipantType[]>([]);

  const fetchParticipants = async () => {
    try {
      const res = await axios.get(`${apiUri}/participants`, {
        withCredentials: true,
      });
      if (res.status == 200) {
        setParticipants(res.data.participants);
      } else {
        toast.info(res.data.message);
      }
    } catch (error: any) {
      console.error("Error fetching participants:", error.message);
      toast.error("Error fetching participants");
      if (error.response.data.message) toast.error(error.response.data.message);
    }
  };

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

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <ParticipantsContext.Provider
      value={{ participants, setParticipants, updateStatus }}
    >
      {children}
    </ParticipantsContext.Provider>
  );
}

export function useParticipants() {
  const context = React.useContext(ParticipantsContext);
  if (context === undefined) {
    throw new Error(
      "useParticipants must be used within a ParticipantsProvider"
    );
  }
  return context;
}
