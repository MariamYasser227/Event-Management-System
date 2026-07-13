import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, Users, MapPin, BarChart2,
  HelpCircle, LogOut, Zap, ClipboardList, Settings,
  UserCog, Menu, X, Bell, Search, ChevronDown, Ticket,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/events', icon: CalendarCheck, label: 'Events' },
  { to: '/registrations', icon: Ticket, label: 'Registrations' },
  { to: '/requests', icon: ClipboardList, label: 'Requests' },
  { to: '/attendees', icon: Users, label: 'Attendees' },
  { to: '/venues', icon: MapPin, label: 'Venues' },
  { to: '/reports', icon: BarChart2, label: 'Reports' },
  { to: '/admin/users', icon: UserCog, label: 'Users' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

const user = { name: 'Mariam Yasser', org: 'EventLogix Global Operations' };

function SidebarContent({ onClose }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-lg font-bold text-brand">EventLogix</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Org label */}
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Organization</p>
        <p className="text-xs font-medium text-gray-700 truncate">{user.org}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
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
          onClick={() => navigate('/')}
          className="nav-item-inactive w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

function TopBar({ onMenuClick }) {
  const initials = user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 flex-shrink-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            className="pl-8 pr-3 py-1.5 text-sm bg-gray-100 border-0 rounded-full w-44 md:w-56 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:w-64 transition-all duration-200"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Settings size={17} />
        </button>
        <button className="flex items-center gap-1.5 pl-2 pr-1 py-1 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">
            {initials}
          </div>
          <ChevronDown size={13} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — always visible on lg+, drawer on mobile */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 w-56 bg-white border-r border-gray-100 shadow-sidebar
          transform transition-transform duration-250 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
