import {  Menu, ArrowLeft} from "lucide-react";
import NotificationDropdown from "./NotificationDropDown.jsx";
export const Header = ({ sidebarOpen, toggleSidebar, notifications }) => (
  <header className="fixed top-0 left-0 right-0 h-16 bg-[#1a56db]   shadow flex items-center justify-between px-4 z-50 text-white">
    <div className="flex items-center gap-4">
      <button onClick={toggleSidebar} className="p-2 lg:hidden">
        {sidebarOpen ? <ArrowLeft size={24} /> : <Menu size={24} />}
      </button>
      <div className="text-xl font-bold">Employee Dashboard</div>
    </div>
    <div className="flex items-center gap-6">
      <NotificationDropdown notifications={notifications} />
      <img
        src="https://via.placeholder.com/35"
        alt="profile"
        className="w-9 h-9 rounded-full border border-white"
      />
    </div>
  </header>
);