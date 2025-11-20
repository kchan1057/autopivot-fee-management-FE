import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import SummaryPanel from './SummaryPanel';
import './MainLayout.css'; // 여기에 오로라 배경 및 레이아웃 CSS가 들어있습니다.

const MainLayout = ({ children, showSummary = true, summaryData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="main-layout">
      {/* 1. 헤더 (상단 고정 유리 패널) */}
      <Header />
      
      {/* 2. 사이드바 (좌측 고정 유리 패널) */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* 3. 모바일용 햄버거 버튼 (화면 작을 때만 등장) */}
      <button 
        className="main-layout__hamburger"
        onClick={toggleSidebar}
        aria-label="메뉴 열기"
      >
        <span style={{ fontSize: '24px', marginTop: '2px' }}>☰</span>
      </button>

      {/* 4. 메인 콘텐츠 영역 */}
      <main className="main-layout__content">
        {children}
      </main>

      {/* 5. 우측 요약 패널 (설정에 따라 보임/숨김) */}
      {showSummary && <SummaryPanel data={summaryData} />}
    </div>
  );
};

export default MainLayout;