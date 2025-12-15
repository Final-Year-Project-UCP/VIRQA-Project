import { Menu, ArrowLeft } from "lucide-react";
import NotificationDropdown from "./NotificationDropDown.jsx";
import { adminNotifications } from "../../data/adminNotificationsData";
import Logo from "./Logo";

export const MultiStepLoaderHeader = ({ sidebarOpen, toggleSidebar }) => (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#1a56db] shadow flex items-center justify-between px-4 z-50 text-white">
        <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="p-2 lg:hidden">
                {sidebarOpen ? <ArrowLeft size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3">
                <Logo theme="light" className="scale-90" />
                <div className="hidden md:block h-6 w-px bg-white/20"></div>
                <div className="hidden md:block text-lg font-semibold tracking-wide">Admin Pane</div>
            </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-6">
            <NotificationDropdown
                notifications={adminNotifications}
                iconColor="text-white"
                iconHoverColor="text-gray-200"
                iconBg="bg-[#1a56db]"
                iconBorder="border-white"
                iconSize={22}
                dropdownBg="bg-[#1a56db]"
                viewAllPath="/api/v1/admin/notifications"
            />
            <img
                src="https://via.placeholder.com/35"
                alt="profile"
                className="w-9 h-9 rounded-full border-2 border-white"
            />
        </div>
    </header>
);

export default MultiStepLoaderHeader;
