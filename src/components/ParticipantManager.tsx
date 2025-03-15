import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "@headlessui/react";
import { toast } from "react-toastify";
import axios from "axios";

interface Registration {
  id: number;
  team_lead_name: string;
  email: string;
  event_name: string;
  status: string;
  payment_screenshot_url: string | null;
  participant_names: string[];
  participant_count: number;
  created_at: string;
  updated_at: string;
}

interface VerificationAction {
  id: number;
  status: "approved" | "rejected";
  notes: string;
}

export function ParticipantManager() {
  const queryClient = useQueryClient();
  const [selectedReg, setSelectedReg] = React.useState<Registration | null>(
    null
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const { data: registrations, isLoading } = useQuery({
    queryKey: ["registrations"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/participant/registrations`,
        { withCredentials: true }
      );
      return response.data.registrations || [];
    },
  });

  const verifyRegistration = useMutation({
    mutationFn: async (data: VerificationAction) => {
      return axios.post(
        `${import.meta.env.VITE_API_URL}/participant/registration/${
          data.id
        }/status`,
        {
          status: data.status,
          notes: data.notes,
        },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["registrations"]);
      toast.success("Registration status updated");
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  const handleVerification = async (status: "approved" | "rejected") => {
    if (!selectedReg) return;

    await verifyRegistration.mutateAsync({
      id: selectedReg.id,
      status,
      notes: `${status} by admin on ${new Date().toLocaleDateString()}`,
    });
  };

  if (isLoading) {
    return <div>Loading registrations...</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Team Lead
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Participants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations?.map((reg: Registration) => (
              <tr key={reg.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {reg.team_lead_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {reg.event_name}
                </td>
                <td className="px-6 py-4">
                  {Array.isArray(reg.participant_names)
                    ? reg.participant_names.join(", ")
                    : reg.team_lead_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      reg.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : reg.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {reg.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => {
                      setSelectedReg(reg);
                      setIsOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                    disabled={verifyRegistration.isLoading}
                  >
                    {verifyRegistration.isLoading ? "Processing..." : "Verify"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg p-6 w-full max-w-lg">
            {selectedReg && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Verify Registration</h3>
                <div>
                  <p>
                    <strong>Name:</strong> {selectedReg.team_lead_name}
                  </p>
                  <p>
                    <strong>Event:</strong> {selectedReg.event_name}
                  </p>
                  <p>
                    <strong>Participants:</strong>{" "}
                    {selectedReg.participant_names.join(", ")}
                  </p>
                </div>
                {selectedReg.payment_screenshot_url && (
                  <img
                    src={selectedReg.payment_screenshot_url}
                    alt="Payment Screenshot"
                    className="max-h-60 object-contain"
                  />
                )}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleVerification("rejected")}
                    className="px-4 py-2 bg-red-500 text-white rounded"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerification("approved")}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Approve
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
