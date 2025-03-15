import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { participantsApi } from "../api/participants";

interface ParticipantType {
  id: number;
  status: string;
  rejection_reason?: string;
  email: string;
  event_name: string; // Changed from event_title
  team_lead_name: string; // Added to match DB schema
  participant_names: string[];
  participant_count: number;
  whatsapp_number: string;
  alternate_phone: string | null;
  college: string;
  payment_status: string;
  upi_transaction_id: string | null;
  payment_screenshot_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ParticipantsContextType {
  participants: ParticipantType[];
  setParticipants: (participants: ParticipantType[]) => void;
  updateStatus: (id: number, status: string, reason?: string) => Promise<void>;
  loading: boolean;
  optimisticUpdateStatus: (id: number, status: string, reason?: string) => void;
}

export const ParticipantsContext = React.createContext<ParticipantsContextType>(
  {
    participants: [],
    setParticipants: () => {},
    updateStatus: async () => {},
    loading: false,
    optimisticUpdateStatus: () => {},
  }
);

export function useParticipants() {
  const context = React.useContext(ParticipantsContext);
  if (!context) {
    throw new Error("useParticipants must be used within ParticipantsProvider");
  }
  return context;
}

export function ParticipantsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();

  const {
    data: participants = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["participants"],
    queryFn: participantsApi.getParticipants,
    staleTime: 30000, // Data stays fresh for 30 seconds
    cacheTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const optimisticUpdateStatus = React.useCallback(
    (id: number, status: string, reason?: string) => {
      queryClient.setQueryData<ParticipantType[]>(["participants"], (old) => {
        if (!old) return [];
        return old.map((participant) =>
          participant.id === id
            ? {
                ...participant,
                status,
                rejection_reason: reason,
                updated_at: new Date().toISOString(),
              }
            : participant
        );
      });
    },
    [queryClient]
  );

  const updateStatusMutation = useMutation({
    mutationFn: ({
      id,
      status,
      reason,
    }: {
      id: number;
      status: string;
      reason?: string;
    }) => participantsApi.updateStatus(id.toString(), status, reason),
    onMutate: async ({ id, status, reason }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["participants"]);

      // Snapshot the previous value
      const previousParticipants = queryClient.getQueryData<ParticipantType[]>([
        "participants",
      ]);

      // Optimistically update
      optimisticUpdateStatus(id, status, reason);

      return { previousParticipants };
    },
    onError: (err, variables, context) => {
      // Revert back on failure
      if (context?.previousParticipants) {
        queryClient.setQueryData(
          ["participants"],
          context.previousParticipants
        );
      }
      toast.error("Failed to update status");
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries(["participants"]);
    },
  });

  const value = React.useMemo(
    () => ({
      participants,
      setParticipants: (data: ParticipantType[]) =>
        queryClient.setQueryData(["participants"], data),
      updateStatus: (id: number, status: string, reason?: string) =>
        updateStatusMutation.mutateAsync({ id, status, reason }),
      loading,
      optimisticUpdateStatus,
    }),
    [
      participants,
      updateStatusMutation,
      loading,
      queryClient,
      optimisticUpdateStatus,
    ]
  );

  return (
    <ParticipantsContext.Provider value={value}>
      {children}
    </ParticipantsContext.Provider>
  );
}
