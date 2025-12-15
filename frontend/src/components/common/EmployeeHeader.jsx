import { useState, useEffect, useRef } from "react";
import { Menu, ArrowLeft, User, LogOut, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropDown.jsx";
import Logo from "./Logo.jsx";

export const Header = ({ sidebarOpen, toggleSidebar }) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* Logo - Visible on all screen sizes */}
        <Logo
          theme="light"
          isMobile={window.innerWidth < 1024}
        />
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
        />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 hover:bg-white/10 rounded-xl p-2 transition-colors"
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-white">John Smith</span>
              <span className="text-xs text-white/80">Employer</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white shadow-md flex items-center justify-center text-white text-sm font-bold">
              JS
            </div>
            <ChevronDown
              size={16}
              className={`text-white transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">John Smith</p>
                <p className="text-xs text-gray-500">john.smith@company.com</p>
              </div>

              <button
                onClick={() => {
                  navigate('/employer/profile');
                  setProfileDropdownOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors group"
              >
                <User size={16} className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">My Profile</span>
              </button>

              <button
                onClick={() => {
                  // TODO: Implement logout logic
                  console.log('Logging out...');
                  setProfileDropdownOpen(false);
                }}
                className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-red-50 transition-colors group"
              >
                <LogOut size={16} className="text-gray-500 group-hover:text-red-600 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
