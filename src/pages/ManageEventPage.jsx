import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Eye, ChevronRight, Star } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { mockEvents, mockUser, mockRegistrants, mockFeedback } from '../data/mockData';

const tabs = ['Details', 'Schedule', 'Speakers', 'Settings'];
const statusStyle = {
  'Checked In': 'badge-success',
  Pending: 'badge-warning',
  Waiting: 'badge-info',
  Waitlist: 'badge-gray',
  Cancelled: 'badge-danger',
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <span key={s} className={`text-sm ${s <= rating ? 'text-amber-400' : 'text-gray-300'}`}>★</span>
      ))}
    </div>
  );
}

export default function ManageEventPage() {
  const [activeTab, setActiveTab] = useState('Details');
  const navigate = useNavigate();
  const event = mockEvents[0];
  const fillPercent = 84;

  return (
    <AppLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <button onClick={() => navigate('/events')} className="hover:text-brand transition-colors">Events</button>
        <ChevronRight size={12} />
        <span className="text-gray-800 font-medium">{event.title}</span>
      </div>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="page-title">Manage Event</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-secondary gap-2 text-sm">
            <Eye size={15} /> Preview Page
          </button>
          <button className="btn-primary gap-2 text-sm">
            <QrCode size={15} /> Scan QR to Check-In
          </button>
        </div>
      </div>

      {/* Main grid: stacked on mobile, side-by-side on xl */}
      <div className="flex flex-col xl:flex-row gap-5">
        {/* Left column */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Registration Health */}
          <div className="card p-5">
            <h2 className="section-title mb-4">Registration Health</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="badge-gray text-xs">CAPACITY</span>
              <span className="text-3xl font-bold text-gray-900">{fillPercent}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-brand rounded-full" style={{ width: `${fillPercent}%` }} />
            </div>
            <p className="text-sm text-gray-500 mb-4">1,260 of 1,500 tickets sold</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Check-ins</p>
                <p className="text-2xl font-bold text-gray-900">412</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$248k</p>
              </div>
            </div>
          </div>

          {/* Event Cover */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Event Cover</h2>
              <button className="text-sm text-primary-600 font-medium hover:underline">Change</button>
            </div>
            <div className="h-40 sm:h-48 rounded-xl overflow-hidden">
              <img src={event.image} alt="Event Cover" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Registrants Table — scrollable on small */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="section-title">Registrants</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50">
                    {['Attendee Name','Ticket Type','Payment','Status',''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockRegistrants.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                            {r.initials}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{r.name}</p>
                            <p className="text-gray-400 text-[10px]">{r.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{r.ticket}</td>
                      <td className="px-4 py-3">
                        <span className={r.payment === 'Paid' ? 'badge-success' : r.payment === 'Pending' ? 'badge-warning' : 'badge-gray'}>
                          {r.payment}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={statusStyle[r.status] || 'badge-gray'}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-gray-400 hover:text-gray-600">⋮</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Showing 5 of 1,260</span>
              <div className="flex gap-2">
                <button className="text-primary-600 font-medium">← Prev</button>
                <button className="text-primary-600 font-medium">Next →</button>
              </div>
            </div>
          </div>

          {/* Attendee Feedback */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Attendee Feedback</h2>
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold text-sm">4.8</span>
                <StarRating rating={5} />
                <span className="text-xs text-gray-400">(104)</span>
              </div>
            </div>
            <div className="space-y-4">
              {mockFeedback.map((f) => (
                <div key={f.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {f.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-semibold text-gray-800">{f.name}</p>
                      <p className="text-[10px] text-gray-400">{f.date}</p>
                    </div>
                    <StarRating rating={f.rating} />
                    <p className="text-xs text-gray-600 mt-1 italic">{f.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-xs text-primary-600 font-medium hover:underline w-full text-center">
              View All Feedback
            </button>
          </div>
        </div>

        {/* Right panel — tabbed edit form */}
        <div className="w-full xl:w-80 flex-shrink-0 space-y-4">
          <div className="card p-5">
            <div className="flex border-b border-gray-100 mb-4 gap-4 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeTab === tab ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {activeTab === 'Details' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Event Title</label>
                  <input className="input-field" defaultValue="Global Tech Summit 2024" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                  <textarea className="input-field resize-none h-28 text-xs" defaultValue="The Global Tech Summit 2024 is the premier gathering for technology professionals worldwide. Join us for three days of keynote presentations from Fortune 500 CEOs, and unparalleled networking opportunities." />
                </div>
                <div className="flex gap-2 pt-1">
                  <button className="btn-secondary flex-1 justify-center text-xs py-2">Discard</button>
                  <button className="btn-primary flex-1 justify-center text-xs py-2">Save Changes</button>
                </div>
              </div>
            )}
            {activeTab !== 'Details' && (
              <div className="flex items-center justify-center h-32 text-sm text-gray-400">
                {activeTab} settings coming soon
              </div>
            )}
          </div>

          <div className="card p-3 space-y-1">
            <button className="nav-item-inactive w-full text-xs">❓ Help Center</button>
            <button className="nav-item-inactive w-full text-xs text-red-500 hover:bg-red-50 hover:text-red-600">↗ Log Out</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
