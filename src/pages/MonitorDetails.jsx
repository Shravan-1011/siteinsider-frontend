import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


function MonitorDetail() {
    const navigate = useNavigate();
  const { id } = useParams();
  

  const [monitor, setMonitor] = useState(null);
  const [incidents, setIncidents] = useState([]);

  const [statusGraph, setStatusGraph] = useState([]);
  const [responseGraph, setResponseGraph] = useState([]);
  const [uptime, setUptime] = useState(null);
  const [totalChecks, setTotalChecks] = useState(0);
const [limit, setLimit] = useState(50);
const [range, setRange] = useState("24h");
const [now, setNow] = useState(Date.now());
const [selectedRegion, setSelectedRegion] = useState("India");

  


 const fetchData = async () => {
  try {
    const res = await api.get(
      `/monitors/${id}/detail?limit=${limit}&range=${range}&region=${selectedRegion}`
    );
    

    setMonitor(res.data.monitor);
    setStatusGraph(res.data.analytics.statusGraph);
    setResponseGraph(res.data.analytics.responseTimeGraph);
    setUptime(res.data.analytics.uptimePercentage);
    setIncidents(res.data.incidents);
    setTotalChecks(res.data.analytics.totalChecks);
    

  } catch (err) {
    console.log("FETCH ERROR:", err);
  }
};

useEffect(() => {
  fetchData();
}, [id, limit, range, selectedRegion]);
 

useEffect(() => {
  const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""));

  socket.on("statusUpdate", (update) => {
    if (update.monitorId === id) {
      fetchData(); // only refresh this monitor's data
    }
  });

  return () => socket.disconnect();
}, [id, limit, range, selectedRegion]);

useEffect(() => {
  const timer = setInterval(() => {
    setNow(Date.now());
  }, 1000);

  return () => clearInterval(timer);
}, []);



  const avgResponse =
  responseGraph.length > 0
    ? (
        responseGraph.reduce((acc, cur) => acc + cur.value, 0) /
        responseGraph.length
      ).toFixed(0)
    : null;




  


  if (!monitor) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const latestStatus = !monitor.isActive
  ? "PAUSED"
  : statusGraph.length > 0
  ? statusGraph[statusGraph.length - 1].value === 1
    ? "UP"
    : "DOWN"
  : "Checking...";


const statusChartData = statusGraph;



const formatDuration = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
};



const activeIncident = incidents.find(
  (incident) => !incident.isResolved
);

const liveDowntime =
  activeIncident
    ? formatDuration(
        now -
          new Date(activeIncident.startedAt).getTime()
      )
    : null;





  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 px-4 sm:px-8 lg:px-12 py-8">

         {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-8 bg-gray-900 border border-gray-700 px-4 py-2 rounded-xl hover:bg-gray-800 transition text-sm"
      >
        ← Back
      </button>


       {/* Monitor Info */}
      <div className="mb-6">
  <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
    {monitor.name}
  </h1>
  <p className="text-gray-400 mt-2 text-sm sm:text-base">
    {monitor.url}
  </p>
</div>


    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 mb-10">
  {monitor.isActive ? (
    <button
      onClick={async () => {
  await api.patch(`/monitors/${id}/pause`);
  await fetchData();
}}
      className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
    >
      Pause Monitor
    </button>
  ) : (
    <button
      onClick={async () => {
  await api.patch(`/monitors/${id}/resume`);
  await fetchData();
}}

      className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
    >
      Resume Monitor
    </button>
  )}

  <button
    onClick={async () => {
      await api.delete(`/monitors/${id}`);
      navigate("/dashboard");
    }}
    className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
  >
    Delete
  </button>
  <div className="flex flex-wrap gap-2 mt-2">
  {monitor.regions.map((region) => (
    <button
      key={region}
      onClick={() => setSelectedRegion(region)}
      className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
        selectedRegion === region
          ? "bg-blue-600 text-white"
          : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
      }`}
    >
      {region}
    </button>
  ))}
</div>
</div>






       {/* Status + Uptime Card */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 flex justify-between items-center">
        <div>
          <p className="text-gray-400 text-sm">Current Status</p>
          <p
  className={`text-xl font-semibold ${
    latestStatus === "UP"
      ? "text-green-400"
      : latestStatus === "DOWN"
      ? "text-red-400"
      : latestStatus === "PAUSED"
      ? "text-yellow-400"
      : "text-gray-400"
  }`}
>
  {latestStatus}
</p>

{latestStatus === "DOWN" && (
  <div className="flex items-center gap-2 mt-2">
    <span className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
    <span className="text-red-400">
      Down for {liveDowntime}
    </span>
  </div>
)}


        </div>

        <div>
          <p className="text-gray-400 text-sm">Uptime</p>
          <p className="text-xl font-semibold text-blue-400">
            {uptime ? `${uptime}%` : "Calculating..."}
          </p>
        </div>
      </div>

    
      



            {/* Response Time Chart */}
<div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-10">
  <h2 className="text-xl font-semibold mb-4">
    Response Time (ms)
  </h2>

  <div className="bg-gray-800 p-6 rounded h-72 sm:h-80">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={responseGraph}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="time"
          tickFormatter={(time) => {
  const date = new Date(time);
  return `${date.getHours()}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}}
          stroke="#9CA3AF"
        />
        <YAxis stroke="#9CA3AF" />
        <Tooltip
  contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
  labelFormatter={(time) =>
    new Date(time).toLocaleString()
  }
  formatter={(value) => [`${value} ms`, "Response Time"]}
/>
        <Line
          type="monotone"
          dataKey="value"
          stroke="#10B981"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}

        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>





