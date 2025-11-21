'use client';

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Bell,
  CheckSquare,
  BarChart3,
  Target,
  DollarSign,
  Shield,
  Folder,
  LogOut
} from 'lucide-react';
import clsx from 'clsx';
import NavButton from './NavButton.jsx';

const Sidebar = ({ isOpen, setIsOpen, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuSections = [
    {
      id: 'main',
      title: 'Main Menu',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', path: '/api/v1/candidates/home' },
        { icon: Users, label: 'My Profile', id: 'profile', path: '/api/v1/candidates/profile' },
        { icon: CheckSquare, label: 'Join Interview', id: 'join-interview', path: '/api/v1/candidates/join' },
        { icon: BarChart3, label: 'Results', id: 'results', path: '/api/v1/candidates/results' },
        { icon: Bell, label: 'Notifications', id: 'notifications', path: '/api/v1/candidates/notifications' },
      ]
    },
    {
      id: 'interview-tools',
      title: 'Interview Tools',
      items: [
        { icon: FileText, label: 'Transcription', id: 'transcription', path: '/api/v1/candidates/transcription' },
        { icon: Target, label: 'Topic Coverage', id: 'topic-coverage', path: '/api/v1/candidates/topic-coverage' },
        { icon: DollarSign, label: 'Scorecard', id: 'scorecard', path: '/api/v1/candidates/scorecard' },
        { icon: Folder, label: 'Interview History', id: 'interview-history', path: '/api/v1/candidates/interview-history' },
      ]
    },
    {
      id: 'support',
      title: 'Support Tools',
      items: [
        { icon: Folder, label: 'Files', id: 'files', path: '/api/v1/candidates/files' },
        { icon: Shield, label: 'Security', id: 'security', path: '/api/v1/candidates/security' },
      ]
    }
  ];

  const handleItemClick = (path) => {
    navigate(path);
    if (isMobile) setIsOpen(false);
  };

  const isActiveItem = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
     {isMobile && isOpen && (
  <div
    className="fixed inset-0 bg-transparent z-40 lg:hidden"
    onClick={() => setIsOpen(false)}
  />
)}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
          // Width and translate adjustments
          isOpen
            ? isMobile
              ? 'w-40 sm:w-48 translate-x-0' // small width on mobile
              : 'w-64 translate-x-0'
            : isMobile
            ? 'w-16 -translate-x-full'
            : 'w-20 -translate-x-full',
          'lg:translate-x-0' // always visible on desktop
        )}
      >
        {/* Header */}
        <div className="p-2 sm:p-4 border-b border-gray-200 flex items-center justify-between min-h-16">
          <div className={clsx('flex items-center', isOpen ? 'gap-2 sm:gap-3' : 'justify-center w-full')}>
            <div className={clsx(
              'flex items-center justify-center rounded-lg shrink-0 text-white font-bold text-sm sm:text-lg',
              isMobile ? 'w-8 h-8 bg-blue-600' : 'w-10 h-10 bg-blue-600'
            )}>
              V
            </div>
            {isOpen && (
              <div className="min-w-0">
                <h1 className={clsx('truncate font-bold', isMobile ? 'text-sm' : 'text-xl')}>VIRQA</h1>
              </div>
            )}
          </div>

          {/* Close button on mobile */}
          {isMobile && isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
              aria-label="Close sidebar"
            >
              <X size={16} className={clsx(isMobile ? 'text-sm' : 'text-base')} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-3 py-2 space-y-1 overflow-y-auto">
          {menuSections.map((section) => (
            <div key={section.id} className="mb-3 sm:mb-4">
              {section.title && isOpen && (
                <div className="px-2 sm:px-3 py-1 text-[9px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </div>
              )}

              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavButton
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={isActiveItem(item.path)}
                    isCollapsed={!isOpen}
                    onClick={() => handleItemClick(item.path)}
                    isMobile={isMobile} // pass mobile info for styling inside NavButton
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-2 sm:p-3 border-t border-gray-200">
          <div className={clsx('flex items-center', isOpen ? 'gap-2 sm:gap-3' : 'justify-center')}>
            <div className={clsx(
              'rounded-full flex items-center justify-center border-2 border-white shadow-sm text-white text-xs font-bold shrink-0',
              isMobile ? 'w-6 h-6 bg-blue-500' : 'w-8 h-8 bg-blue-500'
            )}>
              JD
            </div>

            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className={clsx('truncate font-medium', isMobile ? 'text-xs' : 'text-sm')}>Jane Doe</p>
                <p className={clsx('truncate text-gray-500', isMobile ? 'text-[9px]' : 'text-xs')}>Administrator</p>
              </div>
            )}

            <button
              className="p-1 rounded-lg transition-all shrink-0 text-gray-500 hover:bg-gray-100"
              title="Logout"
              onClick={() => navigate('/login')}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
