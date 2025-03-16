import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";
import { VerificationForm } from "../components/VerificationForm";
import { FcGoogle } from "react-icons/fc"; // Add this import for Google icon
import { getAdminUrl } from "../lib/utils";

export function Login() {
  const { signIn, checkAuth } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [needsVerification, setNeedsVerification] = React.useState(false);
  const [userId, setUserId] = React.useState<string | null>(null);
  const navigate = useNavigate();

  if (checkAuth()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const adminUrl = getAdminUrl();
      const response = await authService.getGoogleAuthUrl(adminUrl);

      if (response.success && response.url) {
        window.location.href = response.url;
      } else {
        toast.error(response.message || "Failed to initialize Google login");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "An unexpected error occurred");
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = (user: any) => {
    signIn(user);
    navigate("/dashboard");
  };

  if (needsVerification && userId) {
    return (
      <VerificationForm userId={userId} onSuccess={handleVerificationSuccess} />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in with your Google account to access the admin dashboard
          </p>
        </div>

        <div className="mt-8">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FcGoogle className="text-xl" />
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>

        {error && (
          <div className="mt-3 text-sm text-center text-red-500">{error}</div>
        )}
      </div>
    </div>
  );
}
