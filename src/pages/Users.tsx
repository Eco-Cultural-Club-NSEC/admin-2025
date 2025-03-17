import React from "react";
import { Shield, ShieldOff, Trash } from "lucide-react";
import { AlertDialog } from "../components/AlertDialog";
import { useUser } from "../lib/context/UserContext";
import { toast } from "sonner";

const defaultModalData = {
  title: "",
  message: "",
  onConfirm: "",
};

export function Users() {
  const { users, updateStatus, deleteUser, loading } = useUser();
  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<any | null>(null);

  const [processingUserId, setProcessingUserId] = React.useState<number | null>(
    null
  );
  const [modalData, setModalData] = React.useState<{
    title: string;
    message: string;
    onConfirm: string;
  }>(defaultModalData);

  const handleToggleClick = (userId: number, isAdmin: boolean) => {
    setPendingAction({ userId, isAdmin });
    setModalData({
      title: isAdmin ? "Deactivate User" : "Activate User",
      message: isAdmin
        ? "Are you sure you want to deactivate this user?"
        : "Are you sure you want to activate this user?",
      onConfirm: "handleConfirmToggle",
    });
    setShowAlertDialog(true);
  };

  const handleConfirmToggle = () => {
    if (!pendingAction) return;
    setProcessingUserId(pendingAction.userId);
    try {
      updateStatus(pendingAction.userId);
    } catch (error) {
      console.error("Error updating user status:", error);
    } finally {
      setProcessingUserId(null);
      setPendingAction(null);
      setModalData(defaultModalData);
    }
  };

  const handleDeleteClick = (userId: number) => {
    setPendingAction({ userId });
    setModalData({
      title: "Delete User",
      message: "Are you sure you want to delete this user?",
      onConfirm: "handleConfirmDelete",
    });
    setShowAlertDialog(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingAction) return;
    setProcessingUserId(pendingAction.userId);
    try {
      deleteUser(pendingAction.userId);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setProcessingUserId(null);
      setPendingAction(null);
      setModalData(defaultModalData);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            A list of all users in the system including their name, email, and
            admin status.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Created At
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Admin Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                        {user.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.created_at).toDateString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {user.admin ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                            User
                          </span>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        {/* Admin Status Button */}
                        {processingUserId === user.id ? (
                          <span className="animate-spin inline-block w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full"></span>
                        ) : (
                          <>
                            {/* toggle button */}
                            <button
                              onClick={() =>
                                handleToggleClick(user.id, user.admin)
                              }
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            >
                              {user.admin ? (
                                <ShieldOff className="h-5 w-5" />
                              ) : (
                                <Shield className="h-5 w-5" />
                              )}
                              <span className="sr-only">
                                Toggle admin status
                              </span>
                            </button>
                            {/* delete user button */}
                            <button
                              onClick={() => handleDeleteClick(user.id)}
                              className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash className="h-5 w-5" />
                              <span className="sr-only">Delete user</span>
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* loader */}
      {loading && (
        <div className="flex flex-col items-center py-8 space-y-4">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          <span className="text-gray-600 dark:text-gray-300">
            Loading participants...
          </span>
        </div>
      )}

      <AlertDialog
        isOpen={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
        onConfirm={
          modalData.onConfirm === "handleConfirmToggle"
            ? handleConfirmToggle
            : handleConfirmDelete
        }
        title={modalData.title}
        message={modalData.message}
      />
    </div>
  );
}
