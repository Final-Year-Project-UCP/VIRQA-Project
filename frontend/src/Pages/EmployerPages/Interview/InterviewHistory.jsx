import { useState, useMemo } from "react";
import { Search, Eye, Filter } from "lucide-react";
import { allData } from "../../../data/candidatesData";
const PAGE_SIZE = 5;

const InterviewHistory = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showDateOptions, setShowDateOptions] = useState(false);

  const lastInterviewCandidates = useMemo(() => {
    if (!allData.length) return [];
    const latestDate = allData.map(d => new Date(d.date)).sort((a, b) => b - a)[0];
    return allData.filter(d => new Date(d.date).toDateString() === latestDate.toDateString());
  }, []);

  const filteredData = useMemo(() => {
    let data = allData
      .filter(item => statusFilter === "all" || item.status === statusFilter)
      .filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

    if (dateFilter === "lastInterview") return lastInterviewCandidates;
    if (dateFilter !== "all") {
      const now = new Date();
      const days = dateFilter === "last7days" ? 7 : 30;
      data = data.filter(item => (now - new Date(item.date)) / (1000 * 60 * 60 * 24) <= days);
    }

    return data;
  }, [statusFilter, search, dateFilter, lastInterviewCandidates]);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Interview History</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <div className="relative flex-1 min-w-[120px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <button
            className="px-3 py-2 border rounded-lg flex items-center gap-1"
            onClick={() => setShowDateOptions(!showDateOptions)}
          >
            <Filter className="w-4 h-4" />
          </button>
          {showDateOptions && (
            <div className="absolute right-0 mt-1 w-40 bg-white border rounded shadow z-10 text-sm">
              <button className="block w-full px-3 py-2 hover:bg-gray-100" onClick={() => { setDateFilter("all"); setPage(1); setShowDateOptions(false); }}>All</button>
              <button className="block w-full px-3 py-2 hover:bg-gray-100" onClick={() => { setDateFilter("last7days"); setPage(1); setShowDateOptions(false); }}>Last 7 Days</button>
              <button className="block w-full px-3 py-2 hover:bg-gray-100" onClick={() => { setDateFilter("last30days"); setPage(1); setShowDateOptions(false); }}>Last 30 Days</button>
              <button className="block w-full px-3 py-2 hover:bg-gray-100" onClick={() => { setDateFilter("lastInterview"); setPage(1); setShowDateOptions(false); }}>Last Interview</button>
            </div>
          )}
        </div>

        <select
          className="px-3 py-2 border rounded-lg text-sm min-w-[120px]"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="all">All Status</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table for medium+ screens */}
      <div className="hidden sm:block bg-white rounded-lg border overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left text-sm font-medium">Candidate</th>
              <th className="p-3 text-left text-sm font-medium">Date</th>
              <th className="p-3 text-left text-sm font-medium">Status</th>
              <th className="p-3 text-left text-sm font-medium">Score</th>
              <th className="p-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(item => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{item.name}<div className="text-gray-500 text-sm">{item.interview}</div></td>
                <td className="p-3 text-gray-600">{item.date} <div className="text-sm">{item.time}</div></td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.status === "Completed" ? "bg-green-100 text-green-700" :
                    item.status === "Pending" ? "bg-blue-100 text-blue-600" :
                    "bg-red-100 text-red-600"
                  }`}>{item.status}</span>
                </td>
                <td className="p-3 font-medium">{item.score !== null ? `${item.score}%` : "N/A"}</td>
                <td className="p-3 flex gap-2"><Eye className="w-5 h-5 hover:text-blue-600 cursor-pointer" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card view for small screens */}
      <div className="sm:hidden flex flex-col gap-3">
        {paginatedData.map(item => (
          <div key={item.id} className="border rounded-lg p-3 bg-white shadow-sm flex justify-between items-center">
            <div>
              <div className="font-medium">{item.name}</div>
              <div className="text-gray-500 text-sm">{item.interview}</div>
              <div className="text-gray-400 text-xs mt-1">{item.date} | {item.time}</div>
            </div>
            {/* Eye icon aligned center */}
            <Eye className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer" />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2 sm:gap-0">
        <div className="text-sm text-gray-600">Showing {paginatedData.length} of {filteredData.length} results</div>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
          <span className="px-3 py-1">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default InterviewHistory;
