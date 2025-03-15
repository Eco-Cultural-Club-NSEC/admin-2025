import React from "react";
import { REJECTION_REASONS, RejectionReason } from "../types/participant";

interface RejectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title?: string;
}

export function RejectionDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Rejection",
}: RejectionDialogProps) {
  const [selectedReason, setSelectedReason] = React.useState<RejectionReason>(
    "PAYMENT_NOT_APPROVED"
  );
  const [customReason, setCustomReason] = React.useState("");
  const [showCustom, setShowCustom] = React.useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const reason = showCustom
      ? customReason
      : REJECTION_REASONS[selectedReason];
    onConfirm(reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-lg w-full max-w-md mx-4 p-6 dark:bg-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Rejection Reason
            </label>
            <select
              value={showCustom ? "OTHER" : selectedReason}
              onChange={(e) => {
                if (e.target.value === "OTHER") {
                  setShowCustom(true);
                } else {
                  setShowCustom(false);
                  setSelectedReason(e.target.value as RejectionReason);
                }
              }}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
            >
              {Object.entries(REJECTION_REASONS).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {showCustom && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Reason
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                rows={3}
                placeholder="Enter custom rejection reason..."
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
}
