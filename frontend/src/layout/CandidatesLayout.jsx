import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import TopNavbar from "../components/common/TopNav";
import { useState, useEffect } from 'react';
import clsx from 'clsx';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile and set initial sidebar state
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        isMobile={isMobile}
      />
      
      {/* Main Content Area */}
      <div className={clsx(
        'flex-1 flex flex-col min-w-0 transition-all duration-300 h-full overflow-hidden',
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
      )}>
        <TopNavbar 
          sidebarOpen={sidebarOpen}
          onMenuToggle={toggleSidebar}
          isMobile={isMobile}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;