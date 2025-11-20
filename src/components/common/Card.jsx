import React from 'react';
import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  title, 
  subtitle, 
  actions, 
  padding = 'medium', // padding 옵션 (small, medium, large)
  hover = false,      // hover 효과 여부
  ...rest             // onClick, style 등 나머지 props 전달용
}) => {
  return (
    <div 
      className={`card ${hover ? 'card--hover' : ''} ${className}`} 
      {...rest} // 👈 이게 있어야 onClick이 작동합니다!
    >
      {(title || subtitle || actions) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className={`card-body padding-${padding}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;