import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import SideBar from '../components/SideBar';

const MainLayout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col scrollbar-hide">
      <NavigationBar onToggleSidebar={toggleSidebar} isExpanded={isSidebarExpanded}/>
      <div className="flex min-w-0 flex-1">
        <div className="hidden md:block">
          <SideBar isExpanded={isSidebarExpanded} />
        </div>
        <main className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
