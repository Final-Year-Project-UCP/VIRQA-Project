import { useState } from "react";
import { Outlet} from "react-router-dom";
import { notifications,sidebarItems } from "../data/employeeSidebarData.js";
import { Sidebar } from "../components/common/EmployeeSidebar.jsx";
import { Header } from "../components/common/EmployeeHeader.jsx";

// Main layout
export default function EmployeesLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="h-screen w-full flex flex-col">
      <Header
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        notifications={notifications}
      />

      <div className="flex-1 flex pt-16 overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} items={sidebarItems}  />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-slate-50">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
