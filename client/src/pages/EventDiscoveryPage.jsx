import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  ChevronRight,
} from "lucide-react";
import DesktopLayout from "../components/DesktopLayout";
import { EventCardGrid } from "../components/EventCard";
import { mockEvents } from "../data/mockData";

const filters = ["All Events", "Tech", "Business", "Marketing", "Leadership"];

export default function EventDiscoveryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Events");

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.organizer &&
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter =
      activeFilter === "All Events" || event.category === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="flex flex-col gap-3 mb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Discover Events</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Find and register for upcoming events
          </p>
        </div>
        <button className="self-start gap-2 btn-secondary sm:self-auto">
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>
      <div className="relative mb-5">
        <Search
          size={16}
          className="absolute text-gray-400 -translate-y-1/2 left-4 top-1/2"
        />
        <input
          type="text"
          placeholder="Search events, venues, organizers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-3 pr-4 text-sm transition-all bg-white border border-gray-200 pl-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/30"
        />
      </div>
      <div className="flex items-center gap-2 pb-1 mb-6 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeFilter === f
                ? "bg-brand text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-brand hover:text-brand"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">All Events</h2>
            <p className="text-xs text-gray-400">
              {filteredEvents.length} events found
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCardGrid
                key={event.id}
                event={event}
                onClick={() => navigate(`/event/${event.id}`)}
              />
            ))}
          </div>
        </div>

        <aside className="flex-shrink-0 w-full space-y-4 xl:w-72">
          <div className="overflow-hidden card">
            <div className="relative flex items-center justify-center h-40 bg-gradient-to-br from-blue-100 to-indigo-200">
              <div className="text-center">
                <MapPin size={28} className="mx-auto mb-2 text-brand" />
                <p className="text-sm font-medium text-brand">
                  Events Near You
                </p>
                <p className="text-xs text-gray-500">New York, NY</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="mb-2 text-sm font-semibold text-gray-800">
                Nearby Venues
              </h3>
              <div className="space-y-2">
                {[
                  "Metropolitan Tech Center",
                  "Innovation Hub",
                  "Grand Ballroom",
                ].map((v) => (
                  <div
                    key={v}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <MapPin size={11} className="flex-shrink-0 text-gray-400" />
                    {v}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-800">
                Your Upcoming
              </h3>
              <button className="text-xs text-primary-600 flex items-center gap-0.5">
                All <ChevronRight size={11} />
              </button>
            </div>
            <div className="flex gap-3 pb-1 overflow-x-auto xl:flex-col xl:overflow-visible scrollbar-hide xl:pb-0">
              {mockEvents.slice(0, 3).map((event) => (
                <button
                  key={event.id}
                  onClick={() => navigate(`/event/${event.id}`)}
                  className="flex items-center gap-3 flex-shrink-0 xl:flex-shrink w-56 xl:w-auto text-left hover:bg-gray-50 rounded-lg p-1.5 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 overflow-hidden bg-gray-200 rounded-lg">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                      <Calendar size={9} />
                      <span className="truncate">{event.date}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
