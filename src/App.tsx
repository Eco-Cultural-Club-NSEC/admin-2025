import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Users } from "./pages/Users";
import { Participants } from "./pages/Participants";
import { Dashboard } from "./pages/Dashboard";
import { Sucess } from "./pages/Sucess";
import { EmailTemplates } from "./pages/EmailTemplates";
import { Navbar } from "./components/Navbar";
import { ThemeProvider } from "./lib/context/ThemeContext";
import { useTheme } from "./lib/context/ThemeContext";
import { toast, Toaster } from "sonner";
import { ParticipantsProvider } from "./lib/context/ParticipantsContext";
import { UserProvider } from "./lib/context/UserContext";
import { isMe } from "./lib/utils";
import { useAuth } from "./lib/auth";
import { Denied } from "./pages/Denied";
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useAuth((state) => state.user);
  const signIn = useAuth((state) => state.signIn);
  const [isLoading, setIsLoading] = React.useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      console.log("Starting auth check. Current user state:", user);
      
      if (!user) {
        try {
          console.log("No user in state, checking with backend...");
          const userData = await isMe();
          console.log("Backend response:", userData);
          
          if (userData) {
            console.log("Valid user data received, signing in:", userData);
            signIn(userData);
            setIsLoading(false);
          } else {
            console.log("No valid user data from backend");
            setIsLoading(false);
          }
        } catch (error) {
          console.error("Authentication check failed:", error);
          setIsLoading(false);
        }
      } else {
        console.log("User already in state:", user);
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);  // Remove dependencies to ensure it only runs once on mount

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }
  
  // Access the latest user state
  const currentUser = useAuth.getState().user;
  
  if (!currentUser) {
    console.log("Not logged in, redirecting...");
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-16">{children}</div>
    </>
  );
}


//Admin route
function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuth((state) => state.user);
  // if (!user?.admin) {
  //   toast.info("Admin access required to access this page!");
  //   return <Navigate to="/acess-denied" replace />;
  // }
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { isDark } = useTheme();

  return (
    <BrowserRouter>
      <Toaster position="top-right" theme={isDark ? "dark" : "light"} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ParticipantsProvider>
                  <Dashboard />
                </ParticipantsProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <UserProvider>
                    <Users />
                  </UserProvider>
                </AdminRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/participants"
            element={
              <PrivateRoute>
                <AdminRoute>
                  <ParticipantsProvider>
                    <Participants />
                  </ParticipantsProvider>
                </AdminRoute>
              </PrivateRoute>
            }
          />
          <Route
            path="/email-templates"
            element={
              <PrivateRoute>
                <EmailTemplates />
              </PrivateRoute>
            }
          />
          <Route path="/sucess" element={<Sucess />} />
          <Route path="/acess-denied" element={<Denied />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
