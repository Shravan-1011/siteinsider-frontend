import {Routes, Route}  from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import MonitorDetails from "./pages/MonitorDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/monitor/:id" element={<ProtectedRoute><MonitorDetails /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;