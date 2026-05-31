import { useState, useEffect, useRef } from "react";
import { Menu, ArrowLeft, User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NotificationDropdown from "./NotificationDropDown.jsx";
import Logo from "./Logo.jsx";
import { api } from "../../config/api.js";

// Helper: get initials from name or email
const getInitials = (name, email) => {
  if (name?.trim()) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email?.[0]?.toUpperCase() || "?";
};

export const Header = ({ sidebarOpen, toggleSidebar }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Fetch employee profile ───────────────────────────────────────────────
  const { data: profile } = useQuery({
    queryKey: ["employeeProfile"],
    queryFn: async () => {
      const res = await api.get("/employee/profile");
      return res.data?.data;
    },
    staleTime: 5 * 60_000, // 5 min — navbar doesn't need to hammer the server
  });

  // ── Logout mutation ──────────────────────────────────────────────────────
  const logoutMutation = useMutation({
    mutationFn: () => api.post("/user/logout"),
    onSuccess: () => {
      localStorage.removeItem('userRole'); // ← critical: clear role so ProtectedRoute blocks access
      queryClient.clear();
      navigate("/login");
    },
    onError: () => {
      // Even if server call fails, clear everything client-side and redirect
      localStorage.removeItem('userRole');
      queryClient.clear();
      navigate("/login");
    },
  });

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    logoutMutation.mutate();
  };

  // Derived display values
  const displayName = profile?.fullName || profile?.email?.split("@")[0] || "Employee";
  const displayEmail = profile?.email || "";
  const initials = getInitials(profile?.fullName, profile?.email);
  const profilePhoto = profile?.profilePhoto;

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#1a56db] shadow flex items-center justify-between px-4 z-50 text-white">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 lg:hidden hover:bg-blue-700 rounded-lg transition-colors"
        >
          {sidebarOpen ? <ArrowLeft size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Logo theme="light" isMobile={window.innerWidth < 1024} />
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        {/* Notification Dropdown */}
        <NotificationDropdown
          iconColor="text-white"
          iconHoverColor="text-gray-200"
          iconBg="bg-[#1a56db]"
          iconBorder="border-white"
          iconSize={22}
          dropdownBg="bg-[#1a56db]"
          viewAllPath="/api/v1/employee/notifications"
        />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 hover:bg-white/10 rounded-xl p-2 transition-colors"
          >
            {/* Name + Role text */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-white leading-tight">
                {displayName}
              </span>
              <span className="text-xs text-white/80">Employee</span>
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white shadow-md overflow-hidden flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <ChevronDown
              size={16}
              className={`text-white transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User info header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-blue-700 font-bold text-sm">{initials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{displayEmail}</p>
                </div>
              </div>

              {/* My Profile */}
              <button
                onClick={() => {
                  navigate("/api/v1/employee/profile");
                  setProfileDropdownOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors group"
              >
                <User size={16} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">My Profile</span>
              </button>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 transition-colors group disabled:opacity-60"
              >
                <LogOut
                  size={16}
                  className={`transition-colors ${logoutMutation.isPending ? "text-red-400 animate-pulse" : "text-gray-500 group-hover:text-red-600"}`}
                />
                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                  {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
