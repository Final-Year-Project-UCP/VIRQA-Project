import { NavLink } from "react-router-dom";

const linkClass = (isActive, className) =>
  `flex items-center gap-3 p-3 rounded-r-lg transition-colors relative ${
    isActive
      ? "bg-blue-50 text-blue-700 font-medium border-l-4 border-blue-500 pl-2.5"
      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent pl-3"
  } ${className || ""}`;

export const SidebarLink = ({ to, icon: Icon, children, className, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left ${linkClass(false, className)}`}
      >
        {Icon && <Icon size={20} />}
        <span>{children}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) => linkClass(isActive, className)}
    >
      {Icon && <Icon size={20} />}
      <span>{children}</span>
    </NavLink>
  );
};