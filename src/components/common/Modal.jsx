import React from 'react';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = '알림', 
  message, 
  type = 'alert' // 'alert' (확인 버튼만) 또는 'confirm' (예/아니오)
}) => {
  if (!isOpen) return null;

  // 배경 클릭 시 닫기 (선택사항)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      // onClose(); // 배경 눌렀을 때 닫히게 하려면 주석 해제
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-container">
        {/* 타입에 따라 아이콘 다르게 */}
        <div className="modal-icon">
          {type === 'confirm' ? '🤔' : '📢'}
        </div>
        
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        
        <div className="modal-actions">
          {type === 'confirm' && (
            <button className="modal-btn modal-btn-cancel" onClick={onClose}>
              취소
            </button>
          )}
          <button 
            className="modal-btn modal-btn-confirm" 
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;