import React from 'react';
import './SocialLoginButton.css';

// ⚠️ 저장하신 통 이미지 파일 경로를 확인해주세요!
import kakaoButtonImg from '../../assets/images/kakao-logo.png'; 
import naverButtonImg from '../../assets/images/naver-logo.png';

const SocialLoginButton = ({ provider, onClick, disabled = false }) => {
  // provider에 따라 이미지 선택
  const buttonImages = {
    kakao: kakaoButtonImg,
    naver: naverButtonImg
  };

  return (
    <button
      className="social-img-btn"
      onClick={() => onClick(provider)}
      disabled={disabled}
      type="button"
    >
      <img 
        src={buttonImages[provider]} 
        alt={`${provider} 로그인`} 
      />
    </button>
  );
};

export default SocialLoginButton;