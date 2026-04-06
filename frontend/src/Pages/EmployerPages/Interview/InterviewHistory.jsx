import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getInterviews } from "../../../hooks/useInterviews";
import { Search, Eye, Mail, Filter } from "lucide-react";

const PAGE_SIZE = 5;

const InterviewHistory = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [openDropdown, setOpenDropdown] = useState(null); // "date" or "status"

  const { data, isLoading } = useQuery({
    queryKey: ["interviews", page, search, statusFilter, dateFilter],
    queryFn: () =>
      getInterviews({ page, pageSize: PAGE_SIZE, search, statusFilter, dateFilter }),
    keepPreviousData: true,
  });

  const list = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-blue-100 text-blue-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const statusOptions = ["all", "Completed", "Pending", "Cancelled"];

  return (
    <div className="p-4 max-w-8xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Interview History</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center justify-center">

        {/* Search */}
        <div className="relative flex-1 min-w-[120px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <button
            className="px-3 py-2 border rounded-lg flex items-center gap-1 justify-center"
            onClick={() => setOpenDropdown(openDropdown === "date" ? null : "date")}
          >
            <Filter className="w-4 h-4" />
          </button>
          {openDropdown === "date" && (
            <div className="absolute mt-1 w-40 bg-white border rounded shadow text-sm text-center z-10">
              <button onClick={() => { setDateFilter("all"); setPage(1); setOpenDropdown(null); }} className="block px-3 py-2 hover:bg-gray-100">All</button>
              <button onClick={() => { setDateFilter("last7days"); setPage(1); setOpenDropdown(null); }} className="block px-3 py-2 hover:bg-gray-100">Last 7 Days</button>
              <button onClick={() => { setDateFilter("last30days"); setPage(1); setOpenDropdown(null); }} className="block px-3 py-2 hover:bg-gray-100">Last 30 Days</button>
              <button onClick={() => { setDateFilter("lastInterview"); setPage(1); setOpenDropdown(null); }} className="block px-3 py-2 hover:bg-gray-100">Last Interview</button>
            </div>
          )}
        </div>

        {/* Status Filter as custom dropdown */}
        <div className="relative">
          <button
            className="px-3 py-2 border rounded-lg flex items-center gap-1 justify-center"
            onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
          >
            {statusFilter === "all" ? "All Status" : statusFilter}
          </button>
          {openDropdown === "status" && (
            <div className="absolute mt-1 w-40 bg-white border rounded shadow text-sm text-center z-10">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => { setStatusFilter(status); setPage(1); setOpenDropdown(null); }}
                  className="block px-3 py-2 hover:bg-gray-100"
                >
                  {status === "all" ? "All Status" : status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      )}

      {/* Table */}
      {!isLoading && list.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {list.map((item) => (
            <div key={item.id} className="p-4 border-b border-gray-200 hover:bg-gray-50">

              {/* Mobile */}
              <div className="md:hidden flex justify-between items-start mb-3">
                <div>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.interview}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>

              {/* Desktop */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 items-center text-center">
                <div className="col-span-3">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.interview}</div>
                </div>
                <div className="col-span-2">{item.score ?? "N/A"}</div>
                <div className="col-span-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <div className="col-span-3 text-sm text-gray-600">
                  Updated: {item.date} {item.time}
                </div>
                <div className="col-span-2">
                  {item.status === "Completed" ? (
                    <button className="flex items-center justify-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                      <Eye size={16} className="mr-1" /> View
                    </button>
                  ) : item.status === "Pending" ? (
                    <button className="flex items-center justify-center text-orange-600 hover:text-orange-800 text-sm font-medium">
                      <Mail size={16} className="mr-1" /> Send Reminder
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {list.length === 0 && !isLoading && (
        <div className="p-8 text-center text-gray-500">No interviews found.</div>
      )}

      {/* Pagination */}
      {!isLoading && (
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center mt-4 gap-2">
          <div className="text-sm text-gray-600 text-center">
            Showing {list.length} of {total} results
          </div>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-3 py-1">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;
