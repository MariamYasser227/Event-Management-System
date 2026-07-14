import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  QrCode,
  Eye,
  ChevronRight,
  X,
  Plus,
  Trash2,
  Ban,
  UserCheck,
  Search,
  Sliders,
  DollarSign,
} from "lucide-react";
import Toast from "../components/Toast";
import { useAppContext } from "../context/AppContext";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const statusStyle = {
  "Checked In": "badge-success",
  Pending: "badge-warning",
  Waiting: "badge-info",
  Waitlist: "badge-gray",
  Cancelled: "badge-danger",
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-sm ${s <= rating ? "text-amber-400" : "text-gray-300"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ManageEventPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    myEvents: events,
    setEvents,
    registrants,
    setRegistrants,
    feedback,
    setFeedback,
  } = useAppContext();

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const containerRef = useRef(null);
  
  // Selected event calculation
  const eventId = searchParams.get("id");
  const event = events.find((e) => e.id === Number(eventId)) || events[0];

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  // Local Tab States
  const [activeTab, setActiveTab] = useState("Details");

  useGSAP(() => {
    gsap.from(".manage-left", {
      opacity: 0,
      x: -24,
      duration: 0.65,
      ease: "power3.out",
    });
    gsap.from(".manage-right", {
      opacity: 0,
      x: 24,
      duration: 0.65,
      ease: "power3.out",
      delay: 0.1,
    });
  }, { scope: containerRef, dependencies: [eventId] });
  
  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeRowMenu, setActiveRowMenu] = useState(null);

  // Search/Filter for attendees
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [attendeeFilter, setAttendeeFilter] = useState("All");

  // Tabs Mock States (Local for simplicity but initialized from event ID to look realistic)
  const [schedule, setSchedule] = useState([
    { id: 1, time: "09:00 AM", title: "Opening Keynote: Event Management Future", speaker: "Mariam Yasser" },
    { id: 2, time: "10:30 AM", title: "Networking & Coffee Break", speaker: "All Attendees" },
    { id: 3, time: "11:15 AM", title: "Scale Operations with Automation", speaker: "Jane Doe" },
  ]);

  const [speakers, setSpeakers] = useState([
    { id: 1, name: "Mariam Yasser", title: "VP of Product", company: "EventLogix", initials: "MY" },
    { id: 2, name: "Jane Doe", title: "Operations Director", company: "TechCorp", initials: "JD" },
  ]);

  const [feedbackInput, setFeedbackInput] = useState("");

  // Force loading state updates if we navigate between different events
  useEffect(() => {
    if (event) {
      setSchedule([
        { id: 1, time: "09:00 AM", title: `Opening Session at ${event.title}`, speaker: event.organizer || "Host" },
        { id: 2, time: "11:00 AM", title: "Interactive Workshop Panel", speaker: "Industry Experts" },
        { id: 3, time: "02:00 PM", title: "Q&A and Networking Wrap-up", speaker: "All Speakers" },
      ]);
      setSpeakers([
        { id: 1, name: "Mariam Yasser", title: "Operations Lead", company: event.organizer || "EventLogix", initials: "MY" },
        { id: 2, name: "Dr. Alex Smith", title: "Guest Speaker", company: "Strategic Corp", initials: "AS" },
      ]);
    }
  }, [event?.id, event?.title, event?.organizer, event]);

  // Form states initialized with event
  const [formTitle, setFormTitle] = useState(event?.title || "");
  const [formDate, setFormDate] = useState(event?.date || "");
  const [formPrice, setFormPrice] = useState(event?.price || 0);
  const [formCapacity, setFormCapacity] = useState(event?.capacity || 100);
  const [formLocation, setFormLocation] = useState(event?.location || "");
  const [formDesc, setFormDesc] = useState(event?.description || "");

  useEffect(() => {
    if (event) {
      setFormTitle(event.title);
      setFormDate(event.date);
      setFormPrice(event.price);
      setFormCapacity(event.capacity);
      setFormLocation(event.location);
      setFormDesc(event.description);
    }
  }, [event]);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 bg-white p-6 rounded-xl border">
        <Ban size={48} className="text-gray-300" />
        <h2 className="text-xl font-bold text-gray-700">No Events Available</h2>
        <button onClick={() => navigate("/dashboard")} className="btn-primary">
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Capacity calculations
  const eventRegistrants = registrants; // for mock, let's display global registrations, or filter if we like.
  const checkedInCount = eventRegistrants.filter((r) => r.status === "Checked In").length;
  const fillPercent = event.capacity > 0 ? Math.min(Math.round((event.registered / event.capacity) * 100), 100) : 0;
  const totalRevenue = event.registered * event.price;

  // Handlers
  const handleSaveDetails = (e) => {
    e.preventDefault();
    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? {
              ...e,
              title: formTitle,
              date: formDate,
              price: parseFloat(formPrice) || 0,
              capacity: parseInt(formCapacity) || 100,
              location: formLocation,
              description: formDesc,
            }
          : e
      )
    );
    triggerToast("Event details saved successfully!");
  };

  const handleDiscardDetails = () => {
    setFormTitle(event.title);
    setFormDate(event.date);
    setFormPrice(event.price);
    setFormCapacity(event.capacity);
    setFormLocation(event.location);
    setFormDesc(event.description);
    triggerToast("Changes discarded.", "warning");
  };

  // Schedule functions
  const handleAddSchedule = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const time = formData.get("time");
    const title = formData.get("title");
    const speaker = formData.get("speaker");

    setSchedule((prev) => [
      ...prev,
      { id: Date.now(), time, title, speaker },
    ]);
    e.currentTarget.reset();
    triggerToast("Timeline session added.");
  };

  const handleDeleteSchedule = (id) => {
    setSchedule((prev) => prev.filter((s) => s.id !== id));
    triggerToast("Timeline session removed.", "error");
  };

  // Speaker functions
  const handleAddSpeaker = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const title = formData.get("title");
    const company = formData.get("company");
    const initials = name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

    setSpeakers((prev) => [
      ...prev,
      { id: Date.now(), name, title, company, initials },
    ]);
    e.currentTarget.reset();
    triggerToast("Speaker added successfully.");
  };

  const handleDeleteSpeaker = (id) => {
    setSpeakers((prev) => prev.filter((s) => s.id !== id));
    triggerToast("Speaker removed.", "error");
  };

  // Registrant Action Menu functions
  const handleUpdateRegistrantStatus = (id, newStatus) => {
    setRegistrants((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          triggerToast(`Attendee ${r.name} status updated to: ${newStatus}`);
          return { ...r, status: newStatus };
        }
        return r;
      })
    );
    setActiveRowMenu(null);
  };

  const handleMarkPaymentPaid = (id) => {
    setRegistrants((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          triggerToast(`Payment marked as Paid for ${r.name}`);
          return { ...r, payment: "Paid" };
        }
        return r;
      })
    );
    setActiveRowMenu(null);
  };

  const handleCancelRegistration = (id) => {
    setRegistrants((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          triggerToast(`Registration cancelled for ${r.name}`, "error");
          
          // Decrement registered count in events
          setEvents((prevEvents) =>
            prevEvents.map((ev) =>
              ev.id === event.id ? { ...ev, registered: Math.max(0, ev.registered - 1) } : ev
            )
          );
          
          return { ...r, status: "Cancelled" };
        }
        return r;
      })
    );
    setActiveRowMenu(null);
  };

  // QR check-in simulation
  const handleQRCheckIn = (attendeeId) => {
    const attendee = registrants.find((r) => r.id === parseInt(attendeeId));
    if (!attendee) return;

    setRegistrants((prev) =>
      prev.map((r) => (r.id === attendee.id ? { ...r, status: "Checked In", payment: "Paid" } : r))
    );

    // Increment registered count if status was cancelled
    if (attendee.status === "Cancelled") {
      setEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === event.id ? { ...ev, registered: ev.registered + 1 } : ev
        )
      );
    }

    triggerToast(`Scanned Ticket: ${attendee.name} checked in!`, "success");
    setIsScannerOpen(false);
  };

  // Settings tab updates
  const handleSettingsSave = (visibility, ticketStatus) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === event.id ? { ...ev, status: ticketStatus === "Open" ? "LIVE" : "CLOSED" } : ev
      )
    );
    triggerToast(`Settings saved. Event status is now: ${ticketStatus === "Open" ? "LIVE" : "CLOSED"}`);
  };

  // Feedback submit simulation
  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (!feedbackInput.trim()) return;

    const newFeedback = {
      id: Date.now(),
      name: "Attendee Guest",
      initials: "AG",
      rating: 5,
      date: "Today",
      comment: `"${feedbackInput}"`,
    };

    setFeedback((prev) => [newFeedback, ...prev]);
    setFeedbackInput("");
    triggerToast("Mock attendee feedback submitted!");
  };

  // Filter attendees list
  const filteredRegistrants = eventRegistrants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(attendeeSearch.toLowerCase()) ||
      r.ticket.toLowerCase().includes(attendeeSearch.toLowerCase());

    const matchesStatus = attendeeFilter === "All" || r.status === attendeeFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div ref={containerRef}>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
        <button onClick={() => navigate("/dashboard")} className="transition-colors hover:text-brand">
          Dashboard
        </button>
        <ChevronRight size={12} />
        <span className="font-medium text-gray-800">{event.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Manage Event</h1>
          <p className="text-xs text-gray-400 mt-1">Editing resource configurations</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => navigate(`/event/${event.id}`)} className="gap-2 text-sm btn-secondary">
            <Eye size={15} /> Preview Page
          </button>
          <button onClick={() => setIsScannerOpen(true)} className="gap-2 text-sm btn-primary">
            <QrCode size={15} /> Scan QR check-in
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col gap-5 xl:flex-row">
        {/* Left Column */}
        <div className="manage-left flex-1 min-w-0 space-y-5">
          {/* Capacity Stats Card */}
          <div className="p-5 card">
            <h2 className="mb-4 section-title">Capacity & Revenue Health</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                TICKET FILL RATES
              </span>
              <span className="text-3xl font-extrabold text-gray-900">{fillPercent}%</span>
            </div>
            <div className="h-3 mb-2 overflow-hidden bg-gray-150 rounded-full">
              <div className="h-full rounded-full bg-brand" style={{ width: `${fillPercent}%` }} />
            </div>
            <p className="mb-4 text-xs text-gray-500">
              {event.registered} of {event.capacity} seats reserved
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="mb-1 text-[10px] text-gray-400 font-semibold uppercase">Check-ins</p>
                <p className="text-2xl font-bold text-gray-900">{checkedInCount}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="mb-1 text-[10px] text-gray-400 font-semibold uppercase">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Event Cover Image */}
          <div className="p-5 card">
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-title">Event Cover</h2>
              <span className="text-xs text-gray-400 italic">Preset Unsplash Image</span>
            </div>
            <div className="h-40 overflow-hidden sm:h-48 rounded-xl">
              <img src={event.image} alt="Event Cover" className="object-cover w-full h-full" />
            </div>
          </div>

          {/* Attendees list */}
          <div className="card overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="section-title">Registrants List</h2>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={12} className="absolute text-gray-400 left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    placeholder="Search name, email..."
                    value={attendeeSearch}
                    onChange={(e) => setAttendeeSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand w-36"
                  />
                </div>
                <select
                  value={attendeeFilter}
                  onChange={(e) => setAttendeeFilter(e.target.value)}
                  className="px-2 py-1.5 text-xs text-gray-500 bg-gray-100 border-0 rounded-lg focus:outline-none cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Checked In">Checked In</option>
                  <option value="Pending">Pending</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Attendee", "Ticket Type", "Payment", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRegistrants.map((r) => (
                    <tr key={r.id} className="transition-colors hover:bg-gray-50 relative">
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
                        <span className={r.payment === "Paid" ? "badge-success" : r.payment === "Pending" ? "badge-warning" : "badge-gray"}>
                          {r.payment}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={statusStyle[r.status] || "badge-gray"}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => setActiveRowMenu(activeRowMenu === r.id ? null : r.id)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                        >
                          ⋮
                        </button>

                        {activeRowMenu === r.id && (
                          <div className="absolute right-8 top-2 z-10 w-40 bg-white border border-gray-150 rounded-lg shadow-lg py-1 text-[11px]">
                            {r.status !== "Checked In" && (
                              <button
                                onClick={() => handleUpdateRegistrantStatus(r.id, "Checked In")}
                                className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5"
                              >
                                <UserCheck size={12} className="text-green-500" />
                                Check-In Guest
                              </button>
                            )}
                            {r.payment !== "Paid" && (
                              <button
                                onClick={() => handleMarkPaymentPaid(r.id)}
                                className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-1.5"
                              >
                                <DollarSign size={12} className="text-amber-500" />
                                Mark as Paid
                              </button>
                            )}
                            {r.status !== "Cancelled" && (
                              <button
                                onClick={() => handleCancelRegistration(r.id)}
                                className="w-full text-left px-3 py-1.5 hover:bg-gray-50 text-red-500 flex items-center gap-1.5 border-t border-gray-100"
                              >
                                <Ban size={12} />
                                Cancel Ticket
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredRegistrants.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-450">
                        No registrants found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Attendee Feedback */}
          <div className="p-5 card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">Attendee Feedback</h2>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-amber-500">4.8</span>
                <StarRating rating={5} />
                <span className="text-xs text-gray-400">({feedback.length})</span>
              </div>
            </div>

            {/* Simulated Live Feedback Submission */}
            <form onSubmit={handleAddFeedback} className="flex gap-2 mb-4">
              <input
                placeholder="Write mock feedback to test live rendering..."
                value={feedbackInput}
                onChange={(e) => setFeedbackInput(e.target.value)}
                className="input-field py-1.5 text-xs flex-1"
              />
              <button type="submit" className="px-3 py-1.5 text-xs btn-primary">
                Add Mock
              </button>
            </form>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {feedback.map((f) => (
                <div key={f.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 text-xs font-bold text-white rounded-full bg-brand">
                    {f.initials}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-xs font-semibold text-gray-800">{f.name}</p>
                      <p className="text-[9px] text-gray-400">{f.date}</p>
                    </div>
                    <StarRating rating={f.rating} />
                    <p className="mt-1 text-xs italic text-gray-650 leading-relaxed">{f.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel Tabs */}
        <div className="flex-shrink-0 w-full space-y-4 xl:w-80">
          <div className="p-5 card flex flex-col min-h-[380px]">
            {/* Tab navigation headers */}
            <div className="flex gap-4 mb-4 overflow-x-auto border-b border-gray-150 scrollbar-hide">
              {["Details", "Schedule", "Speakers", "Settings"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeTab === tab ? "tab-active" : "tab-inactive"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* DETAILS TAB */}
            {activeTab === "Details" && (
              <form onSubmit={handleSaveDetails} className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                      Event Title
                    </label>
                    <input
                      className="input-field text-xs"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                      Date & Time Text
                    </label>
                    <input
                      className="input-field text-xs"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field text-xs"
                        value={formPrice}
                        onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                        Capacity
                      </label>
                      <input
                        type="number"
                        className="input-field text-xs"
                        value={formCapacity}
                        onChange={(e) => setFormCapacity(parseInt(e.target.value) || 10)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                      Location / Venue
                    </label>
                    <input
                      className="input-field text-xs"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                      Description
                    </label>
                    <textarea
                      className="text-xs resize-none input-field h-24"
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100 mt-4">
                  <button
                    type="button"
                    onClick={handleDiscardDetails}
                    className="justify-center flex-1 py-2 text-xs btn-secondary"
                  >
                    Discard
                  </button>
                  <button type="submit" className="justify-center flex-1 py-2 text-xs btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* SCHEDULE TAB */}
            {activeTab === "Schedule" && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="max-h-56 overflow-y-auto pr-1 space-y-2">
                    {schedule.map((s) => (
                      <div key={s.id} className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800 text-[11px] leading-tight">{s.title}</p>
                          <p className="text-[9px] text-gray-400 mt-0.5">
                            {s.time} • Speaker: {s.speaker}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteSchedule(s.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {schedule.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-6">No sessions programmed yet.</p>
                    )}
                  </div>

                  <form onSubmit={handleAddSchedule} className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 space-y-2 mt-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add Timeline Session</p>
                    <input name="title" placeholder="Session Title" className="input-field py-1 text-xs" required />
                    <div className="grid grid-cols-2 gap-2">
                      <input name="time" placeholder="e.g. 10:00 AM" className="input-field py-1 text-xs" required />
                      <input name="speaker" placeholder="Speaker Name" className="input-field py-1 text-xs" required />
                    </div>
                    <button type="submit" className="w-full justify-center py-1.5 text-xs btn-primary mt-1">
                      <Plus size={12} /> Add Session
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* SPEAKERS TAB */}
            {activeTab === "Speakers" && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="max-h-56 overflow-y-auto pr-1 space-y-2">
                    {speakers.map((sp) => (
                      <div key={sp.id} className="p-2 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center font-bold text-[9px]">
                            {sp.initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-[11px] leading-tight">{sp.name}</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">
                              {sp.title} @ {sp.company}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteSpeaker(sp.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                    {speakers.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-6">No speakers registered.</p>
                    )}
                  </div>

                  <form onSubmit={handleAddSpeaker} className="p-3 bg-gray-50/50 rounded-xl border border-gray-100 space-y-2 mt-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Add Guest Speaker</p>
                    <input name="name" placeholder="Full Name" className="input-field py-1 text-xs" required />
                    <div className="grid grid-cols-2 gap-2">
                      <input name="title" placeholder="Job Title" className="input-field py-1 text-xs" required />
                      <input name="company" placeholder="Company" className="input-field py-1 text-xs" required />
                    </div>
                    <button type="submit" className="w-full justify-center py-1.5 text-xs btn-primary mt-1">
                      <Plus size={12} /> Add Speaker
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === "Settings" && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                      Event Status
                    </label>
                    <div className="flex gap-2">
                      {["Draft", "Public (LIVE)"].map((st) => {
                        const active = st === "Draft" ? event.status === "CLOSED" : event.status === "LIVE";
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleSettingsSave(event.location, st === "Draft" ? "Closed" : "Open")}
                            className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              active
                                ? "bg-indigo-50 border-brand text-brand"
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {st}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                      Ticket Sales status
                    </label>
                    <div className="flex gap-2">
                      {["Open", "Closed"].map((sales) => {
                        const active = sales === "Open" ? event.status === "LIVE" : event.status === "CLOSED";
                        return (
                          <button
                            key={sales}
                            type="button"
                            onClick={() => handleSettingsSave(event.location, sales)}
                            className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              active
                                ? "bg-indigo-50 border-brand text-brand"
                                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {sales}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-4 text-[10px] text-gray-400 flex items-center gap-1.5">
                  <Sliders size={12} />
                  <span>Configured platform settings for this resource ID.</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 space-y-1 card">
            <button className="w-full text-xs nav-item-inactive flex items-center gap-2">❓ Help Center</button>
            <button
              onClick={() => navigate("/landing")}
              className="w-full text-xs text-red-500 nav-item-inactive hover:bg-red-50 hover:text-red-650 flex items-center gap-2"
            >
              ↗ Log Out
            </button>
          </div>
        </div>
      </div>

      {/* SCAN QR TICKETS MODAL */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl border border-gray-150 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <QrCode size={18} className="text-brand" />
                <h3 className="text-sm font-bold text-gray-900">QR Check-In Scanner</h3>
              </div>
              <button onClick={() => setIsScannerOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            {/* Simulating Scanner viewport camera layout */}
            <div className="relative aspect-square w-full max-w-[260px] mx-auto bg-slate-900 rounded-xl overflow-hidden mb-5 border border-slate-700 flex items-center justify-center">
              {/* Animating Scanning laser line */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-green-400 opacity-80 animate-scan z-10 shadow-[0_0_8px_rgba(74,222,128,1)]" />

              <div className="w-48 h-48 border-2 border-dashed border-white/40 rounded-xl flex items-center justify-center">
                <p className="text-[10px] text-white/50 text-center font-mono">Camera viewport active...<br/>Align ticket QR code</p>
              </div>

              {/* Four decorative corner brackets */}
              <div className="absolute top-4 left-4 w-5 h-5 border-t-4 border-l-4 border-brand-light rounded-tl" />
              <div className="absolute top-4 right-4 w-5 h-5 border-t-4 border-r-4 border-brand-light rounded-tr" />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-b-4 border-l-4 border-brand-light rounded-bl" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b-4 border-r-4 border-brand-light rounded-br" />
            </div>

            {/* Dropdown simulator to select which guest was scanned */}
            <div className="space-y-3">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider text-center">
                Select simulated scanned ticket
              </p>
              <select
                onChange={(e) => {
                  if (e.target.value) handleQRCheckIn(e.target.value);
                }}
                defaultValue=""
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none"
              >
                <option value="" disabled>-- Choose attendee ticket --</option>
                {registrants
                  .filter((r) => r.status !== "Checked In")
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.ticket}) - {r.status}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 mt-5">
              <button onClick={() => setIsScannerOpen(false)} className="px-4 py-2 text-xs btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}
