import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || '사용자';

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠어요?')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userName');
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header__left">
        <div className="header__logo">💰</div>
        <h1 className="header__title">오토피봇</h1>
      </div>

      <div className="header__right">
        <span className="header__welcome">{userName}님 환영합니다</span>
        <button className="header__profile-btn">
          👤
        </button>
        <button className="header__logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default Header;