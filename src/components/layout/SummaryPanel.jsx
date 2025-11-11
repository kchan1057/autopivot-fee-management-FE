import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import './SummaryPanel.css';

const SummaryPanel = ({ data }) => {
  const {
    paidCount = 8,
    unpaidCount = 2,
    totalAmount = 300000,
    unpaidMembers = ['박민수', '최수진']
  } = data || {};

  const totalMembers = paidCount + unpaidCount;
  const paymentRate = ((paidCount / totalMembers) * 100).toFixed(0);

  const handleSendNotification = (memberName) => {
    if (window.confirm(`${memberName}님에게 알림을 보내시겠어요?`)) {
      alert(`${memberName}님에게 알림을 보냈습니다!`);
      // TODO: 실제 알림 전송 API 연동
    }
  };

  return (
    <div className="summary-panel">
      {/* 이번 달 요약 */}
      <Card padding="medium" className="summary-section">
        <h3 className="summary-title">📌 이번 달 요약</h3>
        
        <div className="summary-stat">
          <span className="summary-stat__label">✅ 납부:</span>
          <span className="summary-stat__value">{paidCount}명</span>
        </div>

        <div className="summary-stat">
          <span className="summary-stat__label">⏳ 미납:</span>
          <span className="summary-stat__value summary-stat__value--warning">
            {unpaidCount}명
          </span>
        </div>

        <div className="summary-stat">
          <span className="summary-stat__label">💵 총액:</span>
          <span className="summary-stat__value">
            {totalAmount.toLocaleString()}원
          </span>
        </div>

        <div className="summary-divider"></div>

        {/* 납부율 */}
        <div className="summary-progress">
          <div className="summary-progress__header">
            <span>납부율</span>
            <span className="summary-progress__percent">{paymentRate}%</span>
          </div>
          <div className="summary-progress__bar">
            <div 
              className="summary-progress__fill"
              style={{ width: `${paymentRate}%` }}
            ></div>
          </div>
        </div>
      </Card>

      {/* 알림 섹션 */}
      <Card padding="medium" className="summary-section">
        <h3 className="summary-title">🔔 알림</h3>
        
        {unpaidMembers.length > 0 ? (
          <>
            <p className="summary-alert-text">
              아직 회비를 내지 않은 회원이 있어요
            </p>
            <div className="summary-unpaid-list">
              {unpaidMembers.map((member, index) => (
                <div key={index} className="summary-unpaid-item">
                  <span className="summary-unpaid-name">• {member}</span>
                  <button
                    className="summary-unpaid-btn"
                    onClick={() => handleSendNotification(member)}
                  >
                    알림
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="summary-success-text">
            ✅ 모든 회원이 납부를 완료했어요!
          </p>
        )}
      </Card>

      {/* 음성 명령 */}
      <Card padding="medium" className="summary-section">
        <h3 className="summary-title">🎤 음성 명령</h3>
        
        <p className="summary-voice-hint">
          "회비 확인해줘"<br />
          "미납자 알려줘"
        </p>

        <Button 
          variant="outline" 
          size="medium" 
          fullWidth
          icon="🎤"
        >
          음성으로 말하기
        </Button>
      </Card>
    </div>
  );
};

export default SummaryPanel;