{/* Status History Chart */}
<div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl mb-10">
  <h2 className="text-xl font-semibold mb-4">
    Status History
  </h2>

  <div className="bg-gray-800 p-6 rounded h-72 sm:h-80">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={statusChartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis
          dataKey="time"
          tickFormatter={(time) =>
            new Date(time).toLocaleTimeString()
          }
          stroke="#9CA3AF"
        />
        <YAxis
          domain={[0, 1]}
          ticks={[0, 1]}
          tickFormatter={(v) => (v === 1 ? "UP" : "DOWN")}
          stroke="#9CA3AF"
        />
       <Tooltip
  contentStyle={{ backgroundColor: "#1F2937", border: "none" }}
  labelFormatter={(time) =>
    new Date(time).toLocaleString()
  }
  formatter={(value) =>
    [value === 1 ? "UP" : "DOWN", "Status"]
  }
/>
        <Line
          type="stepAfter"
          dataKey="value"
          stroke="#3B82F6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}

        />
      </LineChart>
    </ResponsiveContainer>
  </div>
</div>




<h2 className="text-2xl font-semibold mt-12 mb-6">
  Incident History
</h2>

{incidents.length === 0 ? (
  <div className="bg-gray-800 p-6 rounded-lg text-gray-400">
    No incidents recorded.
  </div>
) : (
  <div className="space-y-6">
    {incidents.map((incident) => {
      const duration = incident.isResolved
  ? formatDuration(incident.duration)
  : formatDuration(
      now - new Date(incident.startedAt).getTime()
    );


      return (
        <div
          key={incident._id}
          className={`p-6 rounded-2xl border ${
            incident.isResolved
              ? "bg-gray-800"
              : "bg-red-900 border border-red-500"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">
              {incident.isResolved
                ? "Resolved Incident"
                : "Ongoing Incident"}
            </span>

            {!incident.isResolved && (
              <span className="text-red-400 font-medium">
                ACTIVE
              </span>
            )}
          </div>

          <p className="text-gray-400 text-sm">
            Started:{" "}
            {new Date(incident.startedAt).toLocaleString()}
          </p>

          <p className="text-gray-400 text-sm">
            Resolved:{" "}
            {incident.resolvedAt
              ? new Date(
                  incident.resolvedAt
                ).toLocaleString()
              : "Still ongoing"}
          </p>

          {duration && (
            <p className="text-gray-300 mt-2">
              Duration: {duration}
            </p>
          )}

          {incident.reason && (
            <p className="text-gray-400 mt-2 text-sm">
              Reason: {incident.reason}
            </p>
          )}
        </div>
      );
    })}
  </div>
)}



<div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10 pt-5">
  <div className="bg-gray-800 p-6 rounded-lg">
    <p className="text-gray-400 text-sm">Uptime</p>
    <p className="text-2xl font-semibold text-green-400">
      {uptime}%
    </p>
  </div>

  <div className="bg-gray-800 p-6 rounded-lg">
    <p className="text-gray-400 text-sm">Avg Response</p>
    <p className="text-2xl font-semibold text-blue-400">
      {avgResponse ? `${avgResponse} ms` : "-"}
    </p>
  </div>

  <div className="bg-gray-800 p-6 rounded-lg">
    <p className="text-gray-400 text-sm">Total Checks</p>
    <p className="text-2xl font-semibold text-purple-400">
      {totalChecks}
    </p>
  </div>
</div>





<div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-10">


  {/* Filters */}
  <div className="flex gap-4 ">

    {/* Range Selector */}
    <select
      value={range}
      onChange={(e) => setRange(e.target.value)}
      className="bg-gray-800 border border-gray-600 px-4 py-2 rounded-xl w-full sm:w-auto"
    >
      <option value="24h">Last 24 Hours</option>
      <option value="7d">Last 7 Days</option>
      <option value="30d">Last 30 Days</option>
      <option value="all">All Time</option>
    </select>

    {/* Limit Selector */}
    <select
      value={limit}
      onChange={(e) => setLimit(e.target.value)}
      className="bg-gray-800 border border-gray-600 px-4 py-2 rounded"
    >
      <option value={50}>Last 50</option>
      <option value={100}>Last 100</option>
      <option value={200}>Last 200</option>
      <option value="all">All</option>
    </select>

  </div>

</div>





            {/* Recent Status Checks */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">
          Recent Checks
        </h2>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {statusGraph.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:justify-between bg-gray-800 p-3 rounded-lg"
            >
              <span>
                {new Date(item.time).toLocaleString()}
              </span>

              <span
                className={
                  item.value === "UP"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
}

export default MonitorDetail;
