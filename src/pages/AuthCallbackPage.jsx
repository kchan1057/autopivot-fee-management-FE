// src/pages/AuthCallbackPage.jsx
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');
    const message = searchParams.get('message');

    if (error) {
      alert(`로그인 실패: ${message || '다시 시도해주세요.'}`);
      navigate('/login');
      return;
    }

    if (token) {
      // JWT 토큰 저장
      localStorage.setItem('accessToken', token);
      
      // TODO: 토큰에서 사용자 정보 추출하거나 별도 API 호출
      // 일단은 대시보드로 이동
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div className="login-loading-spinner"></div>
      <div>
        <h2>로그인 처리 중...</h2>
        <p>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;