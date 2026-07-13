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
      <div className="flex flex-1">
        <SideBar isExpanded={isSidebarExpanded} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
