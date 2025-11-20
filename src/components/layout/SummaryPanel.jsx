import React from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import './SummaryPanel.css';

const SummaryPanel = ({ data }) => {
  const {
    paidCount = 0,
    unpaidCount = 0,
    totalAmount = 0,
    unpaidMembers = []
  } = data || {};

  const totalMembers = paidCount + unpaidCount;
  const paymentRate = totalMembers > 0 ? ((paidCount / totalMembers) * 100).toFixed(0) : 0;

  const handleSendNotification = (memberName) => {
    if (window.confirm(`${memberName}님에게 납부 요청 알림을 보내시겠어요?`)) {
      alert(`${memberName}님에게 알림을 보냈습니다! 🔔`);
    }
  };

  return (
    <div className="summary-panel">
      {/* 1. 이번 달 요약 카드 */}
      <Card className="summary-section">
        <h3 className="summary-title">📌 이번 달 현황</h3>
        
        <div className="summary-stat">
          <span className="summary-stat__label">✅ 납부 완료</span>
          <span className="summary-stat__value">{paidCount}명</span>
        </div>

        <div className="summary-stat">
          <span className="summary-stat__label">⏳ 미납</span>
          <span className="summary-stat__value summary-stat__value--warning">
            {unpaidCount}명
          </span>
        </div>

        <div className="summary-stat" style={{ borderBottom: 'none', paddingTop: '12px' }}>
          <span className="summary-stat__label">💵 모인 금액</span>
          <span className="summary-stat__value" style={{ color: '#3b82f6', fontSize: '18px' }}>
            {totalAmount.toLocaleString()}원
          </span>
        </div>

        {/* 납부율 프로그레스 바 */}
        <div className="summary-progress">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: '#64748b' }}>
            <span>납부율</span>
            <span>{paymentRate}%</span>
          </div>
          <div className="summary-progress__bar">
            <div 
              className="summary-progress__fill"
              style={{ width: `${paymentRate}%` }}
            ></div>
          </div>
        </div>
      </Card>

      {/* 2. 알림(미납자) 섹션 */}
      <Card className="summary-section">
        <h3 className="summary-title">🔔 미납 멤버 알림</h3>
        
        {unpaidMembers.length > 0 ? (
          <>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
              터치하여 독촉 알림을 보내보세요!
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {unpaidMembers.map((member, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'white', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>{member}</span>
                  <button
                    className="summary-unpaid-btn"
                    onClick={() => handleSendNotification(member)}
                  >
                    알림 보내기
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#10b981' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎉</div>
            <p style={{ fontWeight: '700' }}>와우! 모두 납부했어요!</p>
          </div>
        )}
      </Card>

      {/* 3. 음성 명령 */}
      <Card className="summary-section">
        <h3 className="summary-title">🎤 음성 명령</h3>
        
        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6', marginBottom: '16px', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
          "이번 달 총무 누구야?"<br />
          "미납자한테 전체 알림 보내줘"
        </p>

        <Button 
          variant="outline" 
          size="small" 
          fullWidth
          style={{ borderRadius: '12px', borderStyle: 'dashed' }}
          onClick={() => alert('마이크 권한을 확인해주세요!')}
        >
          🎙️ 눌러서 말하기
        </Button>
      </Card>
    </div>
  );
};

export default SummaryPanel;