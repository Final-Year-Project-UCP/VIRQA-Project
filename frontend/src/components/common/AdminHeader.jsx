import { Menu, ArrowLeft, LogOut, User, Settings } from "lucide-react";
import NotificationDropdown from "./NotificationDropDown.jsx";
import { adminNotifications } from "../../data/adminNotificationsData";
import Logo from "./Logo";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../../config/api.js";

export const MultiStepLoaderHeader = ({ sidebarOpen, toggleSidebar }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch official Admin Profile for the Avatar
    const { data: profile } = useQuery({
        queryKey: ['adminProfile'],
        queryFn: async () => {
            const res = await api.get('admin/profile');
            return res.data.data;
        }
    });

    const logoutMutation = useMutation({
        mutationFn: () => api.post("/user/logout"),
        onSuccess: () => {
            localStorage.removeItem("userRole");
            queryClient.clear();
            navigate("/login");
        },
        onError: () => {
            localStorage.removeItem("userRole");
            queryClient.clear();
            navigate("/login");
        },
    });

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-[#1a56db] shadow-lg flex items-center justify-between px-4 lg:px-8 z-50 text-white border-b border-white/10 backdrop-blur-md bg-opacity-95">
            <div className="flex items-center gap-4">
                <button 
                    onClick={toggleSidebar} 
                    className="p-2 lg:hidden hover:bg-white/10 rounded-xl transition-colors"
                >
                    {sidebarOpen ? <ArrowLeft size={24} /> : <Menu size={24} />}
                </button>
                <div className="flex items-center gap-3">
                    <Logo theme="light" className="scale-90" />
                    <div className="hidden lg:block h-8 w-px bg-white/20 mx-2"></div>
                    <div className="hidden lg:block">
                        <div className="text-sm font-black uppercase tracking-widest text-blue-100 opacity-80">VIRQA Engine</div>
                        <div className="text-[10px] font-bold text-white/60 -mt-1">ADMINISTRATIVE TERMINAL</div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 lg:gap-6">
                <div className="flex items-center gap-2 pr-2 border-r border-white/10">
                    <NotificationDropdown
                        notifications={adminNotifications}
                        iconColor="text-white"
                        iconHoverColor="text-gray-200"
                        iconBg="bg-transparent"
                        iconBorder="border-transparent"
                        iconSize={22}
                        dropdownBg="bg-[#1a56db]"
                        viewAllPath="/api/v1/admin/notifications"
                    />
                </div>

                {/* Attractive Admin Profile Module */}
                <Link 
                    to="/api/v1/admin/profile"
                    className="group flex items-center gap-3 p-1 pr-3 hover:bg-white/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-white/20"
                >
                    <div className="relative">
                        <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-white/20 group-hover:ring-white/50 transition-all shadow-md bg-white/10 flex items-center justify-center">
                            {profile?.profilePhoto ? (
                                <img src={profile.profilePhoto} className="w-full h-full object-cover" alt="Admin" />
                            ) : (
                                <User size={20} className="text-blue-100" />
                            )}
                        </div>
                        {/* Status Glow */}
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#1a56db] shadow-sm animate-pulse"></span>
                    </div>
                    
                    <div className="hidden sm:block text-left">
                        <div className="text-[11px] font-black leading-none group-hover:text-blue-100 transition-colors">
                            {profile?.fullName?.split(" ")[0] || "ADMIN"}
                        </div>
                        <div className="text-[9px] font-bold text-white/50 mt-1 uppercase tracking-tighter">System Authority</div>
                    </div>
                </Link>

                {/* Logout Button */}
                <button
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    title="Sign Out"
                    className="flex items-center justify-center w-10 h-10 bg-rose-500/10 hover:bg-rose-500 rounded-xl text-rose-200 hover:text-white transition-all duration-300 group shadow-sm border border-rose-500/20"
                >
                    <LogOut size={18} className={`group-hover:scale-110 transition-transform ${logoutMutation.isPending ? "animate-pulse" : ""}`} />
                </button>
            </div>
        </header>
    );
};

export default MultiStepLoaderHeader;
