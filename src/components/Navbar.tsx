import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  LogOut,
  Mail,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../lib/auth";
import { useTheme } from "../lib/context/ThemeContext";
import { cn } from "../lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { authService } from "../services/auth.service";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await authService.logout();
      signOut();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <LayoutDashboard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLink to="/" active={isActive("/")}>
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/users" active={isActive("/users")}>
                <Users className="h-5 w-5" />
                <span>Users</span>
              </NavLink>
              <NavLink to="/participants" active={isActive("/participants")}>
                <UserCheck className="h-5 w-5" />
                <span>Participants</span>
              </NavLink>
              <NavLink
                to="/email-templates"
                active={isActive("/email-templates")}
              >
                <Mail className="h-5 w-5" />
                <span>Email Templates</span>
              </NavLink>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            {user && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <MobileNavLink to="/" active={isActive("/")}>
              <LayoutDashboard className="h-5 w-5 mr-2" />
              Dashboard
            </MobileNavLink>
            <MobileNavLink to="/users" active={isActive("/users")}>
              <Users className="h-5 w-5 mr-2" />
              Users
            </MobileNavLink>
            <MobileNavLink
              to="/participants"
              active={isActive("/participants")}
            >
              <UserCheck className="h-5 w-5 mr-2" />
              Participants
            </MobileNavLink>
            <MobileNavLink
              to="/email-templates"
              active={isActive("/email-templates")}
            >
              <Mail className="h-5 w-5 mr-2" />
              Email Templates
            </MobileNavLink>
            {user && (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({
  children,
  to,
  active,
}: {
  children: React.ReactNode;
  to: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center space-x-2 px-1 pt-1 text-sm font-medium",
        active
          ? "text-indigo-600 dark:text-indigo-400"
          : "text-gray-900 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  children,
  to,
  active,
}: {
  children: React.ReactNode;
  to: string;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center px-3 py-2 text-base font-medium",
        active
          ? "text-indigo-600 dark:text-indigo-400"
          : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
      )}
    >
      {children}
    </Link>
  );
}
