import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { participantsApi } from "../lib/api/participants";
import { Check, X, Download, Eye, Search, Filter } from "lucide-react";
import { Modal } from "../components/Modal";
import { AlertDialog } from "../components/AlertDialog";
import { Pagination } from "../components/ui/pagination"; // Add this import
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useParticipants } from "../lib/context/ParticipantsContext";
import { events } from "../../../frontend/src/data";
import { RejectionDialog } from "../components/RejectionDialog";
import { LoadingOverlay } from "../components/ui/spinner";

interface Participant {
  id: number;
  status: string;
  rejection_reason?: string;
  team_lead_name: string;
  email: string;
  event_name: string;
  whatsapp_number: string;
  college: string;
  payment_status: string;
  upi_transaction_id: string | null;
  payment_screenshot_url: string | null;
  created_at: string;
  updated_at: string;
  participant_names: string[];
  participant_count: number;
  event_day: string;
  event_time: string;
  event_location: string;
}

export function Participants() {
  const queryClient = useQueryClient();
  const { optimisticUpdateStatus } = useParticipants();

  const [selectedDay, setSelectedDay] = React.useState<string>("all");
  const [selectedEvent, setSelectedEvent] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedParticipant, setSelectedParticipant] =
    React.useState<Participant | null>(null);
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<{
    participantId: number;
    newStatus: "approved" | "rejected";
  } | null>(null);
  const [showRejectionDialog, setShowRejectionDialog] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

  const { data: participantsList = [], isLoading } = useQuery({
    queryKey: ["participants"],
    queryFn: participantsApi.getParticipants,
    // Remove the onSuccess handler since we don't need setParticipants
  });

  const updateStatusMutation = useMutation({
    mutationFn: participantsApi.updateParticipantStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(["participants"]);
      toast.success("Status updated successfully");
      setShowAlertDialog(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update status");
    },
  });

  // Get unique days from event data
  const eventDays = Array.from(new Set(events.map((e) => e.date))); // ['day 1', 'day 2']
  const eventsList = events.map((e) => ({ id: e.id, title: e.title }));

  const filteredParticipants = participantsList.filter((participant) => {
    // Day filter
    const matchesDay =
      selectedDay === "all" ||
      participant.event_day?.toLowerCase() === selectedDay.toLowerCase();

    // Event filter - use event_name
    const matchesEvent =
      selectedEvent === "all" ||
      participant.event_name?.toLowerCase() === selectedEvent.toLowerCase();

    // Status filter
    const matchesStatus =
      statusFilter === "all" || participant.status === statusFilter;

    // Search across multiple fields
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      participant.team_lead_name?.toLowerCase().includes(searchLower) ||
      participant.email?.toLowerCase().includes(searchLower) ||
      participant.event_name?.toLowerCase().includes(searchLower) ||
      participant.whatsapp_number?.includes(searchQuery) ||
      participant.college?.toLowerCase().includes(searchLower);

    return matchesDay && matchesEvent && matchesStatus && matchesSearch;
  });

  // Calculate paginated data from filtered participants
  const paginatedParticipants = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredParticipants.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredParticipants, currentPage]);

  const totalPages = Math.ceil(filteredParticipants.length / itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedDay, selectedEvent, statusFilter, searchQuery]);

  const handleReject = (participantId: string) => {
    setSelectedParticipant(participantId);
    setShowRejectionDialog(true);
  };

  const handleRejectionConfirm = async (reason: string) => {
    try {
      // Apply optimistic update immediately
      optimisticUpdateStatus(selectedParticipant, "rejected", reason);

      await participantsApi.updateStatus(
        selectedParticipant,
        "rejected",
        reason
      );
      toast.success("Registration rejected successfully");
    } catch (error: any) {
      // Revert optimistic update on error
      queryClient.invalidateQueries(["participants"]);
      toast.error(error.message || "Failed to reject registration");
    }
    setShowRejectionDialog(false);
    setSelectedParticipant(null);
  };

  const toggleStatus = async (
    participantId: number,
    newStatus: "approved" | "rejected"
  ) => {
    if (newStatus === "rejected") {
      handleReject(participantId);
    } else {
      // Apply optimistic update for approval
      optimisticUpdateStatus(participantId, newStatus);
      setPendingAction({ participantId, newStatus });
      setShowAlertDialog(true);
    }
  };

  const confirmStatusChange = async () => {
    if (!pendingAction) return;
    try {
      await participantsApi.updateStatus(
        pendingAction.participantId.toString(),
        pendingAction.newStatus
      );
      toast.success("Status updated successfully");
    } catch (error) {
      // Revert optimistic update on error
      queryClient.invalidateQueries(["participants"]);
      toast.error("Failed to update status");
    }
    setShowAlertDialog(false);
    setPendingAction(null);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredParticipants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
    XLSX.writeFile(workbook, "participants.xlsx");
    toast.success("Excel file downloaded successfully");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Event Participants
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of all event participants and their current registration
            status.
          </p>
        </div>
        <button
          onClick={downloadExcel}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Excel
        </button>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
            />
          </div>

          {/* Day Filter */}
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="all">All Days</option>
            {eventDays.map((day) => (
              <option key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </option>
            ))}
          </select>

          {/* Event Filter */}
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="all">All Events</option>
            {eventsList.map((event) => (
              <option key={event.id} value={event.title}>
                {event.title}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <LoadingOverlay loading={isLoading}>
          <div className="mt-8 flex flex-col">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr className="text-gray-900 dark:text-white">
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold"
                        >
                          Phone
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold"
                        >
                          Event
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold"
                        >
                          UPI Transaction ID
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold"
                        >
                          Registered At
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white dark:bg-gray-900 dark:divide-gray-700">
                      {paginatedParticipants.map((participant) => (
                        <tr key={participant.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                            {participant.team_lead_name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {participant.email}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {participant.whatsapp_number}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {participant.event_name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {participant.upi_transaction_id || "N/A"}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                participant.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : participant.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {participant.status.charAt(0).toUpperCase() +
                                participant.status.slice(1)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(
                              participant.created_at
                            ).toLocaleDateString()}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedParticipant(participant);
                                  setShowDetailsModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                              {participant.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      toggleStatus(participant.id, "approved")
                                    }
                                    className="text-green-600 hover:text-green-900"
                                  >
                                    <Check className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() =>
                                      toggleStatus(participant.id, "rejected")
                                    }
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </>
                              )}
                              {participant.status === "approved" && (
                                <button
                                  onClick={() =>
                                    toggleStatus(participant.id, "rejected")
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              )}
                              {participant.status === "rejected" && (
                                <button
                                  onClick={() =>
                                    toggleStatus(participant.id, "approved")
                                  }
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Check className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Add pagination controls */}
                  <div className="mt-4">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </LoadingOverlay>

        {/* ...existing modal and dialog code... */}
      </div>

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Participant Details"
      >
        {selectedParticipant && (
          <div className="space-y-6">
            {/* Event Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Event Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Event Name
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedParticipant.event_name}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Event Day & Time
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedParticipant.event_day},{" "}
                    {selectedParticipant.event_time}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Location
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedParticipant.event_location}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Team Size
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedParticipant.participant_count} member(s)
                  </p>
                </div>
              </div>
            </div>

            {/* Team Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Team Details
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Team Lead
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedParticipant.team_lead_name}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Team Members
                  </h4>
                  {selectedParticipant.participant_names?.length > 0 ? (
                    <ul className="mt-1 text-sm text-gray-900 dark:text-white list-disc list-inside">
                      {selectedParticipant.participant_names.map(
                        (name: string, index: number) => (
                          <li key={index}>{name}</li>
                        )
                      )}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Solo Participant</p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Email
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedParticipant.email}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    WhatsApp
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedParticipant.whatsapp_number}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    College
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedParticipant.college}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Payment Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Payment Status
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedParticipant.payment_status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedParticipant.payment_status}
                    </span>
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Transaction ID
                  </h4>
                  <p className="mt-1 text-sm text-gray-900 dark:text-white">
                    {selectedParticipant.upi_transaction_id || "N/A"}
                  </p>
                </div>

                {selectedParticipant.payment_screenshot_url && (
                  <div className="col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Payment Screenshot
                    </h4>
                    <img
                      src={selectedParticipant.payment_screenshot_url}
                      alt="Payment Screenshot"
                      className="max-h-48 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Registration Status */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Registration Status
                  </h4>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedParticipant.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : selectedParticipant.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedParticipant.status?.charAt(0).toUpperCase() +
                        selectedParticipant.status?.slice(1)}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Registered on:{" "}
                    {new Date(
                      selectedParticipant.created_at
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <AlertDialog
        isOpen={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
        onConfirm={confirmStatusChange}
        title="Confirm Status Change"
        message={`Are you sure you want to ${pendingAction?.newStatus} this participant? This action cannot be undone.`}
      />

      <RejectionDialog
        isOpen={showRejectionDialog}
        onClose={() => setShowRejectionDialog(false)}
        onConfirm={handleRejectionConfirm}
      />
    </div>
  );
}
