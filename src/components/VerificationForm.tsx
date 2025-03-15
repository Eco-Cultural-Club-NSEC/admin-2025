import React from "react";
import { toast } from "sonner";
import { authService } from "../services/auth.service";

interface Props {
  userId: string;
  onSuccess: (user: any) => void;
}

export function VerificationForm({ userId, onSuccess }: Props) {
  const [otp, setOtp] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.verifyOTP(userId, otp);
      if (response.success) {
        toast.success("Verification successful");
        onSuccess(response.user);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Verify Your Email
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Please enter the verification code sent to your email
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          maxLength={6}
          className="w-full px-4 py-2 border rounded-md mb-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter 6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
