import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const navigate = useNavigate();
  const [monitors, setMonitors] = useState([]);
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [regions, setRegions] = useState(["India"]);
  const [copied, setCopied] = useState(false);



  const publicId = localStorage.getItem("publicId");

const statusUrl = `${window.location.origin}/status/${publicId}`;

  const fetchMonitors = async () => {
  try {
    const res = await api.get("/monitors/with-regions");
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
      
      await api.post("/monitors", { name, url, regions});
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

  const handleRegionChange = (region) => {
  if (regions.includes(region)) {
    setRegions(regions.filter(r => r !== region));
  } else {
    setRegions([...regions, region]);
  }
};

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 sm:px-8 lg:px-12 py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
  <div>
    <h1 className="text-4xl font-bold tracking-tight">
      SiteInsider
    </h1>
    <p className="text-gray-400 mt-1 text-sm">
      Multi-region uptime monitoring
    </p>
  </div>

  <button
    onClick={handleLogout}
    className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm font-medium"
  >
    Logout
  </button>
</div>

<div className="mt-10 mb-5 p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
  <h2 className="text-lg font-semibold mb-4">🌍 Public Status Page</h2>

  <div className="flex items-center justify-between gap-4">
    <input
      value={statusUrl}
      readOnly
      className="flex-1 bg-black/40 text-sm px-4 py-2 rounded-lg border border-white/10"
    />

    <button
  onClick={() => {
    navigator.clipboard.writeText(statusUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }}
>
  {copied ? "Copied ✓" : "Copy"}
</button>
  </div>
</div>

      {/* Add Monitor Form */}
      <form
        onSubmit={handleAdd}
        className="bg-gray-800 border border-gray-800 shadow-lg p-6 sm:p-8 rounded-2xl mb-10 space-y-5"
      >
        <input
          type="text"
          placeholder="Monitor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div>
  <p className="font-semibold mb-2">Select Regions</p>

  {["India", "New York", "Tokyo"].map(region => (
    <label key={region} className="block">
      <input
        type="checkbox"
        checked={regions.includes(region)}
        onChange={() => handleRegionChange(region)}
      />
      {region}
    </label>
  ))}
</div>

        <button className="bg-green-600 hover:bg-green-700 transition w-full sm:w-auto px-4 py-3 rounded-xl font-medium">
          Add Monitor
        </button>
      </form>

      {/* Monitor List */}
     <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 active:scale-[0.98]">
  {monitors.map((monitor) => (
    <div
  key={monitor._id}
  onClick={() => navigate(`/monitor/${monitor._id}`)}
  className="bg-gray-900 border border-gray-800 hover:border-gray-700 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 p-6 rounded-2xl cursor-pointer"
>
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
    <div>
      <h2 className="text-lg font-semibold">
        {monitor.name}
      </h2>
      <p className="text-sm text-gray-400 mt-1">
        {monitor.url}
      </p>
    </div>

    <span
      className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
        monitor.status === "UP"
          ? "bg-green-600/20 text-green-400"
          : "bg-red-600/20 text-red-400"
      }`}
    >
      {monitor.status}
    </span>
  </div>

  {/* Region Breakdown */}
  <div className="mt-4 pt-4 border-t border-gray-800 space-y-2 text-sm">
    {monitor.regionStatuses?.map((region) => (
      <div
        key={region.region}
        className="flex justify-between items-center text-sm sm:text-base"
      >
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              region.status === "UP"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />
          <span className="text-gray-300">
            {region.region}
          </span>
        </div>

        {region.status === "UP" ? (
          <span className="text-gray-400">
            {region.responseTime}ms
          </span>
        ) : (
          <span className="text-red-400 text-xs font-medium">
            DOWN
          </span>
        )}
      </div>
    ))}
  </div>
</div>
  ))}
</div>

    </div>
  );
}

export default Dashboard;
