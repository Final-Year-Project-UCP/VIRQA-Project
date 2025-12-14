import { useState } from "react";
import { Outlet } from "react-router-dom";
import { notifications, sidebarItems } from "../data/adminSidebarData.js";
import { AdminSidebar } from "../components/common/AdminSidebar.jsx";
import MultiStepLoaderHeader from "../components/common/AdminHeader.jsx";

// Main layout for Admin
export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="h-screen w-full flex flex-col">
            <MultiStepLoaderHeader
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                notifications={notifications}
            />

            <div className="flex-1 flex pt-16 overflow-hidden">
                <AdminSidebar sidebarOpen={sidebarOpen} items={sidebarItems} />

                <div className="flex-1 overflow-auto p-6">
                    <div className="h-full">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}
