import { Bell, Search, Settings, ChevronDown, Shield, Briefcase, User } from 'lucide-react';

export default function TopBar({ title, user = { name: 'Mariam Yasser', avatar: null }, role = 'organizer', onRoleChange }) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleRoleSwitch = () => {
    const roles = ['admin', 'organizer', 'user'];
    const nextRoleIndex = (roles.indexOf(role) + 1) % roles.length;
    onRoleChange(roles[nextRoleIndex]);
  };

  return (
    <header className="flex items-center justify-between flex-shrink-0 px-5 bg-white border-b border-gray-100 h-14">
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="hidden text-base font-semibold text-gray-900 md:block">{title}</h1>
        )}
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search resources..."
            className="pl-8 pr-3 py-1.5 text-sm bg-gray-100 border-0 rounded-full w-52 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:w-64 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onRoleChange && (
          <button
            onClick={handleRoleSwitch}
            className="flex items-center gap-1.5 px-3 py-1.5 mr-2 rounded-lg text-xs font-medium border transition-colors bg-white hover:bg-gray-50 border-gray-200 text-gray-700 w-36 justify-center"
          >
            {role === 'admin' && (
              <>
                <Shield size={14} className="text-primary-600" />
                <span>Admin View</span>
              </>
            )}
            {role === 'organizer' && (
              <>
                <Briefcase size={14} className="text-amber-600" />
                <span>Organizer View</span>
              </>
            )}
            {role === 'user' && (
              <>
                <User size={14} className="text-gray-500" />
                <span>User View</span>
              </>
            )}
          </button>
        )}
        <button className="relative p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Settings size={17} />
        </button>
        <button className="flex items-center gap-2 py-1 pl-2 pr-1 transition-colors rounded-lg hover:bg-gray-100">
          <div className="flex items-center justify-center text-xs font-semibold text-white rounded-full w-7 h-7 bg-brand">
            {initials}
          </div>
          <ChevronDown size={13} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}