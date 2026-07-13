import { NavLink } from 'react-router-dom';
import { Home, CalendarCheck, Ticket, User } from 'lucide-react';

const tabs = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/my-events', icon: CalendarCheck, label: 'My Events' },
  { to: '/registrations', icon: Ticket, label: 'Registrations' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function MobileLayout({ children }) {
  return (
    <div className="flex flex-col h-screen bg-surface max-w-sm mx-auto relative">
      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 flex items-center justify-around px-2 py-1 z-50">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${
                isActive ? 'text-brand' : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={`text-[10px] font-medium ${isActive ? 'text-brand' : ''}`}>
                  {label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-8 h-0.5 bg-amber-400 rounded-t-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
