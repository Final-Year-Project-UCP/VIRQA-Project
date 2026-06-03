import { NavLink } from "react-router-dom";

const linkClass = (isActive, className) =>
  `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 relative ${
    isActive
      ? "text-white bg-blue-600 shadow-md shadow-blue-100 font-medium"
      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium"
  } ${className || ""}`;

export const SidebarLink = ({ to, icon: Icon, children, className, onClick }) => {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`w-full text-left ${linkClass(false, className)}`}
      >
        {Icon && <Icon size={20} className="shrink-0" />}
        <span>{children}</span>
      </button>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) => linkClass(isActive, className)}
    >
      {Icon && <Icon size={20} className="shrink-0" />}
      <span>{children}</span>
    </NavLink>
  );
};