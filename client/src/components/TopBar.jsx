import { Bell, Search, Settings, ChevronDown } from 'lucide-react';

export default function TopBar({ title, user = { name: 'Mariam Yasser', avatar: null } }) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 flex-shrink-0">
      {/* Left: search */}
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-base font-semibold text-gray-900 hidden md:block">{title}</h1>
        )}
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            className="pl-8 pr-3 py-1.5 text-sm bg-gray-100 border-0 rounded-full w-52 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:w-64 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right: icons + avatar */}
      <div className="flex items-center gap-2">
        <button className="relative p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Bell size={17} />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>
        <button className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Settings size={17} />
        </button>
        <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-semibold flex items-center justify-center">
            {initials}
          </div>
          <ChevronDown size={13} className="text-gray-400" />
        </button>
      </div>
    </header>
  );
}
