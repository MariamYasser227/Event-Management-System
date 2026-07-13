import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight, CalendarCheck, Users, BarChart2, Shield } from 'lucide-react';

const features = [
  { icon: CalendarCheck, title: 'Event Management', desc: 'Create and manage events with powerful organizer tools' },
  { icon: Users, title: 'Attendee Tracking', desc: 'Real-time registration, check-ins, and capacity monitoring' },
  { icon: BarChart2, title: 'Analytics & Reports', desc: 'Insights and revenue dashboards for data-driven decisions' },
  { icon: Shield, title: 'Admin Controls', desc: 'Full platform oversight with request queues and user management' },
];

const roles = [
  { label: 'User / Attendee', desc: 'Browse & register for events', path: '/home', color: 'from-blue-500 to-indigo-600' },
  { label: 'Event Organizer', desc: 'Manage events & registrants', path: '/dashboard', color: 'from-brand to-primary-600' },
  { label: 'Admin', desc: 'Platform-wide oversight', path: '/admin/dashboard', color: 'from-purple-600 to-pink-600' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-dark to-slate-900 text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur">
            <Zap size={16} className="text-amber-400" />
          </div>
          <span className="text-xl font-bold">EventLogix</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-sm text-white/70 hover:text-white transition-colors">Features</button>
          <button className="text-sm text-white/70 hover:text-white transition-colors">Pricing</button>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium backdrop-blur transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-8 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-xs font-medium mb-8 border border-white/10">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Now in Beta — Join 4,000+ event professionals
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          The Complete
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent"> Event Management</span>
          <br />Platform
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10">
          From discovery to check-in. EventLogix gives organizers, attendees, and admins everything they need to run world-class events.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {roles.map(({ label, desc, path, color }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`group relative px-6 py-4 rounded-2xl bg-gradient-to-br ${color} hover:scale-105 transition-transform duration-200 shadow-lg min-w-44 text-left`}
            >
              <p className="font-bold text-sm mb-0.5">{label}</p>
              <p className="text-xs text-white/70">{desc}</p>
              <ArrowRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-8 pb-24">
        <h2 className="text-2xl font-bold text-center mb-10">Everything you need to run great events</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center mb-3">
                <Icon size={18} className="text-amber-400" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{title}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-white/10 py-8 text-center">
        <p className="text-sm text-white/40">© 2024 EventLogix. Built with ❤️ for event professionals.</p>
      </div>
    </div>
  );
}
