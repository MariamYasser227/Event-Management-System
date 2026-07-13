import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Calendar, ChevronRight } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { EventCardGrid } from '../components/EventCard';
import { mockEvents, mockUser } from '../data/mockData';

const filters = ['All Events', 'Tech', 'Business', 'Marketing', 'Leadership'];

export default function EventDiscoveryPage() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="page-title">Discover Events</h1>
          <p className="text-sm text-gray-500 mt-0.5">Find and register for upcoming events</p>
        </div>
        <button className="btn-secondary gap-2 self-start sm:self-auto">
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search events, venues, organizers..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all"
        />
      </div>

      {/* Category filters — scrollable on small */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {filters.map((f, i) => (
          <button
            key={f}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              i === 0 ? 'bg-brand text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Layout: events grid + aside */}
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">All Events</h2>
            <p className="text-xs text-gray-400">{mockEvents.length} events found</p>
          </div>
          {/* Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockEvents.map((event) => (
              <EventCardGrid
                key={event.id}
                event={event}
                onClick={() => navigate(`/event/${event.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Aside */}
        <aside className="w-full xl:w-72 flex-shrink-0 space-y-4">
          {/* Map */}
          <div className="card overflow-hidden">
            <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center relative">
              <div className="text-center">
                <MapPin size={28} className="text-brand mx-auto mb-2" />
                <p className="text-sm font-medium text-brand">Events Near You</p>
                <p className="text-xs text-gray-500">New York, NY</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Nearby Venues</h3>
              <div className="space-y-2">
                {['Metropolitan Tech Center','Innovation Hub','Grand Ballroom'].map(v => (
                  <div key={v} className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin size={11} className="text-gray-400 flex-shrink-0" />{v}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming highlights */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Your Upcoming</h3>
              <button className="text-xs text-primary-600 flex items-center gap-0.5">All <ChevronRight size={11}/></button>
            </div>
            {/* Horizontal scroll on small, vertical on xl */}
            <div className="flex xl:flex-col gap-3 overflow-x-auto xl:overflow-visible scrollbar-hide pb-1 xl:pb-0">
              {mockEvents.slice(0, 3).map((event) => (
                <button
                  key={event.id}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="flex items-center gap-3 flex-shrink-0 xl:flex-shrink w-56 xl:w-auto text-left hover:bg-gray-50 rounded-lg p-1.5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{event.title}</p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                      <Calendar size={9} /><span className="truncate">{event.date}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
