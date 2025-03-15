import React, { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { Home, Users, Mail } from "lucide-react";

export function Sidebar() {
  const location = useLocation();

  const navigation = useMemo(
    () => [
      {
        name: "Home",
        href: "/",
        icon: Home,
        current: location.pathname === "/",
      },
      {
        name: "Users",
        href: "/users",
        icon: Users,
        current: location.pathname === "/users",
      },
      {
        name: "Email",
        href: "/email",
        icon: Mail,
        current: location.pathname === "/email",
      },
    ],
    [location.pathname]
  );

  return (
    <nav className="space-y-1">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`${
            item.current
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
        >
          <item.icon
            className={`${
              item.current
                ? "text-gray-500"
                : "text-gray-400 group-hover:text-gray-500"
            } mr-3 flex-shrink-0 h-6 w-6`}
            aria-hidden="true"
          />
          {item.name}
        </Link>
      ))}
    </nav>
  );
}
