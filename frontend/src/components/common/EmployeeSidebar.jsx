import { SidebarLink } from "./EmployeeSidebarLinks";
import { LogOut } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/api.js";

export const Sidebar = ({ sidebarOpen, items }) => {
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
    <>
      <aside
        className={`fixed lg:relative top-16 lg:top-0 z-40 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 flex flex-col w-64
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 font-sans`}
      >
        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main Menu
          </div>
          <ul className="space-y-1.5">
            {items.map((item) => (
              <li key={item.path}>
                <SidebarLink to={item.path} icon={item.icon}>
                  {item.name}
                </SidebarLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout at bottom */}
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
              v2.4.0 • Employer Panel
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};