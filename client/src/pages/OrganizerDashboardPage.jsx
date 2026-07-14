import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  TrendingUp,
  Users,
  CalendarCheck,
  DollarSign,
  Plus,
  ArrowRight,
  BarChart2,
  X,
} from "lucide-react";
import Toast from "../components/Toast";

// Presets for cover images
const imagePresets = [
  { name: "Tech Summit", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80" },
  { name: "Networking Event", url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80" },
  { name: "Corporate Meeting", url: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80" },
  { name: "Bootcamp/Workshop", url: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=80" },
];

export default function OrganizerDashboardPage() {
  const navigate = useNavigate();
  const {
    events,
    requests,
    setRequests,
    user,
  } = useOutletContext();

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [chartRange, setChartRange] = useState("Last 7 days");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Dynamic statistics
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, e) => sum + (e.registered || 0), 0);
  const totalRevenue = events.reduce((sum, e) => sum + (e.registered || 0) * (e.price || 0), 0);
  const avgFillRate = totalEvents > 0
    ? Math.round((events.reduce((sum, e) => sum + (e.registered / e.capacity), 0) / totalEvents) * 100)
    : 0;

  const stats = [
    {
      label: "Total Events",
      value: totalEvents.toString(),
      change: `+${requests.filter(r => r.status === 'Approved').length} approved`,
      icon: CalendarCheck,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Registrations",
      value: totalRegistrations.toLocaleString(),
      change: "Active attendees",
      icon: Users,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "Ticket gross revenue",
      icon: DollarSign,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Avg. Fill Rate",
      value: `${avgFillRate}%`,
      change: "Seat utilization rate",
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  // Simulated chart data depending on dropdown choice
  const chartData = chartRange === "Last 7 days"
    ? {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [30, 45, 28, 80, 55, 95, 72],
      }
    : {
        labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6", "Wk 7"],
        values: [110, 88, 130, 95, 145, 120, 165],
      };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title");
    const date = formData.get("date");
    const time = formData.get("time");
    const location = formData.get("location");
    const capacity = parseInt(formData.get("capacity")) || 100;
    const price = parseFloat(formData.get("price")) || 0.0;
    const description = formData.get("description");

    const newReqId = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest = {
      id: newReqId,
      event: title,
      requester: user.org || "Organizer Org",
      date: "Today",
      status: "Pending",
      // Details to carry over when approved:
      dateProposed: `${date} · ${time}`,
      capacityProposed: capacity,
      priceProposed: price,
      locationProposed: location,
      descriptionProposed: description,
      imageProposed: imagePresets[selectedImageIndex].url,
    };

    setRequests((prev) => [newRequest, ...prev]);
    setIsCreateOpen(false);
    triggerToast(`Event "${title}" submitted to Admin approval queue. ID: ${newReqId}`, "info");
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Good morning, {user.name.split(" ")[0]}! 👋</h1>
          <p className="mt-1 text-sm text-gray-500">Here's what's happening with your events today.</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="self-start gap-2 btn-primary sm:self-auto">
          <Plus size={16} />
          Create Event
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6 lg:grid-cols-4 sm:gap-4">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="p-4 card">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
                <Icon size={17} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-[10px] text-green-600 mt-1 font-medium">{change}</p>
          </div>
        ))}
      </div>

      {/* Chart Row */}
      <div className="grid grid-cols-1 gap-4 mb-5 lg:grid-cols-3 sm:gap-5">
        <div className="p-5 lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Registration Trend</h2>
            <select
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              className="px-2 py-1 text-xs text-gray-500 bg-gray-150 border-0 rounded-lg focus:outline-none cursor-pointer"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
            </select>
          </div>
          
          <div className="flex items-end h-24 gap-1">
            {chartData.values.map((v, i) => {
              const max = Math.max(...chartData.values);
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-t min-w-0 transition-all duration-300 ${
                    i === chartData.values.length - 1 ? "bg-brand" : "bg-primary-200"
                  }`}
                  style={{ height: `${(v / max) * 100}%` }}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400">
            {chartData.labels.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {events.length > 0 && (
            <div className="p-4 text-white card bg-gradient-to-br from-brand to-primary-600 shadow-lg">
              <p className="mb-2 text-xs opacity-70">Next Upcoming Event</p>
              <p className="mb-3 text-sm font-bold leading-tight line-clamp-2">{events[0].title}</p>
              <p className="mb-3 text-xs opacity-80">{events[0].date}</p>
              <button
                onClick={() => navigate(`/manage-event?id=${events[0].id}`)}
                className="flex items-center gap-1 text-xs font-medium bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 transition-colors"
              >
                Manage <ArrowRight size={11} />
              </button>
            </div>
          )}

          <div className="p-4 card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Capacity fill rates</h3>
              <BarChart2 size={14} className="text-gray-400" />
            </div>
            {events.slice(0, 3).map((e) => {
              const pct = e.capacity > 0 ? Math.round((e.registered / e.capacity) * 100) : 0;
              return (
                <div key={e.id} className="mb-3 last:mb-0">
                  <div className="flex justify-between mb-1 text-xs text-gray-500">
                    <span className="truncate max-w-[140px]">{e.title}</span>
                    <span className="ml-1 font-semibold">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-150 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-450" : "bg-brand"}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events list */}
      <div className="overflow-hidden card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="section-title">Active Organizer Events</h2>
          <button onClick={() => navigate("/events")} className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline">
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[520px]">
            <thead>
              <tr className="bg-gray-50">
                {["Event", "Date", "Registered", "Status", "Fill"].map((h) => (
                  <th key={h} className="px-5 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map((e) => {
                const pct = e.capacity > 0 ? Math.round((e.registered / e.capacity) * 100) : 0;
                return (
                  <tr
                    key={e.id}
                    className="transition-colors cursor-pointer hover:bg-gray-50"
                    onClick={() => navigate(`/manage-event?id=${e.id}`)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-shrink-0 w-8 h-8 overflow-hidden bg-gray-100 rounded-lg">
                          <img src={e.image} alt="" className="object-cover w-full h-full" />
                        </div>
                        <span className="font-medium text-gray-800 max-w-[200px] truncate">{e.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{e.date}</td>
                    <td className="px-5 py-3 font-medium text-gray-700">
                      {e.registered}/{e.capacity}
                    </td>
                    <td className="px-5 py-3">
                      <span className={e.status === "LIVE" ? "badge-success" : e.status === "OPENING SOON" ? "badge-info" : "badge-gray"}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${pct >= 100 ? "bg-red-500" : pct >= 80 ? "bg-amber-400" : "bg-brand"}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {events.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No active events found. Click "Create Event" to propose one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE EVENT MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl border border-gray-150 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <CalendarCheck className="text-brand" size={18} />
                <h3 className="text-base font-bold text-gray-900">Propose New Event</h3>
              </div>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Event Title</label>
                <input name="title" placeholder="e.g. NextGen Design Workshop 2026" className="input-field" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Date</label>
                  <input name="date" type="date" className="input-field" required />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Time</label>
                  <input name="time" type="time" className="input-field" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Capacity (Seats)</label>
                  <input name="capacity" type="number" defaultValue="150" min="10" className="input-field" required />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Ticket Price ($)</label>
                  <input name="price" type="number" step="0.01" defaultValue="49.00" min="0" className="input-field" required />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Venue / Location</label>
                <input name="location" placeholder="e.g. Hilton Conference Center, San Francisco" className="input-field" required />
              </div>

              {/* Cover Image Presets Selector */}
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Cover Image Preset</label>
                <div className="grid grid-cols-4 gap-2">
                  {imagePresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === idx ? "border-brand" : "border-transparent opacity-60"
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="object-cover w-full h-full" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-[8px] font-semibold text-white truncate px-1">{preset.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Description</label>
                <textarea
                  name="description"
                  placeholder="Provide details about schedule, speakers, target audience..."
                  className="input-field resize-none h-24"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-xs btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-xs btn-primary">
                  Submit for Approval
                </button>
              </div>
            </form>
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
    </>
  );
}
