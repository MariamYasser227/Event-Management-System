import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import DesktopLayout from "./components/DesktopLayout";
import LandingPage from "./pages/LandingPage";
import UserHomePage from "./pages/UserHomePage";
import EventDetailsPage from "./pages/EventDetailsPage";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";
import EventDiscoveryPage from "./pages/EventDiscoveryPage";
import ManageEventPage from "./pages/ManageEventPage";
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminRequestsPage from "./pages/AdminRequestsPage";

const ProtectedRoute = ({ allowedRoles, currentRole }) => {
  if (!currentRole) return <Navigate to="/landing" replace />;
  if (!allowedRoles.includes(currentRole)) {
    if (currentRole === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (currentRole === "user") return <Navigate to="/discover" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};

function LayoutWrapper({ role, setRole, user }) {
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === "admin") navigate("/admin/dashboard");
    else if (newRole === "user") navigate("/discover");
    else navigate("/dashboard");
  };

  return (
    <DesktopLayout role={role} onRoleChange={handleRoleChange} user={user}>
      <Outlet context={{ role }} />
    </DesktopLayout>
  );
}

export default function App() {
  const [role, setRole] = useState("organizer");
  const user = { name: "Mariam Yasser", org: "EventLogix Global" };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />

        <Route
          element={<LayoutWrapper role={role} setRole={setRole} user={user} />}
        >
          <Route path="/event/:id" element={<EventDetailsPage />} />

          <Route
            element={
              <ProtectedRoute allowedRoles={["organizer"]} currentRole={role} />
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<OrganizerDashboardPage />} />
            <Route path="/events" element={<EventDiscoveryPage />} />
            <Route path="/manage-event" element={<ManageEventPage />} />
            <Route path="/requests" element={<AdminRequestsPage />} />
            <Route path="/venues" element={<EventDiscoveryPage />} />
            <Route path="/reports" element={<OrganizerDashboardPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["admin"]} currentRole={role} />
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/events" element={<EventDiscoveryPage />} />
            <Route path="/admin/requests" element={<AdminRequestsPage />} />
            <Route path="/admin/users" element={<AdminDashboardPage />} />
            <Route path="/admin/reports" element={<OrganizerDashboardPage />} />
            <Route path="/admin/settings" element={<AdminDashboardPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={["user"]} currentRole={role} />
            }
          >
            <Route path="/home" element={<UserHomePage />} />
            <Route path="/discover" element={<EventDiscoveryPage />} />
            <Route path="/my-tickets" element={<MyRegistrationsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
