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
  const [isLoggedIn] = React.useState(
    user
      ? true
      : isMe().then((res) => {
          if (res) {
            signIn(res);
            return true;
          } else {
            return false;
          }
        })
  );

  if (!isLoggedIn) {
    console.log("not logged in");
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
