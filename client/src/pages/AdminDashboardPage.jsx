import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import {
  Users,
  CalendarCheck,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  X,
  ToggleLeft,
  ToggleRight,
  Search,
} from "lucide-react";
import Toast from "../components/Toast";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function AdminDashboardPage() {
  const {
    events,
    requests,
    users,
    updateUser,
  } = useAppContext();

  // Toast state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isViewAllUsersOpen, setIsViewAllUsersOpen] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    autoApprove: false,
    maintenanceMode: false,
    taxRate: 5,
    allowRefunds: true,
  });

  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".admin-stat-card", {
      opacity: 0,
      y: 24,
      duration: 0.55,
      stagger: 0.1,
      ease: "power2.out",
    });
    gsap.from(".admin-section", {
      opacity: 0,
      y: 20,
      duration: 0.55,
      stagger: 0.12,
      ease: "power2.out",
      delay: 0.3,
    });
  }, { scope: containerRef });

  // Search/Filter for View All Users Modal
  const [userSearch, setUserSearch] = useState("");

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Stats calculation
  const activeEventsCount = events.filter((e) => e.status === "LIVE" || e.status === "OPENING SOON").length;
  const pendingReviewsCount = requests.filter((r) => r.status === "Pending").length;
  const totalRevenue = events.reduce((sum, e) => sum + (e.registered || 0) * (e.price || 0), 0);
  
  const stats = [
    {
      label: "Total Users",
      value: users.length.toString(),
      change: "+2 this week",
      icon: Users,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Active Events",
      value: activeEventsCount.toString(),
      change: "Calculated live",
      icon: CalendarCheck,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Platform Revenue",
      value: `$${(totalRevenue / 1000).toFixed(1)}k`,
      change: "From active ticket sales",
      icon: DollarSign,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Pending Reviews",
      value: pendingReviewsCount.toString(),
      change: `${requests.filter(r => r.status === 'Pending').length} requests pending`,
      icon: ShieldCheck,
      color: "bg-red-50 text-red-600",
    },
  ];

  const alerts = [
    {
      type: "warning",
      message: `${pendingReviewsCount} events pending approval in the queue`,
      time: "Just now",
    },
    {
      type: "danger",
      message: "Security Audit: Unapproved changes to user rules checked",
      time: "2h ago",
    },
    {
      type: "info",
      message: "Platform auto-backup completed successfully",
      time: "6h ago",
    },
  ];

  // User Actions
  const handleToggleSuspend = (email) => {
    const userToSuspend = users.find((u) => u.email === email);
    if (userToSuspend) {
      const newStatus = userToSuspend.status === "Suspended" ? "Active" : "Suspended";
      updateUser(userToSuspend.id, { status: newStatus });
      triggerToast(
        `User ${userToSuspend.name} has been ${newStatus === "Suspended" ? "suspended" : "reactivated"}`,
        newStatus === "Suspended" ? "warning" : "success"
      );
    }
  };

  const handleEditUserSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedName = formData.get("name");
    const updatedEmail = formData.get("email");
    const updatedRole = formData.get("role").toLowerCase();
    const updatedStatus = formData.get("status");

    updateUser(editingUser.id, {
      name: updatedName,
      email: updatedEmail,
      role: updatedRole,
      status: updatedStatus,
    });

    triggerToast(`Successfully updated user profile for ${updatedName}`);
    setEditingUser(null);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSettingsOpen(false);
    triggerToast("System settings updated successfully.");
  };

  const handleExportReport = () => {
    triggerToast("Generating platform analytics report... PDF downloaded.", "success");
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div ref={containerRef}>
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Platform overview and real-time management
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleExportReport} className="text-sm btn-secondary">
            Export Report
          </button>
          <button onClick={() => setIsSettingsOpen(true)} className="text-sm btn-primary">
            System Settings
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4 sm:gap-4">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="admin-stat-card p-4 card">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={17} />
            </div>
            <p className="text-xl font-bold text-gray-900 sm:text-2xl">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            <p className="text-[10px] text-gray-400 mt-1">{change}</p>
          </div>
        ))}
      </div>

      {/* Chart + Alerts */}
      <div className="admin-section grid grid-cols-1 gap-4 mb-5 lg:grid-cols-3 sm:gap-5">
        <div className="p-5 lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Platform Revenue Trend</h2>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-xs font-medium text-green-600">+18% MoM</span>
            </div>
          </div>
          <div className="flex items-end h-24 gap-1">
            {[45, 60, 50, 75, 80, 95, 85, 110, 105, 130, 125, 140, 155, 168].map((v, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t min-w-0 ${i === 13 ? "bg-brand" : "bg-primary-200"}`}
                style={{ height: `${(v / 168) * 100}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="p-5 card">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-amber-500" />
            <h2 className="section-title">System Alerts</h2>
          </div>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl text-xs ${
                  a.type === "warning"
                    ? "bg-amber-50 border border-amber-100"
                    : a.type === "danger"
                      ? "bg-red-50 border border-red-100"
                      : "bg-blue-50 border border-blue-100"
                }`}
              >
                <p className={`font-medium ${a.type === "warning" ? "text-amber-700" : a.type === "danger" ? "text-red-700" : "text-blue-700"}`}>
                  {a.message}
                </p>
                <p className="text-gray-400 mt-0.5">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="section-title">Recent Users</h2>
          <button
            onClick={() => setIsViewAllUsersOpen(true)}
            className="text-xs font-medium text-primary-600 hover:underline"
          >
            View All Users
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr className="bg-gray-50">
                {["User", "Role", "Joined", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.slice(0, 5).map((u, i) => (
                <tr key={i} className="transition-colors hover:bg-gray-50 group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center flex-shrink-0 text-xs font-bold text-white rounded-full w-7 h-7 bg-brand">
                        {u.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 whitespace-nowrap">{u.name}</p>
                        <p className="text-gray-400 text-[10px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={u.role === "Admin" ? "badge-danger" : u.role === "Organizer" ? "badge-info" : "badge-gray"}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{u.joined}</td>
                  <td className="px-5 py-3">
                    <span className={u.status === "Active" ? "badge-success" : u.status === "Pending" ? "badge-warning" : "badge-danger"}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingUser(u)} className="text-xs text-primary-600 hover:underline">
                        Edit
                      </button>
                      <button onClick={() => handleToggleSuspend(u.email)} className="text-xs text-red-600 hover:underline">
                        {u.status === "Suspended" ? "Reactivate" : "Suspend"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SYSTEM SETTINGS MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl border border-gray-150 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900">System Configuration</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-800">Auto-Approve Event Requests</p>
                  <p className="text-[10px] text-gray-400">Skip the approval queue for verified organizers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, autoApprove: !prev.autoApprove }))}
                  className="text-gray-500"
                >
                  {settings.autoApprove ? <ToggleRight className="text-brand" size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-800">Platform Maintenance Mode</p>
                  <p className="text-[10px] text-gray-400">Restrict access to platform while performing audits</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, maintenanceMode: !prev.maintenanceMode }))}
                  className="text-gray-500"
                >
                  {settings.maintenanceMode ? <ToggleRight className="text-red-500" size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Platform Service Fee (%)</label>
                <input
                  type="number"
                  className="input-field"
                  value={settings.taxRate}
                  onChange={(e) => setSettings(prev => ({ ...prev, taxRate: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsSettingsOpen(false)} className="px-4 py-2 text-xs btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs btn-primary">
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl border border-gray-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-bold text-gray-900">Edit User Account</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditUserSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Full Name</label>
                <input name="name" className="input-field" defaultValue={editingUser.name} required />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Email Address</label>
                <input name="email" type="email" className="input-field" defaultValue={editingUser.email} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Role</label>
                  <select name="role" className="input-field" defaultValue={editingUser.role}>
                    <option value="Admin">Admin</option>
                    <option value="Organizer">Organizer</option>
                    <option value="Attendee">Attendee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Status</label>
                  <select name="status" className="input-field" defaultValue={editingUser.status}>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 text-xs btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW ALL USERS MODAL */}
      {isViewAllUsersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-xl border border-gray-150 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <Users className="text-brand" size={20} />
                <h3 className="text-base font-bold text-gray-900">All Platform Users</h3>
              </div>
              <button onClick={() => setIsViewAllUsersOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search size={14} className="absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>

            {/* Scrollable table */}
            <div className="flex-1 overflow-y-auto min-h-0 border border-gray-100 rounded-xl">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["User", "Role", "Joined", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-2 text-left font-semibold text-gray-500 uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white rounded-full w-6 h-6 bg-brand">
                            {u.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{u.name}</p>
                            <p className="text-gray-400 text-[9px]">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={u.role === "Admin" ? "badge-danger" : u.role === "Organizer" ? "badge-info" : "badge-gray"}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-gray-500">{u.joined}</td>
                      <td className="px-4 py-2.5">
                        <span className={u.status === "Active" ? "badge-success" : u.status === "Pending" ? "badge-warning" : "badge-danger"}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setIsViewAllUsersOpen(false);
                            }}
                            className="text-primary-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button onClick={() => handleToggleSuspend(u.email)} className="text-red-600 hover:underline">
                            {u.status === "Suspended" ? "Activate" : "Suspend"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">
                        No users match your search terms
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-4">
              <button onClick={() => setIsViewAllUsersOpen(false)} className="px-4 py-2 text-xs btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}
