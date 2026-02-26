
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-7xl font-bold">404</h1>
      <p className="text-gray-400 mt-4 text-lg">
        Page not found
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition"
      >
        Go Home
      </Link>
    </div>
  );
}