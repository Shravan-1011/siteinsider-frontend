import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [monitors, setMonitors] = useState([]);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");

  const fetchMonitors = async () => {
    try {
      const res = await api.get("/monitors");
      setMonitors(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMonitors();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      await api.post("/monitors", { name, url });
      setName("");
      setUrl("");
      fetchMonitors();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">SiteInsider Dashboard</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Add Monitor Form */}
      <form
        onSubmit={handleAdd}
        className="bg-gray-800 p-6 rounded-lg mb-8 space-y-4"
      >
        <input
          type="text"
          placeholder="Monitor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded"
        />

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded"
        />

        <button className="bg-green-500 px-4 py-2 rounded">
          Add Monitor
        </button>
      </form>

      {/* Monitor List */}
     <div className="grid gap-4">
  {monitors.map((monitor) => (
    <div
      key={monitor._id}
      onClick={() => navigate(`/monitor/${monitor._id}`)}
      className="bg-gray-800 p-4 rounded-lg flex justify-between items-center hover:bg-gray-700 transition cursor-pointer"
    >
      <div>
        <h2 className="font-semibold text-lg">
          {monitor.name}
        </h2>
        <p className="text-sm text-gray-400">
          {monitor.url}
        </p>
      </div>

      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          monitor.status === "UP"
            ? "bg-green-600"
            : "bg-red-600"
        }`}
      >
        {monitor.status || "Checking..."}
      </span>
    </div>
  ))}
</div>

    </div>
  );
}

export default Dashboard;
