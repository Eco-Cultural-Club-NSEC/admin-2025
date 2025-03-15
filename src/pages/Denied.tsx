import { Link } from "react-router-dom";

export const Denied = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4 dark:text-white">Access Denied</h1>
      <p className="text-lg text-gray-600">
        You do not have permission to access this page.
      </p>
      <Link to="/" className="mt-4 text-blue-500 hover:underline">
        Go back to the homepage
      </Link>
    </div>
  );
};
