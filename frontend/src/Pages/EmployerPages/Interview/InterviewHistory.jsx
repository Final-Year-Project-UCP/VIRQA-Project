import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../../../config/api.js";
import {
    Search,
    Eye,
    Mail,
    Filter,
    ChevronLeft,
    ChevronRight,
    Users,
    CheckCircle2,
    Clock3,
    XCircle,
    TrendingUp,
    BarChart3,
    RefreshCw,
    Trophy,
    Calendar,
    Loader2
} from "lucide-react";

const PAGE_SIZE = 8;

// ─── Fetch from real API ──────────────────────────────────────────────────────
const fetchCandidateHistory = async () => {
    const res = await api.get("employee/candidate-history");
    return res.data?.data || [];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getStatusConfig = (status) => {
    switch (status) {
        case "Completed":   return { bg: "bg-emerald-100 text-emerald-800 border border-emerald-200",   dot: "bg-emerald-500", icon: CheckCircle2 };
        case "InProgress":  return { bg: "bg-blue-100 text-blue-800 border border-blue-200",             dot: "bg-blue-500",    icon: Clock3 };
        case "Pending":     return { bg: "bg-amber-100 text-amberber-800 border border-amber-200",      dot: "bg-amber-500",   icon: Clock3 };
        case "Cancelled":   return { bg: "bg-red-100 text-red-800 border border-red-200",               dot: "bg-red-500",     icon: XCircle };
        default:            return { bg: "bg-gray-100 text-gray-600 border border-gray-200",            dot: "bg-gray-400",    icon: Clock3 };
    }
};

const getScoreColor = (score) => {
    if (score === null || score === undefined) return { text: "text-gray-400", label: "N/A" };
    if (score >= 80) return { text: "text-emerald-600 font-bold", label: `${score}%` };
    if (score >= 60) return { text: "text-amber-600 font-bold",   label: `${score}%` };
    return             { text: "text-red-600 font-bold",          label: `${score}%` };
};

// ─── Component ────────────────────────────────────────────────────────────────
const InterviewHistory = () => {
    const navigate = useNavigate();

    const [page, setPage]               = useState(1);
    const [search, setSearch]           = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter]   = useState("all");
    const [openDropdown, setOpenDropdown] = useState(null);

    // ── Data fetch ────────────────────────────────────────────────────────────
    const { data: rawData = [], isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ["employer-candidate-history"],
        queryFn: fetchCandidateHistory,
        staleTime: 1000 * 60 * 2, // 2 min cache
    });

    // ── Stats (computed from full dataset) ────────────────────────────────────
    const stats = useMemo(() => {
        const total     = rawData.length;
        const completed = rawData.filter(i => i.status === "Completed").length;
        const pending   = rawData.filter(i => i.status === "Pending").length;
        const scores    = rawData.filter(i => i.score !== null).map(i => i.score);
        const avg       = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
        return { total, completed, pending, avg };
    }, [rawData]);

    // ── Client-side filtering ─────────────────────────────────────────────────
    const filtered = useMemo(() => {
        const now = Date.now();
        const MS  = 24 * 60 * 60 * 1000;

        return rawData
            .filter(i => statusFilter === "all" || i.status === statusFilter)
            .filter(i => !search.trim() || 
                i.name.toLowerCase().includes(search.toLowerCase()) ||
                i.email.toLowerCase().includes(search.toLowerCase()) ||
                i.interview.toLowerCase().includes(search.toLowerCase())
            )
            .filter(i => {
                const t = new Date(i.timestamp).getTime();
                if (dateFilter === "last7days")  return (now - t) <= 7  * MS;
                if (dateFilter === "last30days") return (now - t) <= 30 * MS;
                if (dateFilter === "lastInterview") {
                    const max = Math.max(...rawData.map(x => new Date(x.timestamp).getTime()));
                    return t === max;
                }
                return true;
            });
    }, [rawData, search, statusFilter, dateFilter]);

    // ── Pagination ────────────────────────────────────────────────────────────
    const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const paginated   = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleFilterChange = (type, value) => {
        if (type === "status") setStatusFilter(value);
        if (type === "date")   setDateFilter(value);
        setPage(1);
        setOpenDropdown(null);
    };

    const statusOptions = ["all", "Completed", "InProgress", "Pending", "Cancelled"];
    const dateOptions   = [
        { val: "all",           label: "All Time" },
        { val: "last7days",     label: "Last 7 Days" },
        { val: "last30days",    label: "Last 30 Days" },
        { val: "lastInterview", label: "Latest Batch" },
    ];

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div
            className="space-y-6"
            onClick={() => setOpenDropdown(null)}
        >
            <div>

                {/* ── Header ── */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Interview History
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Track candidate progress across all interview sessions
                        </p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all text-sm font-medium disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>

                {/* ── Stats Cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Candidates", value: stats.total,     icon: Users,       color: "text-blue-600",    bg: "from-blue-50 to-blue-100/50",    border: "border-blue-200/60" },
                        { label: "Completed",         value: stats.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "from-emerald-50 to-emerald-100/50", border: "border-emerald-200/60" },
                        { label: "Pending",           value: stats.pending,   icon: Clock3,      color: "text-amber-600",   bg: "from-amber-50 to-amber-100/50",   border: "border-amber-200/60" },
                        { label: "Avg. Score",        value: stats.avg !== null ? `${stats.avg}%` : "N/A", icon: Trophy, color: "text-purple-600", bg: "from-purple-50 to-purple-100/50", border: "border-purple-200/60" },
                    ].map(({ label, value, icon: Icon, color, bg, border }) => (
                        <div key={label} className={`bg-gradient-to-br ${bg} border ${border} rounded-2xl p-5 shadow-sm`}>
                            <div className={`inline-flex p-2.5 rounded-xl bg-white shadow-sm mb-3`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            <p className="text-2xl font-bold text-gray-800">{isLoading ? "—" : value}</p>
                            <p className="text-xs text-gray-500 mt-0.5 font-medium">{label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Filters Row ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex flex-wrap gap-3 items-center">

                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email or interview…"
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white outline-none transition-all"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            />
                        </div>

                        {/* Date Range Dropdown */}
                        <div className="relative" onClick={e => e.stopPropagation()}>
                            <button
                                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                onClick={() => setOpenDropdown(openDropdown === "date" ? null : "date")}
                            >
                                <Calendar className="w-4 h-4 text-gray-500" />
                                {dateOptions.find(d => d.val === dateFilter)?.label || "All Time"}
                            </button>
                            {openDropdown === "date" && (
                                <div className="absolute top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                                    {dateOptions.map(opt => (
                                        <button
                                            key={opt.val}
                                            onClick={() => handleFilterChange("date", opt.val)}
                                            className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${dateFilter === opt.val ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status Dropdown */}
                        <div className="relative" onClick={e => e.stopPropagation()}>
                            <button
                                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
                            >
                                <Filter className="w-4 h-4 text-gray-500" />
                                {statusFilter === "all" ? "All Status" : statusFilter}
                            </button>
                            {openDropdown === "status" && (
                                <div className="absolute top-full mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                                    {statusOptions.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => handleFilterChange("status", opt)}
                                            className={`flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${statusFilter === opt ? "text-blue-600 font-semibold bg-blue-50" : "text-gray-700"}`}
                                        >
                                            {opt !== "all" && (
                                                <span className={`w-2 h-2 rounded-full ${getStatusConfig(opt).dot}`} />
                                            )}
                                            {opt === "all" ? "All Status" : opt}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Results count */}
                        {!isLoading && (
                            <span className="ml-auto text-sm text-gray-500 font-medium">
                                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Table ── */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                    {/* Table header */}
                    <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3.5 bg-gray-50/80 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        <div className="col-span-3">Candidate</div>
                        <div className="col-span-3">Interview</div>
                        <div className="col-span-2 text-center">Score</div>
                        <div className="col-span-2 text-center">Status</div>
                        <div className="col-span-1 text-center">Date</div>
                        <div className="col-span-1 text-right">Action</div>
                    </div>

                    {/* Loading state */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                            <p className="text-sm font-medium">Loading candidate history…</p>
                        </div>
                    )}

                    {/* Error state */}
                    {isError && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                            <XCircle className="w-10 h-10 text-red-400" />
                            <p className="font-semibold text-gray-600">Failed to load history</p>
                            <button
                                onClick={() => refetch()}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty state */}
                    {!isLoading && !isError && filtered.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                            <BarChart3 className="w-12 h-12 text-gray-300" />
                            <p className="font-semibold text-gray-500 text-lg">No records found</p>
                            <p className="text-sm text-gray-400">
                                {rawData.length === 0
                                    ? "Create an interview session and invite candidates to get started."
                                    : "Try adjusting your search or filter criteria."}
                            </p>
                        </div>
                    )}

                    {/* Rows */}
                    {!isLoading && !isError && paginated.map((item, idx) => {
                        const statusCfg  = getStatusConfig(item.status);
                        const scoreCfg   = getScoreColor(item.score);
                        const StatusIcon = statusCfg.icon;

                        return (
                            <div
                                key={item.id}
                                className={`group px-6 py-4 border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${idx === paginated.length - 1 ? "border-b-0" : ""}`}
                            >
                                {/* Desktop row */}
                                <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">

                                    {/* Candidate */}
                                    <div className="col-span-3 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-bold text-blue-700">
                                                {item.name?.[0]?.toUpperCase() || "?"}
                                            </span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{item.email}</p>
                                        </div>
                                    </div>

                                    {/* Interview title */}
                                    <div className="col-span-3">
                                        <p className="text-sm text-gray-700 font-medium truncate">{item.interview}</p>
                                        {item.time && (
                                            <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                                        )}
                                    </div>

                                    {/* Score */}
                                    <div className="col-span-2 text-center">
                                        {item.score !== null ? (
                                            <div className="flex items-center justify-center gap-1.5">
                                                <TrendingUp className={`w-3.5 h-3.5 ${scoreCfg.text}`} />
                                                <span className={`text-sm ${scoreCfg.text}`}>{scoreCfg.label}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">—</span>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-2 flex justify-center">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusCfg.bg}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                            {item.status}
                                        </span>
                                    </div>

                                    {/* Date */}
                                    <div className="col-span-1 text-center">
                                        <p className="text-xs text-gray-500">{item.date}</p>
                                    </div>

                                    {/* Action */}
                                    <div className="col-span-1 flex justify-end">
                                        {item.status === "Completed" ? (
                                            <button
                                                onClick={() => navigate(`/api/v1/employee/evaluation/${item.sessionId}/${item.candidateId}`)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-md transition-all"
                                            >
                                                <Eye className="w-3.5 h-3.5" />
                                                View
                                            </button>
                                        ) : item.status === "Pending" ? (
                                            <button
                                                className="flex items-center gap-1 px-3 py-1.5 border border-amber-300 bg-amber-50 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-all"
                                                title="Send reminder email"
                                            >
                                                <Mail className="w-3.5 h-3.5" />
                                                Remind
                                            </button>
                                        ) : (
                                            <span className="text-xs text-gray-300">—</span>
                                        )}
                                    </div>
                                </div>

                                {/* Mobile card */}
                                <div className="md:hidden space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                                <span className="text-xs font-bold text-blue-700">
                                                    {item.name?.[0]?.toUpperCase() || "?"}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.email}</p>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${statusCfg.bg}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span className="font-medium text-gray-700">{item.interview}</span>
                                        <span>{item.date}</span>
                                    </div>
                                    {item.score !== null && (
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className={`w-3.5 h-3.5 ${scoreCfg.text}`} />
                                            <span className={`text-sm ${scoreCfg.text}`}>Score: {scoreCfg.label}</span>
                                        </div>
                                    )}
                                    {item.status === "Completed" && (
                                        <button
                                            onClick={() => navigate(`/api/v1/employee/evaluation/${item.sessionId}/${item.candidateId}`)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> View Result
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Pagination ── */}
                {!isLoading && filtered.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2">
                        <p className="text-sm text-gray-500">
                            Showing <span className="font-semibold text-gray-700">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span> of <span className="font-semibold text-gray-700">{filtered.length}</span> results
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>

                            {/* Page numbers */}
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                .reduce((acc, p, i, arr) => {
                                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                                    acc.push(p);
                                    return acc;
                                }, [])
                                .map((p, i) =>
                                    p === "..." ? (
                                        <span key={`dots-${i}`} className="px-2 text-gray-400 text-sm">…</span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                                                p === currentPage
                                                    ? "bg-blue-600 text-white shadow-blue-200 shadow-md"
                                                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                                            }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewHistory;
