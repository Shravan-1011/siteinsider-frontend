import {Routes, Route}  from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoutes";
import MonitorDetails from "./pages/MonitorDetails";
import Landing from "./pages/Landingpage";
import NotFound from "./components/404notfound";
import PublicStatus from "./pages/PublicStatus";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/monitor/:id" element={<ProtectedRoute><MonitorDetails /></ProtectedRoute>} />
      <Route path="/status/:publicId" element={<PublicStatus />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;