import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

function PublicStatus() {
  const { publicId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
  const fetchInitialData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/status/${publicId}`
      );
      setData(res.data);
      setError(false);
    } catch {
      setError(true);
    }
  };

  // 1️⃣ Fetch initial state once
  fetchInitialData();

  // 2️⃣ Connect to WebSocket server
  const socket = io(
    import.meta.env.VITE_API_URL.replace("/api", "")
  );

  // 3️⃣ Listen for real-time updates
  socket.on("statusUpdate", (update) => {
    setData((prev) => {
      if (!prev) return prev;

      const updatedMonitors = prev.monitors.map((m) =>
        m._id === update.monitorId
          ? {
              ...m,
              status: update.status,
              updatedAt: update.updatedAt,
            }
          : m
      );

      return { ...prev, monitors: updatedMonitors };
    });
  });

  // 4️⃣ Cleanup on unmount
  return () => {
    socket.disconnect();
  };
}, [publicId]);

  if (error)
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 px-4 sm:px-8 lg:px-12 py-8">
        Status page not found
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading status...
      </div>
    );

  const allUp = data.monitors.every((m) => m.status === "UP");

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            {data.projectName}
          </h1>

          <div
            className={`mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-semibold backdrop-blur-md border ${
              allUp
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full ${
                allUp ? "bg-green-400 animate-pulse" : "bg-red-400 animate-pulse"
              }`}
            />
            {allUp ? "All Systems Operational" : "Partial System Outage"}
          </div>

          <p className="mt-4 text-gray-400 text-sm">
  Live updates enabled
</p>
        </div>

        {/* Monitor List */}
        <div className="space-y-5">
          {data.monitors.map((monitor) => (
            <div
              key={monitor._id}
              className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 flex justify-between items-center transition hover:bg-white/10"
            >
              <div>
                <p className="font-semibold text-lg">{monitor.name}</p>
                <p className="text-sm text-gray-400">{monitor.url}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Last checked:{" "}
                  {new Date(monitor.updatedAt).toLocaleString()}
                </p>
              </div>

              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  monitor.status === "UP"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {monitor.status}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          Powered by <span className="text-white font-semibold">SiteInsider</span>
        </div>
      </div>
    </div>
  );
}

export default PublicStatus;