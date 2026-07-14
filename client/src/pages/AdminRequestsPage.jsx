import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  ChevronRight,
} from "lucide-react";
import DesktopLayout from "../components/DesktopLayout";
import { mockRequests } from "../data/mockData";

const statusConfig = {
  Pending: { badge: "badge-warning", icon: Clock, color: "text-amber-600" },
  Approved: {
    badge: "badge-success",
    icon: CheckCircle,
    color: "text-green-600",
  },
  Rejected: { badge: "badge-danger", icon: XCircle, color: "text-red-600" },
};

const summary = [
  { label: "Total", value: 48, color: "border-l-gray-400" },
  { label: "Pending", value: 12, color: "border-l-amber-400" },
  { label: "Approved", value: 30, color: "border-l-green-500" },
  { label: "Rejected", value: 6, color: "border-l-red-500" },
];

export default function AdminRequestsPage() {
  return (
    <>
      {" "}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Event Requests Queue</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Review and manage incoming event requests
          </p>
        </div>
      </div>
      {/* Summary cards — 2 col mobile, 4 col md */}
      <div className="grid grid-cols-2 gap-3 mb-6 md:grid-cols-4">
        {summary.map(({ label, value, color }) => (
          <div key={label} className={`card p-4 border-l-4 ${color}`}>
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
            placeholder="Search requests..."
            className="w-full py-2 pr-4 text-sm border border-gray-200 rounded-lg pl-9 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex-shrink-0 gap-2 text-sm btn-secondary">
            <Filter size={14} /> Filter
          </button>
          <select className="flex-shrink-0 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg focus:outline-none">
            <option>All Status</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>
      {/* Table — horizontal scroll on mobile */}
      <div className="overflow-hidden card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {[
                  "Request ID",
                  "Event",
                  "Requester",
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
              {mockRequests.map((req) => {
                const cfg = statusConfig[req.status];
                const Icon = cfg.icon;
                return (
                  <tr
                    key={req.id}
                    className="transition-colors hover:bg-gray-50 group"
                  >
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 font-mono text-xs text-gray-700 bg-gray-100 rounded">
                        {req.id}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-800 max-w-[180px] truncate">
                      {req.event}
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                      {req.requester}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {req.date}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <Icon size={13} className={cfg.color} />
                        <span className={cfg.badge}>{req.status}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 transition-opacity opacity-0 group-hover:opacity-100">
                        {req.status === "Pending" && (
                          <>
                            <button className="px-2.5 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap">
                              Approve
                            </button>
                            <button className="px-2.5 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">
                              Reject
                            </button>
                          </>
                        )}
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 px-5 py-3 border-t border-gray-100 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-400">Showing 1-5 of 48 requests</p>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${p === 1 ? "bg-brand text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
