import { NavLink } from "react-router-dom";
export const SidebarLink = ({ to, icon: Icon, children, className }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-r-lg transition-colors relative ${
        isActive
          ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500 pl-2.5" // Line on left
          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent pl-3"
      } ${className || ""}`
    }
  >
    {Icon && <Icon size={20} />}
    <span>{children}</span>
  </NavLink>
);