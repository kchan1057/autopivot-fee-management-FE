import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import SummaryPanel from './SummaryPanel';
import './MainLayout.css';

const MainLayout = ({ children, showSummary = true, summaryData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="main-layout">
      <Header />
      
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* 햄버거 메뉴 (모바일) */}
      <button 
        className="main-layout__hamburger"
        onClick={toggleSidebar}
        aria-label="메뉴 열기"
      >
        ☰
      </button>

      <main className="main-layout__content">
        {children}
      </main>

      {showSummary && <SummaryPanel data={summaryData} />}
    </div>
  );
};

export default MainLayout;