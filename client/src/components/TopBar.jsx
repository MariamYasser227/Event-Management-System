import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Settings, ChevronDown, Shield, Briefcase, User, Menu } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function TopBar({ title, user, role = 'organizer', onRoleChange, onMenuClick }) {
  const { accounts, currentUser, setCurrentUser } = useAppContext();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const activeUser = currentUser || user || accounts[2];

  const initials = activeUser.name
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

  const handleSwitchAccount = (acc) => {
    setCurrentUser(acc);
    if (acc.role === "admin") navigate("/admin/dashboard");
    else if (acc.role === "user") navigate("/discover");
    else navigate("/dashboard");
    setShowProfileDropdown(false);
  };

  return (
    <header className="flex items-center justify-between flex-shrink-0 px-5 bg-white border-b border-gray-100 h-14">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors md:hidden"
          >
            <Menu size={20} />
          </button>
        )}
        {title && (
          <h1 className="text-base font-semibold text-gray-900 truncate max-w-[120px] sm:max-w-none">{title}</h1>
        )}
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search resources..."
            className="pl-8 pr-3 py-1.5 text-sm bg-gray-100 border-0 rounded-full w-40 sm:w-52 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:w-64 transition-all duration-200"
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
        
        {/* Profile Dropdown Area */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-2 py-1 pl-2 pr-1 transition-colors rounded-lg hover:bg-gray-100"
          >
            <div className="flex items-center justify-center text-xs font-semibold text-white rounded-full w-7 h-7 bg-brand">
              {initials}
            </div>
            <ChevronDown size={13} className="text-gray-400" />
          </button>

          {showProfileDropdown && (
            <>
              <div 
                className="fixed inset-0 z-30 cursor-default" 
                onClick={() => setShowProfileDropdown(false)} 
              />
              <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-2xl py-3 z-40 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 pb-2 border-b border-gray-100 mb-2">
                  <p className="text-xs font-bold text-gray-900 truncate">{activeUser.name}</p>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{activeUser.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-700">
                    {activeUser.role}
                  </span>
                </div>
                
                <div className="px-3 py-1 mb-1">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Switch Account</p>
                </div>

                <div className="space-y-1 px-2 max-h-60 overflow-y-auto">
                  {accounts.map((acc) => {
                    const isCurrent = acc.id === activeUser.id;
                    const accInitials = acc.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();
                    
                    return (
                      <button
                        key={acc.id}
                        onClick={() => handleSwitchAccount(acc)}
                        className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-left transition-all ${
                          isCurrent 
                            ? 'bg-indigo-50/70 border border-indigo-100 text-indigo-950 font-medium' 
                            : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0 ${
                          acc.role === 'admin' ? 'bg-purple-600' : acc.role === 'organizer' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}>
                          {accInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold truncate text-gray-800">{acc.name}</p>
                            {isCurrent && <span className="w-1.5 h-1.5 bg-brand rounded-full" />}
                          </div>
                          <p className="text-[10px] text-gray-400 truncate mt-0.5">{acc.email}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}