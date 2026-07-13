import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Flame, ChevronRight, SlidersHorizontal } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { EventCard, EventCardGrid } from '../components/EventCard';
import { mockEvents } from '../data/mockData';

const categories = ['All', 'Tech', 'Business', 'Marketing', 'Leadership', 'Startup'];

export default function UserHomePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  const featured = mockEvents[3];
  const upcoming = mockEvents.filter((e) => e.status !== 'CLOSED');

  return (
    <AppLayout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="page-title">Discover Events</h1>
          <p className="text-sm text-gray-500 mt-0.5">Find and register for upcoming events</p>
        </div>
        <button className="btn-secondary gap-2 self-start sm:self-auto">
          <SlidersHorizontal size={15} />
          Filters
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search events, venues, organizers..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-brand text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-brand hover:text-brand'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured / Trending hero — responsive height */}
      <section className="mb-8">
        <div className="flex items-center gap-1.5 mb-3">
          <Flame size={15} className="text-amber-500" />
          <h2 className="text-base font-bold text-gray-900">Trending Now</h2>
        </div>
        {featured && (
          <div
            className="relative rounded-2xl overflow-hidden h-44 sm:h-56 md:h-64 lg:h-72 cursor-pointer"
            onClick={() => navigate(`/event/${featured.id}`)}
          >
            <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="badge bg-amber-400 text-amber-900 text-[11px] font-semibold uppercase tracking-wide">
                🔥 Trending Event
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
              <div>
                <h3 className="text-white font-bold text-base sm:text-xl leading-tight mb-1">{featured.title}</h3>
                <p className="text-white/80 text-sm">{featured.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-bold text-lg">${featured.price}</span>
                <button
                  className="btn-primary text-sm px-5 py-2"
                  onClick={(e) => { e.stopPropagation(); navigate(`/event/${featured.id}`); }}
                >
                  Register →
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Two-column responsive layout */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Events grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">All Events</h2>
            <span className="text-xs text-gray-400">{mockEvents.length} events</span>
          </div>
          {/* Grid: 1 col mobile, 2 col sm, 3 col lg */}
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

        {/* Aside: stacks below on small, side on xl */}
        <aside className="w-full xl:w-72 flex-shrink-0 space-y-4">
          {/* Upcoming */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Upcoming Events</h3>
              <button className="text-xs text-primary-600 hover:underline flex items-center gap-0.5">
                All <ChevronRight size={11} />
              </button>
            </div>
            {/* Horizontal scroll on small screens */}
            <div className="flex xl:flex-col gap-3 overflow-x-auto xl:overflow-visible scrollbar-hide pb-1 xl:pb-0">
              {upcoming.map((event) => (
                <button
                  key={event.id}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="flex items-center gap-3 flex-shrink-0 xl:flex-shrink text-left w-64 xl:w-auto hover:bg-gray-50 rounded-lg p-2 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{event.title}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate">{event.date}</p>
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
