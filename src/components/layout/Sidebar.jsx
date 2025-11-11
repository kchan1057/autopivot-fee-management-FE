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
        if(window.innerWidth <= 1024){
            onToggle();
        }
    };

    const toggleChatbot = () => {
        setChatbotOpen(!chatbotOpen);
    };

    return (
        <>
            <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
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
                        </button>
                    ))}
                </nav>
                <div className="sidebar__divider"></div>

                <button 
                    className="sidebar__chatbot-toggle"
                    onClick={toggleChatbot} 
                >
                    <span className="sidebar__icon">💬</span>
                    <span className="sidebar__label">챗봇 도우미</span>
                    <span className="sidebar__arrow">{chatbotOpen ? '▲' : '▼'}</span>
                </button>

                {chatbotOpen && (
                    <div className="sidebar__chatbot-hint">
                        우측 하단에서<br />
                        챗봇을 열 수 있어요!
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;