import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner"; // Changed from react-toastify to sonner
import { getAdminUrl } from "./utils";

const AuthContext = createContext(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Add this to access location

  // Check for existing user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user data:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Add pathname check to useEffect
  useEffect(() => {
    if (location.pathname === "/auth") {
      const searchParams = new URLSearchParams(window.location.search);
      handleAuthCallback(searchParams);
    }
  }, [location.pathname, location.search]);

  const signIn = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
  };

  const checkAuth = () => {
    return !!user;
  };

  // Update handleAuthCallback to be more robust
  const handleAuthCallback = (params: URLSearchParams) => {
    const userParam = params.get("user");
    const errorParam = params.get("error");
    const adminUrl = getAdminUrl();

    if (errorParam) {
      toast.error(decodeURIComponent(errorParam));
      navigate("/login");
      return;
    }

    if (userParam) {
      try {
        const decodedUser = JSON.parse(atob(userParam));
        signIn(decodedUser);
        // Add a small delay to ensure state is updated
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 100);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        toast.error("Authentication failed");
        navigate("/login");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
