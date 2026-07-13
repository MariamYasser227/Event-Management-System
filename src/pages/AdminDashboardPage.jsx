import { Users, CalendarCheck, DollarSign, ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { mockUser } from '../data/mockData';

const stats = [
  { label: 'Total Users', value: '4,281', change: '+142 this week', icon: Users, color: 'bg-indigo-50 text-indigo-600' },
  { label: 'Active Events', value: '87', change: '12 ending soon', icon: CalendarCheck, color: 'bg-green-50 text-green-600' },
  { label: 'Platform Revenue', value: '$186k', change: '+22% this month', icon: DollarSign, color: 'bg-amber-50 text-amber-600' },
  { label: 'Pending Reviews', value: '12', change: '3 high priority', icon: ShieldCheck, color: 'bg-red-50 text-red-600' },
];

const recentUsers = [
  { name: 'Jane Doe', email: 'jane@corp.com', role: 'Organizer', joined: 'Oct 01', status: 'Active' },
  { name: 'Alex Smith', email: 'alex@startup.io', role: 'Attendee', joined: 'Sep 28', status: 'Active' },
  { name: 'Michael Lee', email: 'ml@org.net', role: 'Admin', joined: 'Sep 25', status: 'Active' },
  { name: 'Sarah Johnson', email: 'sarah@tech.com', role: 'Organizer', joined: 'Oct 03', status: 'Pending' },
  { name: 'Tom Wilson', email: 'tom@events.io', role: 'Attendee', joined: 'Oct 05', status: 'Suspended' },
];

const alerts = [
  { type: 'warning', message: '3 events pending approval for over 48 hours', time: '2h ago' },
  { type: 'danger', message: 'Unusual payment activity detected on REQ-8812', time: '4h ago' },
  { type: 'info', message: 'Platform backup completed successfully', time: '6h ago' },
];

function MiniBarChart({ data }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-20">
      {data.map((v, i) => (
        <div key={i} className={`flex-1 rounded-t min-w-0 ${i === data.length - 1 ? 'bg-brand' : 'bg-primary-200'}`} style={{ height: `${(v / max) * 100}%` }} />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Platform overview and management</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn-secondary text-sm">Export Report</button>
          <button className="btn-primary text-sm">System Settings</button>
        </div>
      </div>

      {/* Stats: 2 col mobile, 4 col lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div key={label} className="card p-4">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={17} />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            <p className="text-[10px] text-gray-400 mt-1">{change}</p>
          </div>
        ))}
      </div>

      {/* Chart + alerts: stacked then side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-5">
        <div className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Platform Revenue</h2>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-green-500" />
              <span className="text-xs text-green-600 font-medium">+22% MoM</span>
            </div>
          </div>
          <MiniBarChart data={[40,65,50,90,70,110,85,130,100,155,120,175,145,195]} />
          <div className="flex justify-between mt-2 text-[10px] text-gray-400">
            {['Jan','Feb','Mar','Apr','May','Jun','Jul'].map(m => <span key={m}>{m}</span>)}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-amber-500" />
            <h2 className="section-title">System Alerts</h2>
          </div>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className={`p-3 rounded-xl text-xs ${
                a.type === 'warning' ? 'bg-amber-50 border border-amber-100' :
                a.type === 'danger' ? 'bg-red-50 border border-red-100' :
                'bg-blue-50 border border-blue-100'
              }`}>
                <p className={`font-medium ${a.type === 'warning' ? 'text-amber-700' : a.type === 'danger' ? 'text-red-700' : 'text-blue-700'}`}>
                  {a.message}
                </p>
                <p className="text-gray-400 mt-0.5">{a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Users table — horizontal scroll on mobile */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="section-title">Recent Users</h2>
          <button className="text-xs text-primary-600 font-medium hover:underline">View All Users</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[500px]">
            <thead>
              <tr className="bg-gray-50">
                {['User','Role','Joined','Status','Actions'].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentUsers.map((u, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 whitespace-nowrap">{u.name}</p>
                        <p className="text-gray-400 text-[10px]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={u.role === 'Admin' ? 'badge-danger' : u.role === 'Organizer' ? 'badge-info' : 'badge-gray'}>{u.role}</span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{u.joined}</td>
                  <td className="px-5 py-3">
                    <span className={u.status === 'Active' ? 'badge-success' : u.status === 'Pending' ? 'badge-warning' : 'badge-danger'}>{u.status}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs text-primary-600 hover:underline">Edit</button>
                      <button className="text-xs text-red-600 hover:underline">Suspend</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
