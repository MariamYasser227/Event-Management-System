import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Layers,
  ChevronRight,
  Shield,
  Briefcase,
  User,
  Key,
  X,
  UserCheck,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function DevPageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    accounts,
    currentUser,
    setCurrentUser,
    role,
  } = useAppContext();

  const pages = [
    {
      section: "Auth & Public",
      icon: Key,
      items: [
        { label: "Landing Page", path: "/landing", role: null },
        { label: "Sign In", path: "/signin", role: null },
        { label: "Sign Up", path: "/signup", role: null },
      ],
    },
    {
      section: "Attendee Views",
      icon: User,
      items: [
        { label: "User Home", path: "/home", role: "user" },
        { label: "Discover Events", path: "/discover", role: "user" },
        { label: "My Tickets", path: "/my-tickets", role: "user" },
        { label: "Event Details (ID: 1)", path: "/event/1", role: "user" },
      ],
    },
    {
      section: "Organizer Views",
      icon: Briefcase,
      items: [
        { label: "Organizer Dashboard", path: "/dashboard", role: "organizer" },
        { label: "Manage Event", path: "/manage-event", role: "organizer" },
      ],
    },
    {
      section: "Admin Views",
      icon: Shield,
      items: [
        { label: "Admin Dashboard", path: "/admin/dashboard", role: "admin" },
        { label: "Request Queue", path: "/admin/requests", role: "admin" },
      ],
    },
  ];

  const handleSwitchAccount = (acc) => {
    setCurrentUser(acc);
    if (acc.role === "admin") navigate("/admin/dashboard");
    else if (acc.role === "user") navigate("/discover");
    else navigate("/dashboard");
    setIsOpen(false);
  };

  const handleSwitchPage = (path, targetRole) => {
    if (targetRole && targetRole !== role) {
      const matchedAccount = accounts.find((a) => a.role === targetRole);
      if (matchedAccount) {
        setCurrentUser(matchedAccount);
      }
    }
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-brand text-white rounded-full shadow-lg hover:bg-brand-light transition-all duration-200 hover:scale-105 active:scale-95 border border-brand-dark/20"
        >
          <Layers size={18} className="animate-pulse" />
          <span className="text-xs font-semibold tracking-wider">Dev Control</span>
        </button>
      )}

      {/* Navigation Modal / Drawer */}
      {isOpen && (
        <div className="w-80 max-h-[580px] bg-slate-900/95 text-white rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-lg flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-2">
              <Layers size={16} className="text-amber-400" />
              <h3 className="font-bold text-sm tracking-wide text-amber-400 uppercase font-sans">
                Dev Console
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Current State Indicator */}
          <div className="px-5 py-2.5 bg-slate-800/40 border-b border-slate-800 text-[11px] flex justify-between text-slate-400 font-sans">
            <span>
              User: <strong className="text-slate-200">{currentUser?.name}</strong>
            </span>
            <span className="truncate max-w-[140px]">
              Path: <strong className="text-slate-200">{location.pathname}</strong>
            </span>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-hide">
            
            {/* Account Switcher */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                <UserCheck size={10} />
                <span>Switch Account</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {accounts.map((acc) => {
                  const isActive = currentUser?.id === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => handleSwitchAccount(acc)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left border ${
                        isActive
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          : "bg-slate-850/40 border-transparent hover:bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{acc.name}</p>
                        <p className="text-[10px] opacity-60 font-normal">{acc.email}</p>
                      </div>
                      <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                        acc.role === "admin"
                          ? "bg-red-500/20 text-red-300"
                          : acc.role === "organizer"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-green-500/20 text-green-300"
                      }`}>
                        {acc.role}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* View Navigation */}
            <div className="space-y-4">
              {pages.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <div key={group.section} className="space-y-1.5">
                    <div className="flex items-center gap-1.5 px-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <GroupIcon size={10} />
                      <span>{group.section}</span>
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                          <button
                            key={item.path}
                            onClick={() => handleSwitchPage(item.path, item.role)}
                            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                              isActive
                                ? "bg-slate-800 text-amber-400 border border-slate-700"
                                : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent"
                            }`}
                          >
                            <span className="truncate">{item.label}</span>
                            <ChevronRight
                              size={11}
                              className={`opacity-30 ${isActive ? "text-amber-400 opacity-80" : ""}`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
