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
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#0a0a0a] scrollbar-hide">
      <NavigationBar onToggleSidebar={toggleSidebar} isExpanded={isSidebarExpanded}/>
      <div className="flex min-h-0 min-w-0 flex-1 items-stretch overflow-hidden">
        <div className="hidden min-h-0 shrink-0 md:flex">
          <SideBar isExpanded={isSidebarExpanded} />
        </div>
        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
