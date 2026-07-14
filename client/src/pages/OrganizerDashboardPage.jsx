import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, CalendarCheck, DollarSign, Plus, ArrowRight, BarChart2 } from 'lucide-react';
import DesktopLayout from '../components/DesktopLayout';
import { mockEvents, mockUser } from '../data/mockData';

const stats = [
  { label: 'Total Events', value: '24', change: '+3 this month', icon: CalendarCheck, color: 'bg-blue-50 text-blue-600' },
  { label: 'Registrations', value: '1,842', change: '+12% vs last month', icon: Users, color: 'bg-green-50 text-green-600' },
  { label: 'Revenue', value: '$48,200', change: '+8.4% vs last month', icon: DollarSign, color: 'bg-amber-50 text-amber-600' },
  { label: 'Avg. Fill Rate', value: '76%', change: '+5% this month', icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
];

function MiniBarChart({ data }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end h-20 gap-1 sm:h-24">
      {data.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded-t min-w-0 transition-all ${i === data.length - 1 ? 'bg-brand' : 'bg-primary-200'}`}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function OrganizerDashboardPage() {
  const navigate = useNavigate();
  const recentEvents = mockEvents.slice(0, 4);

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Good morning, {mockUser.name.split(' ')[0]}! 👋</h1>
          <p className="mt-1 text-sm text-gray-500">Here's what's happening with your events today.</p>
        </div>
        <button onClick={() => navigate('/create-event')} className="self-start gap-2 btn-primary sm:self-auto">
          <Plus size={16} />
          Create Event
        </button>
      </div>

      {/* Stats: 2 cols mobile, 4 cols lg */}
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

      {/* Chart row: col-span-2 chart + fill rate panel */}
      <div className="grid grid-cols-1 gap-4 mb-5 lg:grid-cols-3 sm:gap-5">
        <div className="p-5 lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Registration Trend</h2>
            <select className="px-2 py-1 text-xs text-gray-500 bg-gray-100 border-0 rounded-lg focus:outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <MiniBarChart data={[30, 45, 28, 80, 55, 95, 72, 110, 88, 130, 95, 145, 120, 165]} />
          <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <span key={d}>{d}</span>)}
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 text-white card bg-gradient-to-br from-brand to-primary-600">
            <p className="mb-2 text-xs opacity-70">Next Event</p>
            <p className="mb-3 text-sm font-bold leading-tight line-clamp-2">{mockEvents[0].title}</p>
            <p className="mb-3 text-xs opacity-80">{mockEvents[0].date}</p>
            <button
              onClick={() => navigate('/manage-event')}
              className="flex items-center gap-1 text-xs font-medium bg-white/20 hover:bg-white/30 rounded-lg px-3 py-1.5 transition-colors"
            >
              Manage <ArrowRight size={11} />
            </button>
          </div>

          <div className="p-4 card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Fill Rates</h3>
              <BarChart2 size={14} className="text-gray-400" />
            </div>
            {mockEvents.slice(0, 3).map((e) => {
              const pct = Math.round((e.registered / e.capacity) * 100);
              return (
                <div key={e.id} className="mb-3 last:mb-0">
                  <div className="flex justify-between mb-1 text-xs text-gray-500">
                    <span className="truncate max-w-[140px]">{e.title}</span>
                    <span className="ml-1 font-semibold">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-brand'}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Events table — horizontal scroll on small */}
      <div className="overflow-hidden card">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="section-title">Recent Events</h2>
          <button onClick={() => navigate('/events')} className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:underline">
            View All <ArrowRight size={12} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[520px]">
            <thead>
              <tr className="bg-gray-50">
                {['Event','Date','Registered','Status','Fill'].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentEvents.map((e) => {
                const pct = Math.round((e.registered / e.capacity) * 100);
                return (
                  <tr key={e.id} className="transition-colors cursor-pointer hover:bg-gray-50" onClick={() => navigate('/manage-event')}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex-shrink-0 w-8 h-8 overflow-hidden bg-gray-100 rounded-lg">
                          <img src={e.image} alt="" className="object-cover w-full h-full" />
                        </div>
                        <span className="font-medium text-gray-800 max-w-[160px] truncate">{e.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{e.date}</td>
                    <td className="px-5 py-3 font-medium text-gray-700">{e.registered}/{e.capacity}</td>
                    <td className="px-5 py-3">
                      <span className={e.status === 'LIVE' ? 'badge-success' : e.status === 'OPENING SOON' ? 'badge-info' : 'badge-gray'}>{e.status}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-400' : 'bg-brand'}`} style={{ width: `${Math.min(pct,100)}%` }} />
                        </div>
                        <span>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
