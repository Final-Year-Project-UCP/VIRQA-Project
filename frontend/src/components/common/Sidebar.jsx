import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Users,
  Bell,
  CheckSquare,
  BarChart3,
  Folder,
  LogOut,
  PhoneCall,
  MessageSquare,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../config/api';
import clsx from 'clsx';
import NavButton from './NavButton.jsx';
import Logo from './Logo.jsx';

const Sidebar = ({ isOpen, setIsOpen, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const { data: profileResponse } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.get('/user/profile'),
    staleTime: 5 * 60_000,
  });

  const profileData = profileResponse?.data?.data;
  const displayName = profileData?.fullName || 'User';
  const displayRole = profileData?.role ? (profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)) : 'Candidate';
  const initials = profileData?.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/user/logout'),
    onSuccess: () => {
      localStorage.removeItem('userRole');
      queryClient.clear();
      navigate('/login');
    },
    onError: () => {
      localStorage.removeItem('userRole');
      queryClient.clear();
      navigate('/login');
    },
  });

  const menuSections = [
    {
      id: 'main',
      title: 'Main Menu',
      items: [
        {
          icon: LayoutDashboard,
          label: 'Dashboard',
          id: 'dashboard',
          path: '/api/v1/candidates'
        },
        {
          icon: Users,
          label: 'My Profile',
          id: 'profile',
          path: '/api/v1/candidates/profile'
        },
        {
          icon: CheckSquare,
          label: 'Join Interview',
          id: 'join-interview',
          path: '/api/v1/candidates/join'
        },
        {
          icon: BarChart3,
          label: 'Results',
          id: 'results',
          path: '/api/v1/candidates/results'
        },
        {
          icon: Bell,
          label: 'Notifications',
          id: 'notifications',
          path: '/api/v1/candidates/notifications'
        }
      ]
    },

    {
      id: 'interview-tools',
      title: 'Interview Tools',
      items: [
        {
          icon: Folder,
          label: 'Interview History',
          id: 'interview-history',
          path: '/api/v1/candidates/interview-history'
        }
      ]
    },

    {
      id: 'support',
      title: 'Support Tools',
      items: [
        {
          icon: PhoneCall,
          label: 'Contact Us',
          id: 'contact-us',
          path: '/api/v1/candidates/contactus'
        },
        {
          icon: MessageSquare,
          label: 'Feedback',
          id: 'feedback',
          path: '/api/v1/candidates/feedback'
        }
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
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-white transition-all duration-300',
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
        <div className="p-2 sm:p-3 bg-[#1a56db] border-b border-blue-700/50 flex items-center justify-center min-h-16 relative text-white">
          <div className={clsx('flex items-center', isOpen ? 'gap-2 sm:gap-3' : 'justify-center w-full')}>
            <Logo
              theme="light"
              collapsed={!isOpen}
              isMobile={isMobile}
              className={!isOpen && isMobile ? "scale-90" : ""}
            />
          </div>

          {/* Close button on mobile */}
          {isMobile && isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-2 p-1 sm:p-2 rounded-lg hover:bg-white/10 text-white transition-colors shrink-0"
              aria-label="Close sidebar"
            >
              <X size={16} className={clsx(isMobile ? 'text-sm' : 'text-base')} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-3 py-2 space-y-1 overflow-y-auto border-r border-gray-200">
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
        <div className="p-2 sm:p-3 border-t border-gray-200 border-r border-gray-200">
          <div className={clsx('flex items-center', isOpen ? 'gap-2 sm:gap-3' : 'justify-center')}>
            <div className={clsx(
              'rounded-full flex items-center justify-center border-2 border-white shadow-sm text-white text-xs font-bold shrink-0 bg-blue-600 overflow-hidden',
              isMobile ? 'w-6 h-6' : 'w-8 h-8'
            )}>
              {profileData?.profilePhoto ? (
                <img src={profileData.profilePhoto} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>

            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className={clsx('truncate font-medium text-gray-800', isMobile ? 'text-xs' : 'text-sm')}>{displayName}</p>
                <p className={clsx('truncate text-gray-500', isMobile ? 'text-[9px]' : 'text-xs')}>{displayRole}</p>
              </div>
            )}

            <button
              className="p-1 rounded-lg transition-all shrink-0 text-gray-500 hover:bg-gray-100 disabled:opacity-60"
              title="Logout"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
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
