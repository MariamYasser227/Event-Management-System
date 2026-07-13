import { NavLink, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

const navSections = [
  {
    label: 'ORGANIZER',
    role: 'organizer',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/events', icon: CalendarCheck, label: 'Events' },
      { to: '/requests', icon: ClipboardList, label: 'Requests' },
      { to: '/attendees', icon: Users, label: 'Attendees' },
      { to: '/venues', icon: MapPin, label: 'Venues' },
      { to: '/reports', icon: BarChart2, label: 'Reports' },
    ],
  },
];

const adminNav = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/events', icon: CalendarCheck, label: 'Events' },
  { to: '/admin/requests', icon: ClipboardList, label: 'Request Queue' },
  { to: '/admin/users', icon: UserCog, label: 'Users' },
  { to: '/admin/reports', icon: BarChart2, label: 'Reports' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ role = 'organizer', user }) {
  const navigate = useNavigate();
  const navItems = role === 'admin' ? adminNav : navSections[0].items;

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-white border-r border-gray-100 shadow-sidebar">
      {/* Brand */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
        <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center">
          <Zap size={14} className="text-white" />
        </div>
        <span className="text-lg font-bold text-brand">EventLogix</span>
      </div>

      {/* Organization label */}
      {user && (
        <div className="px-4 py-3 border-b border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Organization</p>
          <p className="text-xs font-medium text-gray-700 truncate">{user.org || 'EventLogix Global'}</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'nav-item-active' : 'nav-item-inactive'
            }
          >
            <Icon size={16} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-3 border-t border-gray-100 space-y-0.5">
        <button className="nav-item-inactive w-full">
          <HelpCircle size={16} />
          <span>Help Center</span>
        </button>
        <button
          onClick={() => navigate('/login')}
          className="nav-item-inactive w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
