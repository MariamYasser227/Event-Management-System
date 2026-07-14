import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Flame, ChevronRight, SlidersHorizontal } from 'lucide-react';
import DesktopLayout from '../components/DesktopLayout';
import { EventCard, EventCardGrid } from '../components/EventCard';
import { useAppContext } from '../context/AppContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const categories = ['All', 'Tech', 'Business', 'Marketing', 'Leadership', 'Startup'];

export default function UserHomePage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const navigate = useNavigate();
  const { events } = useAppContext();
  const featured = events[3] || events[0];
  const upcoming = events.filter((e) => e.status !== 'CLOSED');
  const containerRef = useRef(null);

  useGSAP(() => {
    // Hero banner slides up
    gsap.from('.featured-hero', {
      opacity: 0,
      scale: 0.97,
      duration: 0.7,
      ease: 'power3.out',
    });
    // Event cards stagger in from below
    gsap.from('.event-card-item', {
      opacity: 0,
      y: 28,
      duration: 0.5,
      stagger: 0.07,
      ease: 'power2.out',
      delay: 0.2,
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* Page header */}
      <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Discover Events</h1>
          <p className="text-sm text-gray-500 mt-0.5">Find and register for upcoming events</p>
        </div>
        <button className="self-start gap-2 btn-secondary sm:self-auto">
          <SlidersHorizontal size={15} />
          Filters
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={16} className="absolute text-gray-400 -translate-y-1/2 left-4 top-1/2" />
        <input
          type="text"
          placeholder="Search events, venues, organizers..."
          className="w-full py-3 pr-4 text-sm transition-all bg-white border border-gray-200 pl-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 pb-1 mb-6 overflow-x-auto scrollbar-hide">
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
            className="featured-hero relative overflow-hidden cursor-pointer rounded-2xl h-44 sm:h-56 md:h-64 lg:h-72"
            onClick={() => navigate(`/event/${featured.id}`)}
          >
            <img src={featured.image} alt={featured.title} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="badge bg-amber-400 text-amber-900 text-[11px] font-semibold uppercase tracking-wide">
                🔥 Trending Event
              </span>
            </div>
            <div className="absolute flex flex-col gap-2 bottom-4 left-4 right-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="mb-1 text-base font-bold leading-tight text-white sm:text-xl">{featured.title}</h3>
                <p className="text-sm text-white/80">{featured.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-white">${featured.price}</span>
                <button
                  className="px-5 py-2 text-sm btn-primary"
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
      <div className="flex flex-col gap-6 xl:flex-row">
        {/* Events grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">All Events</h2>
            <span className="text-xs text-gray-400">{events.length} events</span>
          </div>
          {/* Grid: 1 col mobile, 2 col sm, 3 col lg */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div key={event.id} className="event-card-item">
                <EventCardGrid
                  event={event}
                  onClick={() => navigate(`/event/${event.id}`)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Aside: stacks below on small, side on xl */}
        <aside className="flex-shrink-0 w-full space-y-4 xl:w-72">
          {/* Upcoming */}
          <div className="p-4 card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">Upcoming Events</h3>
              <button className="text-xs text-primary-600 hover:underline flex items-center gap-0.5">
                All <ChevronRight size={11} />
              </button>
            </div>
            {/* Horizontal scroll on small screens */}
            <div className="flex gap-3 pb-1 overflow-x-auto xl:flex-col xl:overflow-visible scrollbar-hide xl:pb-0">
              {upcoming.map((event) => (
                <button
                  key={event.id}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="flex items-center flex-shrink-0 w-64 gap-3 p-2 text-left transition-colors rounded-lg xl:flex-shrink xl:w-auto hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 w-10 h-10 overflow-hidden bg-gray-200 rounded-lg">
                    <img src={event.image} alt={event.title} className="object-cover w-full h-full" />
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
    </div>
  );
}
