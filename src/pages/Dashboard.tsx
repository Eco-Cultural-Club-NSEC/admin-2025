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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

export function Dashboard() {
  const { participants, setParticipants } = useParticipants();  

  const stats = {
    total: participants.length,
    approved: participants.filter((p) => p.status === "approved").length,
    rejected: participants.filter((p) => p.status === "rejected").length,
    pending: participants.filter((p) => p.status === "pending").length,
  };

  const statusData = [
    { name: "Approved", value: stats.approved },
    { name: "Rejected", value: stats.rejected },
    { name: "Pending", value: stats.pending },
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8 dark:text-white">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-400">
            Total Registrations
          </h3>
          <p className="mt-2 text-3xl font-bold text-indigo-600">
            {stats.total}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-400">Approved</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {stats.approved}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-400">Pending</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">
            {stats.pending}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-400">
            Registration Status
          </h3>
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
        </div>

        <div className="bg-white p-6 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-gray-400">
            Registrations by Event
          </h3>
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
        </div>
      </div>
    </div>
  );
}
