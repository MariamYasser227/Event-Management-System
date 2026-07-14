import { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Ticket,
  Star,
  MessageSquare,
  Download,
  Share2,
  X,
} from "lucide-react";
import { mockEvents } from "../data/mockData";

const registrations = [
  {
    event: mockEvents[0],
    status: "Confirmed",
    ticketType: "VIP All-Access",
    seat: "A-42",
  },
  {
    event: mockEvents[1],
    status: "Attended",
    ticketType: "Standard Pass",
    seat: null,
  },
  {
    event: mockEvents[2],
    status: "Pending",
    ticketType: "Standard Pass",
    seat: null,
  },
  {
    event: mockEvents[3],
    status: "Cancelled",
    ticketType: "Standard Pass",
    seat: null,
  },
];

const statusStyle = {
  Confirmed: {
    badge: "bg-brand text-white",
    icon: CheckCircle,
    color: "text-brand",
  },
  Attended: {
    badge: "bg-gray-100 text-gray-700",
    icon: CheckCircle,
    color: "text-gray-500",
  },
  Pending: {
    badge: "bg-amber-100 text-amber-700",
    icon: Clock,
    color: "text-amber-500",
  },
  Cancelled: {
    badge: "bg-red-100 text-red-700",
    icon: XCircle,
    color: "text-red-500",
  },
};

export default function MyRegistrationsPage() {
  const [activeTab, setActiveTab] = useState("All Events");
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedEventForReview, setSelectedEventForReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  const tabs = ["All Events", "Upcoming", "Attended", "Cancelled"];

  const filteredRegistrations = registrations.filter((reg) => {
    if (activeTab === "All Events") return true;
    if (activeTab === "Upcoming")
      return reg.status === "Confirmed" || reg.status === "Pending";
    if (activeTab === "Attended") return reg.status === "Attended";
    if (activeTab === "Cancelled") return reg.status === "Cancelled";
    return true;
  });

  const openReviewModal = (event) => {
    setSelectedEventForReview(event);
    setRating(0);
    setReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setReviewModalOpen(false);
    setSelectedEventForReview(null);
  };

  return (
    <>
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">My Registrations</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your upcoming and past event attendances.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pb-1 mb-6 overflow-x-auto scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === t
                ? "bg-brand text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRegistrations.map(({ event, status, ticketType, seat }, i) => {
          const cfg = statusStyle[status];
          const isAttended = status === "Attended";

          return (
            <div
              key={i}
              className="flex flex-col overflow-hidden transition-shadow bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md"
            >
              <div className="relative h-48">
                <img
                  src={event.image}
                  alt={event.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${cfg.badge}`}
                  >
                    {status === "Confirmed" ? "Registered" : status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-5">
                <h3 className="mb-3 text-lg font-bold text-gray-900 line-clamp-1">
                  {event.title}
                </h3>

                <div className="flex-1 mb-5 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{event.date}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  {status === "Confirmed" && (
                    <>
                      <button className="flex-1 py-2 text-sm text-white transition-colors rounded-lg bg-brand hover:bg-indigo-800">
                        View Ticket
                      </button>
                      <button className="p-2 text-gray-500 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Share2 size={18} />
                      </button>
                    </>
                  )}
                  {status === "Attended" && (
                    <>
                      <button
                        onClick={() => openReviewModal(event)}
                        className="flex items-center justify-center flex-1 gap-2 py-2 text-sm text-white transition-colors rounded-lg bg-brand hover:bg-indigo-800"
                      >
                        <MessageSquare size={14} />
                        Rate & Review
                      </button>
                      <button className="p-2 text-gray-500 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Download size={18} />
                      </button>
                      <button className="p-2 text-gray-500 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                        <MessageSquare size={18} />
                      </button>
                    </>
                  )}
                  {status === "Pending" && (
                    <button className="w-full py-2 text-sm transition-colors border rounded-lg text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100">
                      Check Status
                    </button>
                  )}
                  {status === "Cancelled" && (
                    <button className="w-full py-2 text-sm text-white transition-colors rounded-lg bg-brand hover:bg-indigo-800">
                      Re-register
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden bg-white shadow-xl rounded-2xl animate-fade-in-up">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                Submit Feedback
              </h2>
              <button
                onClick={closeReviewModal}
                className="p-1 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6 text-center">
                <p className="mb-1 text-sm font-medium text-gray-600">
                  {selectedEventForReview?.title}
                </p>
                <p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Rate Your Experience
                </p>

                <div className="flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform focus:outline-none hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={`transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "text-brand fill-brand"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                  Your Review
                </label>
                <textarea
                  rows={4}
                  placeholder="Share your thoughts about the event..."
                  className="w-full p-3 text-sm text-gray-700 transition-all border border-gray-200 resize-none bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand"
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeReviewModal}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    closeReviewModal();
                  }}
                  disabled={rating === 0}
                  className={`flex-1 py-2.5 text-sm font-medium text-white rounded-xl transition-colors ${
                    rating > 0
                      ? "bg-brand hover:bg-indigo-800"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
