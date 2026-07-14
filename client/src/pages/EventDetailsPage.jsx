import { useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Share2,
  Heart,
  ArrowLeft,
  Star,
  Clock,
  AlertCircle,
} from "lucide-react";
import { mockEvents } from "../data/mockData";

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const context = useOutletContext();
  const role = context?.role || "user";

  const event = mockEvents.find((e) => e.id === Number(id));

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle size={48} className="text-gray-300" />
        <h2 className="text-xl font-bold text-gray-700">Event Not Found</h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    );
  }

  const fillPercent =
    event.capacity > 0
      ? Math.min(Math.round((event.registered / event.capacity) * 100), 100)
      : 100;

  const organizerInitials = event.organizer
    ? event.organizer
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "EV";

  return (
    <>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-5 text-sm text-gray-500 transition-colors hover:text-gray-800"
      >
        <ArrowLeft size={16} /> Back to Events
      </button>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1 min-w-0">
          <div className="relative h-48 mb-5 overflow-hidden rounded-2xl sm:h-64 md:h-80">
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

            {event.tag && (
              <div className="absolute top-4 left-4">
                <span className="text-xs font-semibold uppercase badge bg-amber-400 text-amber-900">
                  🔥 {event.tag}
                </span>
              </div>
            )}

            <div className="absolute flex gap-2 top-4 right-4">
              <button className="flex items-center justify-center w-8 h-8 transition-colors rounded-full shadow bg-white/90 hover:bg-white">
                <Share2 size={14} className="text-gray-700" />
              </button>
              <button
                onClick={() => setIsLiked(!isLiked)}
                className="flex items-center justify-center w-8 h-8 transition-colors rounded-full shadow bg-white/90 hover:bg-white"
              >
                <Heart
                  size={14}
                  className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-700"}`}
                />
              </button>
            </div>
          </div>

          <div className="p-5 mb-4 card">
            <h1 className="mb-2 text-xl font-bold text-gray-900 sm:text-2xl">
              {event.title}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center text-xs font-bold text-white rounded-full w-7 h-7 bg-brand">
                {organizerInitials}
              </div>
              <div>
                <p className="text-[10px] text-gray-400">Hosted by</p>
                <p className="text-sm font-semibold text-gray-700">
                  {event.organizer || "Independent Organizer"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
                <div className="flex items-center justify-center flex-shrink-0 font-bold text-white rounded-lg w-9 h-9 bg-brand">
                  <Calendar size={16} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    {event.date}
                  </p>
                  <p className="text-[10px] text-gray-400">Event Date & Time</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center flex-shrink-0 bg-gray-200 rounded-lg w-9 h-9">
                  <MapPin size={16} className="text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {event.location?.split(",")[0] || "Online / TBD"}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {event.location?.split(",").slice(1).join(",").trim() || ""}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 mb-4 card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Event Capacity</h2>
              <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                <Users size={14} />
                {event.registered || 0} / {event.capacity || 0}
              </div>
            </div>
            <div className="h-3 mb-2 overflow-hidden bg-gray-100 rounded-full">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-in-out ${
                  fillPercent >= 100
                    ? "bg-red-500"
                    : fillPercent >= 80
                      ? "bg-amber-400"
                      : "bg-brand"
                }`}
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{fillPercent}% filled</span>
              {fillPercent < 100 ? (
                <span className="font-medium text-amber-600">
                  Limited spots available!
                </span>
              ) : (
                <span className="font-medium text-red-600">Fully booked</span>
              )}
            </div>
          </div>

          <div className="p-5 mb-4 card">
            <h2 className="mb-3 section-title">About the Event</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              {event.description || "No description provided for this event."}
            </p>
          </div>

          {event.rating && (
            <div className="p-5 card">
              <h2 className="mb-3 section-title">Attendee Rating</h2>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold text-gray-900">
                  {event.rating}
                </span>
                <div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className={
                          s <= Math.floor(event.rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {event.reviews || 0} reviews
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="flex-shrink-0 w-full lg:w-80">
          <div className="p-5 card lg:sticky lg:top-4">
            <div className="mb-4">
              <p className="mb-1 text-xs text-gray-400">Price per seat</p>
              <p className="text-3xl font-extrabold text-gray-900">
                {event.price > 0 ? `$${event.price.toFixed(2)}` : "Free"}
              </p>
            </div>

            {role === "user" ? (
              <button
                disabled={fillPercent >= 100}
                className={`justify-center w-full py-3 mb-3 text-base ${fillPercent >= 100 ? "bg-gray-300 text-gray-500 cursor-not-allowed rounded-lg" : "btn-primary"}`}
              >
                {fillPercent >= 100 ? "Sold Out" : "Register Now →"}
              </button>
            ) : (
              <button
                onClick={() => navigate("/manage-event")}
                className="justify-center w-full py-3 mb-3 text-base font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Manage Event
              </button>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5">
              {[
                { icon: Clock, text: "Registration closes 24h before event" },
                {
                  icon: Users,
                  text: `${Math.max((event.capacity || 0) - (event.registered || 0), 0)} spots remaining`,
                },
                {
                  icon: MapPin,
                  text: event.location?.split(",")[0] || "Online",
                },
              ].map(({ icon: Icon, text }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs text-gray-500"
                >
                  <Icon size={13} className="flex-shrink-0 text-gray-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
