import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', path: '/dashboard', icon: '📊', label: '대시보드' },
    { id: 'fees', path: '/fees', icon: '💰', label: '회비 관리' },
    { id: 'members', path: '/members', icon: '👥', label: '멤버 관리' },
    { id: 'notices', path: '/notices', icon: '📢', label: '공지사항' },
    { id: 'settings', path: '/settings', icon: '⚙️', label: '설정' },
  ];

  const [chatbotOpen, setChatbotOpen] = useState(false);
  
  const handleMenuClick = (path) => {
    navigate(path);
    // 모바일에서는 메뉴 클릭 시 사이드바 닫기
    if(window.innerWidth <= 1024){
      onToggle();
    }
  };

  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
  };

  return (
    <>
      {/* 모바일에서 배경 어둡게 처리하는 오버레이 */}
      {isOpen && window.innerWidth <= 1024 && (
        <div className="sidebar__overlay" onClick={onToggle}></div>
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        
        {/* 메뉴 목록 */}
        <nav className="sidebar__menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar__item ${
                location.pathname === item.path ? 'sidebar__item--active' : ''
              }`}
              onClick={() => handleMenuClick(item.path)}
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__label">{item.label}</span>
              {/* 활성화된 메뉴에만 작게 표시되는 점 */}
              {location.pathname === item.path && (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', marginLeft: 'auto' }}></span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar__divider"></div>

        {/* 챗봇 토글 버튼 */}
        <button 
          className="sidebar__chatbot-toggle"
          onClick={toggleChatbot} 
        >
          <span className="sidebar__icon">🤖</span>
          <span className="sidebar__label">AI 비서</span>
          <span className="sidebar__arrow" style={{ marginLeft: 'auto', fontSize: '12px' }}>
            {chatbotOpen ? '▲' : '▼'}
          </span>
        </button>

        {/* 챗봇 힌트 메시지 */}
        {chatbotOpen && (
          <div className="sidebar__chatbot-hint" style={{ marginTop: '10px', padding: '12px', background: '#f1f5f9', borderRadius: '12px', fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>
            <strong>💡 팁</strong><br/>
            "지난달 회비 누가 안 냈어?"<br/>
            라고 물어보세요!
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;