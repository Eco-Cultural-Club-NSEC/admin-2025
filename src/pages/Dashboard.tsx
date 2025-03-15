import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { participants } from "../lib/dummy-data";
import { useParticipants } from "../lib/context/ParticipantsContext";
import React from "react";
import { Users, Mail, UserCheck } from "lucide-react";
import { useAuth } from "../lib/auth";
import { useUser } from "../lib/context/UserContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export function Dashboard() {
  const { participants, loading: participantsLoading } = useParticipants();
  const { users, loading: usersLoading } = useUser();
  const { user } = useAuth();

  console.log("Dashboard render:", {
    participantsLoading,
    usersLoading,
    participantsCount: participants?.length,
    participantsData: participants,
  });

  // Only show loading for initial data fetch
  const isInitialLoading =
    (participantsLoading && !participants?.length) ||
    (usersLoading && !users?.length);

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-300">
          Loading dashboard data...
        </span>
      </div>
    );
  }

  if (!participants || !users) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 flex items-center">
          <span className="mr-2">⚠️</span>
          No data available. Please check your connection.
        </div>
      </div>
    );
  }

  const stats = [
    {
      name: "Total Users",
      value: users.length,
      icon: Users,
      description: "Total registered users",
    },
    {
      name: "Participants",
      value: participants?.length || 0,
      icon: UserCheck,
      description: "Registered participants",
    },
    {
      name: "Email Templates",
      value: "3",
      icon: Mail,
      description: "Active templates",
    },
  ];

  const statsData = {
    total: participants.length,
    approved: participants.filter((p) => p.status === "approved").length,
    rejected: participants.filter((p) => p.status === "rejected").length,
    pending: participants.filter((p) => p.status === "pending").length,
  };

  const statusData = [
    { name: "Approved", value: statsData.approved },
    { name: "Rejected", value: statsData.rejected },
    { name: "Pending", value: statsData.pending },
  ];

  const eventData = participants.reduce((acc: any[], participant: any) => {
    const event = acc.find((e) => e.event === participant.event);
    if (event) {
      event.count++;
    } else {
      acc.push({ event: participant.event, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow relative"
          >
            {usersLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
              </div>
            )}
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
                {React.createElement(stat.icon, {
                  className: "w-6 h-6 text-indigo-600 dark:text-indigo-300",
                })}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-400">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {["Total", "Approved", "Pending"].map((title) => (
          <div
            key={title}
            className="bg-white p-6 rounded-lg shadow dark:bg-gray-800 relative"
          >
            {participantsLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
              </div>
            )}
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-400">
              {title}
            </h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">
              {statsData[title.toLowerCase()]}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {["Registration Status", "Registrations by Event"].map((title) => (
          <div
            key={title}
            className="bg-white p-6 rounded-lg shadow dark:bg-gray-800 relative"
          >
            {participantsLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
              </div>
            )}
            <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-400">
              {title}
            </h3>
            {title === "Registration Status" ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eventData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="event" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
