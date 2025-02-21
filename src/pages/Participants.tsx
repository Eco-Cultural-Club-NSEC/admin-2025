import React from "react";
import { participants } from "../lib/dummy-data";
import { Check, X, Download, Eye, Search, Filter } from "lucide-react";
import { Modal } from "../components/Modal";
import { AlertDialog } from "../components/AlertDialog";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useParticipants } from "../lib/context/ParticipantsContext";

export function Participants() {
  const { participants, setParticipants, updateStatus } = useParticipants();

  const [selectedEvent, setSelectedEvent] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedParticipant, setSelectedParticipant] =
    React.useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<{
    participantId: number;
    newStatus: "approved" | "rejected";
  } | null>(null);

  const events = Array.from(new Set(participants.map((p) => p.event)));

  const filteredParticipants = participants.filter((participant) => {
    const matchesEvent =
      selectedEvent === "all" || participant.event === selectedEvent;
    const matchesStatus =
      statusFilter === "all" || participant.status === statusFilter;
    const matchesSearch =
      participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEvent && matchesStatus && matchesSearch;
  });

  const toggleStatus = async (
    participantId: number,
    newStatus: "approved" | "rejected"
  ) => {
    setPendingAction({ participantId, newStatus });
    setShowAlertDialog(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingAction) return;
    updateStatus(pendingAction.participantId, pendingAction.newStatus);
    setPendingAction(null);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredParticipants);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
    XLSX.writeFile(workbook, "participants.xlsx");
    toast.success("Excel file downloaded successfully");
  };

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

          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          >
            <option value="all">All Events</option>
            {events.map((event) => (
              <option key={event} value={event}>
                {event}
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
                        Amount Paid
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold"
                      >
                        Transaction ID
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
                    {filteredParticipants.map((participant) => (
                      <tr key={participant.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                          {participant.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {participant.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {participant.phone}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {participant.event}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {participant.amount_paid}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {participant.transaction_id}
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
                          {new Date(participant.created_at).toDateString()}
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Participant Details"
      >
        {selectedParticipant && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Name
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedParticipant.name}
                </p>
              </div>
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
                  Event
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedParticipant.event}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedParticipant.status}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Registration Date
                </h4>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {new Date(
                    selectedParticipant.registeredAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2 dark:text-gray-400">
                Transaction Screenshot
              </h4>
              <img
                src="https://images.unsplash.com/photo-1626266061368-46a8f578ddd6?w=800"
                alt="Transaction Screenshot"
                className="w-full rounded-lg"
              />
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
    </div>
  );
}
