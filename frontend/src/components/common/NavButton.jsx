// NavButton.jsx - Professional Minimal Style matching Admin/Employee theme
import React from 'react';
import clsx from 'clsx';

const NavButton = ({ icon: Icon, label, isActive = false, isCollapsed = false, onClick, isMobile = false }) => {
  // Adjust padding and size for mobile/collapsed states
  const padding = isCollapsed
    ? isMobile
      ? 'p-2'
      : 'p-3'
    : isMobile
    ? 'px-3 py-2 gap-2.5'
    : 'px-4 py-2.5 gap-3';

  const iconSize = isMobile ? 18 : 20;
  const textSize = isMobile ? 'text-[10px]' : 'text-sm';
  
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        aria-label={isCollapsed ? label : undefined}
        aria-current={isActive ? 'page' : undefined}
        className={clsx(
          'relative w-full flex items-center rounded-xl transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50',
          padding,
          // Active & hover states
          isActive
            ? 'text-white bg-blue-600 shadow-md shadow-blue-100 font-medium'
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600 font-medium'
        )}
      >
        {/* Icon */}
        <Icon
          size={iconSize}
          strokeWidth={2}
          className={clsx(
            'relative shrink-0 transition-colors duration-200',
            isActive
              ? 'text-white scale-105'
              : 'text-gray-500 group-hover:text-blue-600'
          )}
        />

        {/* Label */}
        {!isCollapsed && (
          <span
            className={clsx(
              `relative transition-colors duration-200 font-medium tracking-wide ${textSize}`,
              isActive ? 'text-white' : 'text-gray-700 group-hover:text-blue-600'
            )}
          >
            {label}
          </span>
        )}
      </button>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div
          className={clsx(
            'absolute left-full top-1/2 -translate-y-1/2 ml-2 sm:ml-4 px-3 py-1.5',
            'bg-gray-900 text-white text-[9px] sm:text-xs font-semibold rounded-lg',
            'shadow-lg border border-gray-800',
            'whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50',
            'transition-all duration-300 ease-out',
            'translate-x-2 sm:translate-x-4 group-hover:translate-x-0'
          )}
        >
          {label}
          <div
            className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-gray-800"
          />
        </div>
      )}
    </div>
  );
};

export default NavButton;
