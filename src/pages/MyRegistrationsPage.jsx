import { Calendar, MapPin, Clock, CheckCircle, XCircle, Ticket } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { mockEvents } from '../data/mockData';

const registrations = [
  { event: mockEvents[0], status: 'Confirmed', ticketType: 'VIP All-Access', seat: 'A-42' },
  { event: mockEvents[1], status: 'Pending', ticketType: 'Standard Pass', seat: null },
  { event: mockEvents[2], status: 'Cancelled', ticketType: 'Standard Pass', seat: null },
];

const statusStyle = {
  Confirmed: { badge: 'badge-success', icon: CheckCircle, color: 'text-green-500' },
  Pending: { badge: 'badge-warning', icon: Clock, color: 'text-amber-500' },
  Cancelled: { badge: 'badge-danger', icon: XCircle, color: 'text-red-500' },
};

export default function MyRegistrationsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="page-title">My Registrations</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your event registrations and tickets</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {['All', 'Confirmed', 'Pending', 'Cancelled'].map((t, i) => (
          <button key={t} className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            i === 0 ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
          }`}>{t}</button>
        ))}
      </div>

      {/* Cards — 1 col mobile, 2 col md, 3 col lg */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {registrations.map(({ event, status, ticketType, seat }, i) => {
          const cfg = statusStyle[status];
          const Icon = cfg.icon;
          return (
            <div key={i} className="card overflow-hidden hover:shadow-card-hover transition-shadow">
              {/* Image */}
              <div className="relative h-40">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-white font-bold text-sm leading-tight line-clamp-2">{event.title}</h3>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Icon size={12} className={cfg.color} />
                      <span className={cfg.badge + ' text-[10px] whitespace-nowrap'}>{status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Calendar size={12} className="flex-shrink-0" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin size={12} className="flex-shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700">
                    <Ticket size={12} className="text-primary-500 flex-shrink-0" />
                    <span className="font-medium">{ticketType}</span>
                  </div>
                  {seat && (
                    <span className="text-xs text-gray-400">Seat: <span className="font-semibold text-gray-700">{seat}</span></span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  {status === 'Confirmed' && (
                    <>
                      <button className="flex-1 btn-secondary text-xs py-1.5 justify-center">View Ticket</button>
                      <button className="flex-1 btn-secondary text-xs py-1.5 justify-center text-red-500 border-red-200 hover:bg-red-50">Cancel</button>
                    </>
                  )}
                  {status === 'Pending' && (
                    <button className="w-full btn-secondary text-xs py-1.5 justify-center">Check Status</button>
                  )}
                  {status === 'Cancelled' && (
                    <button className="w-full btn-primary text-xs py-1.5 justify-center">Re-register</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
