// NavButton.jsx - Responsive Neumorphic / Glassmorphic Style
import React from 'react';
import clsx from 'clsx';

const NavButton = ({ icon: Icon, label, isActive = false, isCollapsed = false, onClick, isMobile = false }) => {
  // Adjust padding and size for mobile
  const padding = isCollapsed
    ? isMobile
      ? 'p-2'
      : 'p-4'
    : isMobile
    ? 'px-3 py-2 gap-2'
    : 'px-5 py-4 gap-4';

  const iconSize = isMobile ? 18 : 22;
  const textSize = isMobile ? 'text-[10px]' : 'text-sm';
  
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        aria-label={isCollapsed ? label : undefined}
        aria-current={isActive ? 'page' : undefined}
        className={clsx(
          'relative w-full flex items-center rounded-2xl transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/30',
          padding,
          // Neumorphic / glass effect
          'bg-gray-50/80 backdrop-blur-xl',
          'shadow-lg shadow-gray-500/10 ring-1 ring-gray-900/5',
          // Active & hover states
          isActive
            ? 'shadow-2xl shadow-blue-500/20 ring-blue-500/50 -translate-y-0.5'
            : 'hover:shadow-xl hover:shadow-gray-500/20 hover:-translate-y-px group-hover:ring-gray-900/10'
        )}
      >
        {/* Inner glass highlight */}
        <span className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/30 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Active pill indicator */}
        {isActive && (
          <span className="absolute inset-y-2 left-2 w-1 bg-blue-500 rounded-full shadow-md shadow-blue-500/50" />
        )}

        {/* Icon */}
        <Icon
          size={iconSize}
          strokeWidth={2.2}
          className={clsx(
            'relative shrink-0 transition-all duration-300',
            isActive
              ? 'text-blue-600 drop-shadow-md scale-110'
              : 'text-gray-600 group-hover:text-gray-900 group-hover:scale-105'
          )}
        />

        {/* Label */}
        {!isCollapsed && (
          <span
            className={clsx(
              `relative font-semibold tracking-wide transition-all duration-300 ${textSize}`,
              isActive ? 'text-blue-700' : 'text-gray-700 group-hover:text-gray-900'
            )}
          >
            {label}
          </span>
        )}

        {/* Micro ripple */}
        <span className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <span className="absolute inset-0 bg-blue-400/20 scale-0 group-active:scale-150 transition-transform duration-700 rounded-2xl" />
        </span>
      </button>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div
          className={clsx(
            'absolute left-full top-1/2 -translate-y-1/2 ml-2 sm:ml-4 px-3 sm:px-4 py-1.5 sm:py-2.5',
            'bg-white/90 backdrop-blur-2xl text-gray-800 text-[9px] sm:text-xs font-semibold rounded-xl',
            'shadow-2xl shadow-gray-900/20 border border-white/50',
            'whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50',
            'transition-all duration-400 ease-out',
            'translate-x-2 sm:translate-x-4 group-hover:translate-x-0'
          )}
        >
          {label}
          <div
            className="absolute right-full top-1/2 -translate-y-1/2 w-3 h-3 bg-white/90 rotate-45 border-l border-b border-white/50"
            style={{ boxShadow: '-2px 2px 8px rgba(0,0,0,0.1)' }}
          />
        </div>
      )}
    </div>
  );
};

export default NavButton;
