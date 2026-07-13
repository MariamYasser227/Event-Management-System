import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, Share2, Heart, ArrowLeft, Star, Clock } from 'lucide-react';
import AppLayout from '../components/AppLayout';
import { mockEvents } from '../data/mockData';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e.id === Number(id)) || mockEvents[3];
  const fillPercent = Math.round((event.registered / event.capacity) * 100);

  return (
    <AppLayout>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
      >
        <ArrowLeft size={16} /> Back to Events
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left — hero + details */}
        <div className="flex-1 min-w-0">
          {/* Hero */}
          <div className="relative rounded-2xl overflow-hidden h-48 sm:h-64 md:h-80 mb-5">
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {event.tag && (
              <div className="absolute top-4 left-4">
                <span className="badge bg-amber-400 text-amber-900 text-xs font-semibold uppercase">
                  🔥 {event.tag}
                </span>
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
                <Share2 size={14} className="text-gray-700" />
              </button>
              <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow">
                <Heart size={14} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Title & organizer */}
          <div className="card p-5 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{event.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center">EL</div>
              <div>
                <p className="text-[10px] text-gray-400">Hosted by</p>
                <p className="text-sm font-semibold text-gray-700">{event.organizer}</p>
              </div>
            </div>

            {/* Key info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl">
                <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{event.date}</p>
                  <p className="text-[10px] text-gray-400">Event Date & Time</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{event.location?.split(',')[0]}</p>
                  <p className="text-[10px] text-gray-400 truncate">{event.location?.split(',').slice(1).join(',').trim()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="card p-5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Event Capacity</h2>
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                <Users size={14} />
                {event.registered} / {event.capacity}
              </div>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full rounded-full transition-all ${
                  fillPercent >= 100 ? 'bg-red-500' : fillPercent >= 80 ? 'bg-amber-400' : 'bg-brand'
                }`}
                style={{ width: `${Math.min(fillPercent, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{fillPercent}% filled</span>
              {fillPercent < 100 ? (
                <span className="text-amber-600 font-medium">Limited spots available!</span>
              ) : (
                <span className="text-red-600 font-medium">Fully booked</span>
              )}
            </div>
          </div>

          {/* About */}
          <div className="card p-5 mb-4">
            <h2 className="section-title mb-3">About the Event</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
          </div>

          {/* Rating */}
          {event.rating && (
            <div className="card p-5">
              <h2 className="section-title mb-3">Attendee Rating</h2>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold text-gray-900">{event.rating}</span>
                <div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={16} className={s <= Math.floor(event.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{event.reviews} reviews</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right — Registration Panel (sticky on large screens) */}
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="card p-5 lg:sticky lg:top-4">
            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1">Price per seat</p>
              <p className="text-3xl font-extrabold text-gray-900">
                {event.price > 0 ? `$${event.price.toFixed(2)}` : 'Free'}
              </p>
            </div>

            <button className="btn-primary w-full justify-center py-3 text-base mb-3">
              Register Now →
            </button>
            <button className="btn-secondary w-full justify-center py-2.5 text-sm">
              Save for Later
            </button>

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5">
              {[
                { icon: Clock, text: 'Registration closes 24h before event' },
                { icon: Users, text: `${event.capacity - event.registered} spots remaining` },
                { icon: MapPin, text: event.location?.split(',')[0] },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                  <Icon size={13} className="text-gray-400 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}
