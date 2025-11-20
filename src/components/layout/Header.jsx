import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

// 💡 래서판다 이미지를 헤더에도 쓰고 싶다면 아래 주석을 풀고 경로를 맞춰주세요!
// import logoImg from '../../assets/images/logo-character.png'; 

const Header = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || '사용자';

  const handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠어요? 😢')) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentGroupId');
      // localStorage.removeItem('userName'); // 필요하다면 이것도 삭제
      navigate('/login');
    }
  };

  return (
    <header className="header">
      {/* 좌측: 로고 영역 */}
      <div className="header__left" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        
        {/* 이미지 로고를 쓰고 싶으면 이 부분을 쓰세요 */}
        {/* <img src={logoImg} alt="로고" style={{ height: '40px' }} /> */}
        
        {/* 기본: 이모지 로고 */}
        <div className="header__logo">💰</div>
        
        <h1 className="header__title">오토피봇</h1>
      </div>

      {/* 우측: 사용자 정보 및 로그아웃 */}
      <div className="header__right">
        <span className="header__welcome">
          <strong>{userName}</strong>님, 안녕하세요!
        </span>
        
        <button 
          className="header__profile-btn" 
          title="내 정보 수정"
          onClick={() => navigate('/settings')} // 설정 페이지가 있다면 이동
        >
          👤
        </button>
        
        <button 
          className="header__logout-btn" 
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </header>
  );
};

export default Header;