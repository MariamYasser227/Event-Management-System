import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  MapPin,
  BarChart2,
  HelpCircle,
  LogOut,
  Zap,
  ClipboardList,
  Settings,
  UserCog,
  Ticket,
  Compass,
} from "lucide-react";

const organizerNav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/events", icon: CalendarCheck, label: "Events" },
  { to: "/requests", icon: ClipboardList, label: "Requests" },
  { to: "/venues", icon: MapPin, label: "Venues" },
  { to: "/reports", icon: BarChart2, label: "Reports" },
];

const adminNav = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/events", icon: CalendarCheck, label: "Events" },
  { to: "/admin/requests", icon: ClipboardList, label: "Request Queue" },
  { to: "/admin/users", icon: UserCog, label: "Users" },
  { to: "/admin/reports", icon: BarChart2, label: "Reports" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const userNav = [
  { to: "/discover", icon: Compass, label: "Discover Events" },
  { to: "/my-tickets", icon: Ticket, label: "My Tickets" },
];

export default function Sidebar({ role = "organizer", user }) {
  const navigate = useNavigate();

  let navItems = organizerNav;
  if (role === "admin") navItems = adminNav;
  if (role === "user") navItems = userNav;

  return (
    <aside className="flex-col hidden w-64 min-h-screen bg-white border-r border-gray-100 shadow-sm md:flex">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
        <div className="flex items-center justify-center w-8 h-8 bg-indigo-900 rounded-lg">
          <Zap size={16} className="text-white fill-white" />
        </div>
        <span className="text-xl font-bold text-indigo-950">EventLogix</span>
      </div>

      {user && role !== "user" && (
        <div className="px-6 py-3 border-b border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
            Organization
          </p>
          <p className="text-sm font-medium text-gray-800 truncate">
            {user.org || "EventLogix Global"}
          </p>
        </div>
      )}

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard" || to === "/admin/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 space-y-1 border-t border-gray-100">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors">
          <HelpCircle size={18} />
          <span>Help Center</span>
        </button>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}