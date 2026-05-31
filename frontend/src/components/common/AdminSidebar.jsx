import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/api.js";

export const AdminSidebar = ({ sidebarOpen, items }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

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
        <aside
            className={`fixed lg:relative top-16 lg:top-0 z-40 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 flex flex-col w-72
            transition-transform duration-300 ease-spring
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 font-sans`}
        >
            {/* Scrollable Menu Area */}
            <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin scrollbar-thumb-gray-200">
                <div className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Main Menu
                </div>
                <ul className="space-y-1.5">
                    {items.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end
                                className={({ isActive }) =>
                                    `relative flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden
                                    ${isActive
                                        ? "text-white shadow-md bg-blue-600 shadow-blue-200"
                                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center gap-3 relative z-10">
                                            <item.icon
                                                size={20}
                                                className={`transition-colors duration-300 ${isActive ? "text-white" : "text-gray-500 group-hover:text-blue-600"
                                                    }`}
                                            />
                                            <span className="font-medium tracking-wide text-sm">{item.name}</span>
                                        </div>

                                        {/* Active/Hover Indicator */}
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="absolute inset-0 bg-blue-600 z-0"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}

                                        {!isActive && (
                                            <ChevronRight
                                                size={16}
                                                className="text-gray-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Logout Section */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group disabled:opacity-60"
                >
                    <LogOut size={20} className="text-gray-500 group-hover:text-red-500 transition-colors" />
                    <span className="font-medium text-sm">
                        {logoutMutation.isPending ? "Signing out..." : "Sign Out"}
                    </span>
                </button>

                <div className="mt-4 px-4 text-center">
                    <p className="text-[10px] text-gray-400 font-medium tracking-wider">
                        v2.4.0 • Admin Panel
                    </p>
                </div>
            </div>
        </aside>
    );
};
