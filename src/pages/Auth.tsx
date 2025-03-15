import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";

export function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    const userParam = searchParams.get("user");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      toast.error(decodeURIComponent(errorParam));
      setTimeout(() => navigate("/login"), 1000);
      return;
    }

    if (userParam) {
      try {
        const userData = JSON.parse(atob(userParam));

        // Check if user has admin privileges
        if (!userData.is_admin) {
          toast.error("You do not have admin privileges");
          setTimeout(() => navigate("/login"), 1000);
          return;
        }

        signIn(userData);
        toast.success("Logged in successfully");
        navigate("/dashboard");
      } catch (error) {
        console.error("Failed to parse user data:", error);
        toast.error("Authentication failed");
        setTimeout(() => navigate("/login"), 1000);
      }
    } else {
      // No parameters, redirect to login
      navigate("/login");
    }
  }, [searchParams, navigate, signIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Processing authentication...
        </p>
      </div>
    </div>
  );
}
