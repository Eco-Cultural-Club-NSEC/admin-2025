import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner"; // Changed from react-toastify to sonner

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
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

  // Check for auth callback parameters when on the /auth route
  useEffect(() => {
    if (location.pathname === "/auth") {
      const params = new URLSearchParams(location.search);
      handleAuthCallback(params);
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

  // Add function to handle auth callback
  const handleAuthCallback = (params) => {
    const userParam = params.get("user");
    const errorParam = params.get("error");

    if (errorParam) {
      toast.error(decodeURIComponent(errorParam));
      navigate("/login");
      return;
    }

    if (userParam) {
      try {
        const decodedUser = JSON.parse(atob(userParam));
        signIn(decodedUser);
        navigate("/dashboard");
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
};

export const useAuth = () => useContext(AuthContext);
