import { SidebarLink } from "./EmployeeSidebarLinks";
import { LogOut } from "lucide-react";
export const Sidebar = ({ sidebarOpen, items }) => (
  <>
    <aside
      className={`bg-white shadow fixed lg:relative top-16 lg:top-0 z-50 flex flex-col w-64
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      style={{
        height: 'calc(100vh - 4rem)', // 100vh minus header height (64px = 4rem)
      }}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <ul className="space-y-2">
            {items.map((item) => (
              <SidebarLink key={item.name} to={item.path} icon={item.icon}>
                {item.name}
              </SidebarLink>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Logout at bottom - always visible */}
      <div className="p-4 border-t bg-white">
        <SidebarLink
          to="/logout"
          icon={LogOut}
          className="text-red-600 hover:bg-red-100 hover:text-red-700"
        >
          Logout
        </SidebarLink>
      </div>
    </aside>
  </>
);