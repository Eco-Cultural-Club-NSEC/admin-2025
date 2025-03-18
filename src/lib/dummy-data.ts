export const users = [
  {
    id: "1",
    email: "john.doe@example.com",
    name: "John Doe",
    isAdmin: true,
    createdAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "2",
    email: "jane.smith@example.com",
    name: "Jane Smith",
    isAdmin: false,
    createdAt: "2024-02-16T11:30:00Z",
  },
  {
    id: "3",
    email: "bob.wilson@example.com",
    name: "Bob Wilson",
    isAdmin: false,
    createdAt: "2024-02-17T09:15:00Z",
  },
];

export const participants = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.j@example.com",
    event: "Tech Conference 2024",
    status: "pending",
    registeredAt: "2024-02-10T08:00:00Z",
  },
  {
    id: "2",
    name: "Mike Brown",
    email: "mike.b@example.com",
    event: "Tech Conference 2024",
    status: "approved",
    registeredAt: "2024-02-11T10:30:00Z",
  },
  {
    id: "3",
    name: "Sarah Davis",
    email: "sarah.d@example.com",
    event: "Tech Conference 2024",
    status: "rejected",
    registeredAt: "2024-02-12T14:45:00Z",
  },
];

export const apiUri =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001/api/v1"
    : "https://api.mesmerizernsec.club/api/v1";
