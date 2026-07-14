import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Eye, ChevronRight, Star } from 'lucide-react';
import DesktopLayout from '../components/DesktopLayout';
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
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
        <button onClick={() => navigate('/events')} className="transition-colors hover:text-brand">Events</button>
        <ChevronRight size={12} />
        <span className="font-medium text-gray-800">{event.title}</span>
      </div>

      {/* Page header */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="page-title">Manage Event</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button className="gap-2 text-sm btn-secondary">
            <Eye size={15} /> Preview Page
          </button>
          <button className="gap-2 text-sm btn-primary">
            <QrCode size={15} /> Scan QR to Check-In
          </button>
        </div>
      </div>

      {/* Main grid: stacked on mobile, side-by-side on xl */}
      <div className="flex flex-col gap-5 xl:flex-row">
        {/* Left column */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* Registration Health */}
          <div className="p-5 card">
            <h2 className="mb-4 section-title">Registration Health</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs badge-gray">CAPACITY</span>
              <span className="text-3xl font-bold text-gray-900">{fillPercent}%</span>
            </div>
            <div className="h-3 mb-2 overflow-hidden bg-gray-100 rounded-full">
              <div className="h-full rounded-full bg-brand" style={{ width: `${fillPercent}%` }} />
            </div>
            <p className="mb-4 text-sm text-gray-500">1,260 of 1,500 tickets sold</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="mb-1 text-xs text-gray-500">Check-ins</p>
                <p className="text-2xl font-bold text-gray-900">412</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="mb-1 text-xs text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">$248k</p>
              </div>
            </div>
          </div>

          {/* Event Cover */}
          <div className="p-5 card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Event Cover</h2>
              <button className="text-sm font-medium text-primary-600 hover:underline">Change</button>
            </div>
            <div className="h-40 overflow-hidden sm:h-48 rounded-xl">
              <img src={event.image} alt="Event Cover" className="object-cover w-full h-full" />
            </div>
          </div>

          {/* Registrants Table — scrollable on small */}
          <div className="overflow-hidden card">
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
                    <tr key={r.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center justify-center flex-shrink-0 text-xs font-semibold rounded-full w-7 h-7 bg-primary-100 text-primary-700">
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
            <div className="flex items-center justify-between px-5 py-3 text-xs text-gray-500 border-t border-gray-100">
              <span>Showing 5 of 1,260</span>
              <div className="flex gap-2">
                <button className="font-medium text-primary-600">← Prev</button>
                <button className="font-medium text-primary-600">Next →</button>
              </div>
            </div>
          </div>

          {/* Attendee Feedback */}
          <div className="p-5 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Attendee Feedback</h2>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-amber-400">4.8</span>
                <StarRating rating={5} />
                <span className="text-xs text-gray-400">(104)</span>
              </div>
            </div>
            <div className="space-y-4">
              {mockFeedback.map((f) => (
                <div key={f.id} className="flex items-start gap-3">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-xs font-bold text-white rounded-full bg-brand">
                    {f.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-semibold text-gray-800">{f.name}</p>
                      <p className="text-[10px] text-gray-400">{f.date}</p>
                    </div>
                    <StarRating rating={f.rating} />
                    <p className="mt-1 text-xs italic text-gray-600">{f.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-xs font-medium text-center text-primary-600 hover:underline">
              View All Feedback
            </button>
          </div>
        </div>

        {/* Right panel — tabbed edit form */}
        <div className="flex-shrink-0 w-full space-y-4 xl:w-80">
          <div className="p-5 card">
            <div className="flex gap-4 mb-4 overflow-x-auto border-b border-gray-100 scrollbar-hide">
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
                  <textarea className="text-xs resize-none input-field h-28" defaultValue="The Global Tech Summit 2024 is the premier gathering for technology professionals worldwide. Join us for three days of keynote presentations from Fortune 500 CEOs, and unparalleled networking opportunities." />
                </div>
                <div className="flex gap-2 pt-1">
                  <button className="justify-center flex-1 py-2 text-xs btn-secondary">Discard</button>
                  <button className="justify-center flex-1 py-2 text-xs btn-primary">Save Changes</button>
                </div>
              </div>
            )}
            {activeTab !== 'Details' && (
              <div className="flex items-center justify-center h-32 text-sm text-gray-400">
                {activeTab} settings coming soon
              </div>
            )}
          </div>

          <div className="p-3 space-y-1 card">
            <button className="w-full text-xs nav-item-inactive">❓ Help Center</button>
            <button className="w-full text-xs text-red-500 nav-item-inactive hover:bg-red-50 hover:text-red-600">↗ Log Out</button>
          </div>
        </div>
      </div>
    </>
  );
}
