import { Calendar, Users } from 'lucide-react';

export function EventCard({ event, onClick }) {
  const fillPercent = Math.round((event.registered / event.capacity) * 100);
  const isFull = fillPercent >= 100;
  const isAlmostFull = fillPercent >= 80;

  const statusColors = {
    'OPENING SOON': 'badge-info',
    LIVE: 'badge-success',
    CLOSED: 'badge-gray',
    TRENDING: 'badge-warning',
  };

  return (
    <div
      className="card p-4 flex gap-3 cursor-pointer hover:shadow-card-hover transition-shadow duration-200"
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
        {event.image ? (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-brand flex items-center justify-center text-white text-xl font-bold">
            {event.title[0]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">{event.title}</h3>
          {event.status && (
            <span className={statusColors[event.status] || 'badge-gray'}>
              {event.status}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <Calendar size={11} />
          <span>{event.date}</span>
        </div>

        {/* Capacity bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isFull ? 'bg-red-500' : isAlmostFull ? 'bg-amber-400' : 'bg-brand'
              }`}
              style={{ width: `${Math.min(fillPercent, 100)}%` }}
            />
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
            <Users size={10} />
            <span>
              {event.registered}/{event.capacity} Filled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventCardGrid({ event, onClick }) {
  const fillPercent = Math.round((event.registered / event.capacity) * 100);
  const isFull = fillPercent >= 100;
  const isAlmostFull = fillPercent >= 80;

  return (
    <div
      className="card overflow-hidden cursor-pointer hover:shadow-card-hover transition-shadow duration-200 group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="h-40 bg-gray-200 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-brand flex items-center justify-center text-white text-3xl font-bold">
            {event.title[0]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {event.tag && (
          <span className="badge-warning text-[10px] mb-2 inline-block">{event.tag}</span>
        )}
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">{event.title}</h3>
        <p className="text-xs text-gray-500 mb-3">{event.date}</p>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                isFull ? 'bg-red-500' : isAlmostFull ? 'bg-amber-400' : 'bg-brand'
              }`}
              style={{ width: `${Math.min(fillPercent, 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{fillPercent}%</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {event.registered} / {event.capacity} registered
        </p>
      </div>
    </div>
  );
}
