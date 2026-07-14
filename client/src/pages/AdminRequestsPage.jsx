import { useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ChevronRight,
  X,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  ClipboardList,
} from "lucide-react";
import Toast from "../components/Toast";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { useAppContext } from "../context/AppContext";

const statusConfig = {
  Pending: { badge: "badge-warning", icon: Clock, color: "text-amber-600" },
  Approved: {
    badge: "badge-success",
    icon: CheckCircle,
    color: "text-green-600",
  },
  Rejected: { badge: "badge-danger", icon: XCircle, color: "text-red-600" },
};

// Preset images for approved events
const eventImagePresets = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80",
  "https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=600&q=80",
  "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=600&q=80",
];

export default function AdminRequestsPage() {
  const {
    events,
    requests,
    approveRequest,
    rejectRequest,
  } = useAppContext();

  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // Interactive filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(".req-summary-card", {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.09,
      ease: "power2.out",
    });
    gsap.from(".req-row", {
      opacity: 0,
      x: -16,
      duration: 0.45,
      stagger: 0.07,
      ease: "power2.out",
      delay: 0.35,
    });
  }, { scope: containerRef });

  // Approval logic - transitions state and adds event to global list
  const handleApproveRequest = (req) => {
    approveRequest(req.id);
    triggerToast(`Request ${req.id} approved! Event "${req.event}" is now live.`, "success");
    setSelectedRequest(null);
  };

  const handleRejectRequest = (req) => {
    rejectRequest(req.id);
    triggerToast(`Request ${req.id} has been rejected.`, "error");
    setSelectedRequest(null);
  };

  // Summarize quantities dynamically
  const totalCount = requests.length;
  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;

  const summary = [
    { label: "Total Requests", value: totalCount, color: "border-l-indigo-500 bg-indigo-50/30" },
    { label: "Pending", value: pendingCount, color: "border-l-amber-400 bg-amber-50/30" },
    { label: "Approved", value: approvedCount, color: "border-l-green-500 bg-green-50/30" },
    { label: "Rejected", value: rejectedCount, color: "border-l-red-500 bg-red-50/30" },
  ];

  // Filtering
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requester.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Paginating
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div ref={containerRef}>
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Event Requests Queue</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Review and approve event submissions from organizers
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4">
        {summary.map(({ label, value, color }) => (
          <div key={label} className={`req-summary-card card p-4 border-l-4 ${color}`}>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-stretch gap-3 mb-5 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
          />
          <input
            placeholder="Search request ID, event name, requester..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page to 1
            }}
            className="w-full py-2 pr-4 text-sm border border-gray-200 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex-shrink-0 gap-2 text-sm btn-secondary">
            <Filter size={14} /> Filter
          </button>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1); // Reset page to 1
            }}
            className="flex-shrink-0 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg focus:outline-none"
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  "Request ID",
                  "Event Title",
                  "Requester Organization",
                  "Submitted",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-xs font-semibold tracking-wide text-left text-gray-500 uppercase whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedRequests.map((req) => {
                const cfg = statusConfig[req.status] || statusConfig.Pending;
                const Icon = cfg.icon;
                return (
                  <tr
                    key={req.id}
                    className="req-row transition-colors hover:bg-gray-50 group cursor-pointer"
                    onClick={() => setSelectedRequest(req)}
                  >
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 font-mono text-xs text-gray-700 bg-gray-100 rounded">
                        {req.id}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800 max-w-[200px] truncate">
                      {req.event}
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {req.requester}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {req.date}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Icon size={13} className={cfg.color} />
                        <span className={cfg.badge}>{req.status}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-2">
                        {req.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => handleApproveRequest(req)}
                              className="px-2.5 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRequest(req)}
                              className="px-2.5 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xs italic">Decision made</span>
                        )}
                        <button
                          onClick={() => setSelectedRequest(req)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No requests found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex flex-col gap-2 px-5 py-3 border-t border-gray-100 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-400">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredRequests.length)} of {filteredRequests.length} requests
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-2 py-1 border rounded text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                    p === currentPage ? "bg-brand text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-2 py-1 border rounded text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* REQUEST DETAILS MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl border border-gray-150 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="text-brand" size={18} />
                <span className="text-sm font-bold text-gray-900">Event Request: {selectedRequest.id}</span>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-xs text-gray-650">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Proposed Event Title</p>
                <p className="text-base font-bold text-gray-800 leading-tight">{selectedRequest.event}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Requester Profile</p>
                  <p className="font-semibold text-gray-800">{selectedRequest.requester}</p>
                  <p className="text-[10px] text-gray-400">Organizing Entity</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Submitted On</p>
                  <p className="font-semibold text-gray-800">{selectedRequest.date}</p>
                  <p className="text-[10px] text-gray-400">Creation date</p>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Proposed Logistics</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-brand-light" />
                    <div>
                      <p className="font-medium text-gray-800">{selectedRequest.dateProposed || "Nov 15, 2026"}</p>
                      <p className="text-[9px] text-gray-400">Date & Time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-brand-light" />
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{selectedRequest.locationProposed || "Convention Hall, NY"}</p>
                      <p className="text-[9px] text-gray-400 truncate">Venue / Location</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-brand-light" />
                    <div>
                      <p className="font-medium text-gray-800">{selectedRequest.capacityProposed || 150} Seats</p>
                      <p className="text-[9px] text-gray-400">Maximum Capacity</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} className="text-brand-light" />
                    <div>
                      <p className="font-medium text-gray-800">${selectedRequest.priceProposed !== undefined ? selectedRequest.priceProposed.toFixed(2) : "79.00"}</p>
                      <p className="text-[9px] text-gray-400">Suggested Ticket Price</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Event Description</p>
                <p className="text-xs text-gray-650 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
                  {selectedRequest.descriptionProposed || `Join EventLogix and ${selectedRequest.requester} for an engaging day of networking and technical sessions at "${selectedRequest.event}".`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Status:</span>
                <span className={`badge ${statusConfig[selectedRequest.status]?.badge || "badge-warning"}`}>
                  {selectedRequest.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-4">
              <button onClick={() => setSelectedRequest(null)} className="px-4 py-2 text-xs btn-secondary">
                Close
              </button>
              {selectedRequest.status === "Pending" && (
                <>
                  <button
                    onClick={() => handleRejectRequest(selectedRequest)}
                    className="px-4 py-2 text-xs bg-red-650 hover:bg-red-750 text-white rounded-lg transition-colors font-medium"
                  >
                    Reject Proposal
                  </button>
                  <button
                    onClick={() => handleApproveRequest(selectedRequest)}
                    className="px-4 py-2 text-xs bg-green-650 hover:bg-green-750 text-white rounded-lg transition-colors font-medium"
                  >
                    Approve Event
                  </button>
                </>
              )}
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
