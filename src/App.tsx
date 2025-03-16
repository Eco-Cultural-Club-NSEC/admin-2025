import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { toast } from "sonner";
import { Login } from "./pages/Login"; // Change to named import
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
import { checkAuth } from "./lib/utils";
import { useAuth } from "./lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { EmailDashboard } from "./pages/EmailDashboard";
import { Auth } from "./pages/Auth";

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>
  );
}

function PrivateRoute({ children, requireAdmin = false }: PrivateRouteProps) {
  const { user, checkAuth } = useAuth();

  // Check auth status synchronously
  const isAuthenticated = checkAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      <div className="pt-16">{children}</div>
    </>
  );
}

interface PublicRouteProps {
  children: React.ReactNode;
}

function PublicRoute({ children }: PublicRouteProps) {
  const { checkAuth } = useAuth();

  // Check auth status synchronously
  const isAuthenticated = checkAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <UserProvider>
              <ParticipantsProvider>
                <AppContent />
                <Toaster />
              </ParticipantsProvider>
            </UserProvider>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <Toaster
        position="bottom-right"
        theme={isDark ? "dark" : "light"}
        richColors
      />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <Auth />
              </PublicRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected Routes - All require authentication */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route
            path="/participants"
            element={
              <PrivateRoute>
                <Participants />
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
          <Route
            path="/email"
            element={
              <PrivateRoute>
                <EmailDashboard />
              </PrivateRoute>
            }
          />
          <Route path="/auth" element={<div>Authenticating...</div>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
