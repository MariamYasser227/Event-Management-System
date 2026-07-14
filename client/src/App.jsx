import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import DesktopLayout from "./components/DesktopLayout";
import LandingPage from "./pages/LandingPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import UserHomePage from "./pages/UserHomePage";
import EventDetailsPage from "./pages/EventDetailsPage";
import MyRegistrationsPage from "./pages/MyRegistrationsPage";
import EventDiscoveryPage from "./pages/EventDiscoveryPage";
import ManageEventPage from "./pages/ManageEventPage";
import OrganizerDashboardPage from "./pages/OrganizerDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminRequestsPage from "./pages/AdminRequestsPage";
import DevPageSwitcher from "./components/DevPageSwitcher";
import { AppProvider, useAppContext } from "./context/AppContext";

// ── Protected route ────────────────────────────────────────────────────────────
function ProtectedRoute({ allowedRoles }) {
  const { role } = useAppContext();
  const context = useOutletContext();
  if (!role) return <Navigate to="/signin" replace />;
  if (!allowedRoles.includes(role)) {
    if (role === "admin")     return <Navigate to="/admin/dashboard" replace />;
    if (role === "user")      return <Navigate to="/discover"        replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet context={context} />;
}

// ── Layout wrapper ─────────────────────────────────────────────────────────────
function LayoutWrapper() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, role } = useAppContext();

  const handleRoleChange = (newRole) => {
    // Find first account of that role and switch to it
    // (used by TopBar's quick role switcher button)
    if (newRole === "admin")     navigate("/admin/dashboard");
    else if (newRole === "user") navigate("/discover");
    else                         navigate("/dashboard");
  };

  return (
    <DesktopLayout role={role} onRoleChange={handleRoleChange} user={currentUser}>
      <Outlet />
    </DesktopLayout>
  );
}

// ── App root ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

// Separate component so hooks can access AppContext that AppProvider creates
function AppRoutes() {
  const { currentUser, setCurrentUser, role } = useAppContext();

  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/signin"  element={<SignInPage  />} />
        <Route path="/signup"  element={<SignUpPage  />} />

        {/* ── Authenticated layout ── */}
        <Route element={<LayoutWrapper />}>
          {/* Accessible by any authenticated role */}
          <Route path="/event/:id" element={<EventDetailsPage />} />

          {/* Organizer-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["organizer"]} />}>
            <Route path="/"              element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"     element={<OrganizerDashboardPage />} />
            <Route path="/events"        element={<EventDiscoveryPage />} />
            <Route path="/manage-event"  element={<ManageEventPage />} />
            <Route path="/requests"      element={<AdminRequestsPage />} />
            <Route path="/venues"        element={<EventDiscoveryPage />} />
            <Route path="/reports"       element={<OrganizerDashboardPage />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/events"    element={<EventDiscoveryPage />} />
            <Route path="/admin/requests"  element={<AdminRequestsPage />} />
            <Route path="/admin/users"     element={<AdminDashboardPage />} />
            <Route path="/admin/reports"   element={<OrganizerDashboardPage />} />
            <Route path="/admin/settings"  element={<AdminDashboardPage />} />
          </Route>

          {/* User/attendee-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
            <Route path="/home"       element={<UserHomePage />} />
            <Route path="/discover"   element={<EventDiscoveryPage />} />
            <Route path="/my-tickets" element={<MyRegistrationsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>

      {/* Global dev navigation (outside routes so it's always mounted) */}
      <DevPageSwitcher />
    </BrowserRouter>
  );
}
