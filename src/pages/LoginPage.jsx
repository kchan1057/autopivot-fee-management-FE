import React, { useState } from 'react';
import SocialLoginButton from '../components/auth/SocialLoginButton';
import './LoginPage.css';
import logoCharacter from '../assets/images/logo-character.png';

const LoginPage = () => { 
  const [loading, setLoading] = useState(false);

  const handleSocialLogin = async (provider) => {
    if (provider === 'kakao') {
      setLoading(true);
      window.location.href = 'https://seongchan-spring.store/api/auth/kakao-login';
    } else if (provider === 'naver') {
      alert('네이버 로그인은 준비 중입니다.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        
        <div className="login-header">
          {/* 마스코트 이미지 영역 */}
          <div className="login-mascot-container">
             <img src={logoCharacter} alt="오토피봇 마스코트" className="login-mascot-img" />
          </div>
          
          <h1 className="login-title">오토피봇</h1>
          <p className="login-subtitle">
            복잡하고 힘든 회비 관리,<br/>이제 자동으로 시작하세요.
          </p>
        </div>

        <div className="login-buttons">
          <SocialLoginButton 
            provider="kakao" 
            onClick={handleSocialLogin}
            disabled={loading}
          />
          <SocialLoginButton 
            provider="naver" 
            onClick={handleSocialLogin}
            disabled={loading}
          />
        </div>

        <div className="login-footer">
          <p className="login-helper-text">
            처음이신가요? 걱정 마세요!<br />
            로그인 한 번으로 모든 준비가 끝납니다.
          </p>
        </div>

        {loading && (
          <div className="login-loading-overlay">
            <div className="login-loading-spinner"></div>
            <p className="login-loading-text">잠시만 기다려주세요...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;