import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserHomePage from './pages/UserHomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import MyRegistrationsPage from './pages/MyRegistrationsPage';
import EventDiscoveryPage from './pages/EventDiscoveryPage';
import ManageEventPage from './pages/ManageEventPage';
import OrganizerDashboardPage from './pages/OrganizerDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRequestsPage from './pages/AdminRequestsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/landing" element={<LandingPage />} />

        {/* App pages — all use single responsive AppLayout */}
        <Route path="/" element={<OrganizerDashboardPage />} />
        <Route path="/home" element={<UserHomePage />} />
        <Route path="/events" element={<EventDiscoveryPage />} />
        <Route path="/event/:id" element={<EventDetailsPage />} />
        <Route path="/manage-event" element={<ManageEventPage />} />
        <Route path="/registrations" element={<MyRegistrationsPage />} />
        <Route path="/my-events" element={<MyRegistrationsPage />} />
        <Route path="/requests" element={<AdminRequestsPage />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/requests" element={<AdminRequestsPage />} />
        <Route path="/admin/events" element={<EventDiscoveryPage />} />
        <Route path="/admin/users" element={<AdminDashboardPage />} />
        <Route path="/admin/reports" element={<OrganizerDashboardPage />} />
        <Route path="/admin/settings" element={<AdminDashboardPage />} />

        {/* Stubs */}
        <Route path="/attendees" element={<MyRegistrationsPage />} />
        <Route path="/venues" element={<EventDiscoveryPage />} />
        <Route path="/reports" element={<OrganizerDashboardPage />} />
        <Route path="/profile" element={<AdminDashboardPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
