import { allData } from "../data/candidatesData.js";

export const getInterviews = ({ page = 1, pageSize = 5, search = "", statusFilter = "all", dateFilter = "all" }) => {
  let data = allData;

  // 1 Filter by Status
  if (statusFilter !== "all")
    data = data.filter(i => i.status === statusFilter);

  // 2 Filter by Search
  if (search.trim())
    data = data.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  // 3 Current Time in Milliseconds
  const now = Date.now();

  const MS_PER_DAY = 24 * 60 * 60 * 1000; // milliseconds in one day

  // 4 Filter by Date
  if (dateFilter === "lastInterview") {
    const maxTime = Math.max(...data.map(i => new Date(i.date).getTime())); // latest date in milliseconds
    data = data.filter(i => new Date(i.date).getTime() === maxTime); // only keep latest
  }

  if (dateFilter === "last7days" || dateFilter === "last30days") {
    const limitDays = dateFilter === "last7days" ? 7 : 30;
    data = data.filter(i => (now - new Date(i.date).getTime()) <= limitDays * MS_PER_DAY);
  }

  // 5 Pagination
  const total = data.length;//Counts total items after filtering (status, search, date).
  const start = (page - 1) * pageSize;
  const paginatedData = data.slice(start, start + pageSize);//tell range like[0-4]

  // 6 Return paginated result
  return {
    data: paginatedData,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
};
