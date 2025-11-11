// src/components/auth/SocialLoginButton.jsx
import React from 'react';
import './SocialLoginButton.css';

import kakaoButton from '../../assets/images/kakao-logo.png';
import naverButton from '../../assets/images/naver-logo.png';

const SocialLoginButton = ({ provider, onClick, disabled = false }) => {
  const buttonImages = {
    kakao: kakaoButton,
    naver: naverButton
  };

  return (
    <button
      className="social-login-btn-image"
      onClick={() => onClick(provider)}
      disabled={disabled}
    >
      <img 
        src={buttonImages[provider]} 
        alt={`${provider} 로그인`}
      />
    </button>
  );
};

export default SocialLoginButton;