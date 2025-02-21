import React from "react";
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
import { Toaster } from "sonner";
import { ParticipantsProvider } from "./lib/context/ParticipantsContext";
import { UserProvider } from "./lib/context/UserContext";
import { isMe } from "./lib/utils";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  if (!isMe()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-16">{children}</div>
    </>
  );
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
                <UserProvider>
                  <Users />
                </UserProvider>
              </PrivateRoute>
            }
          />
          <Route
            path="/participants"
            element={
              <PrivateRoute>
                <ParticipantsProvider>
                  <Participants />
                </ParticipantsProvider>
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
