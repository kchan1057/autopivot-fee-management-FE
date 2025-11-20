import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// MainLayout 사용 안 함 (대시보드 전용 레이아웃 적용)
import './DashboardPage.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  
  const [userName, setUserName] = useState('회원');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ... (useEffect 및 로직 부분은 기존 코드와 100% 동일하게 유지합니다) ...
  // ✅ 코드가 길어서 생략했지만, 기존에 작성하신 로직 그대로 쓰시면 됩니다.
  // 아래 return 문만 변경해주세요.

  // -----------------[ 기존 로직 복붙 구간 시작 ]-----------------
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      navigate('/login', { replace: true });
      return;
    }
    const currentGroupId = localStorage.getItem('currentGroupId');
    if (!currentGroupId || currentGroupId === 'undefined' || currentGroupId === 'null') {
      alert('그룹을 먼저 선택해주세요.');
      navigate('/select-group', { replace: true });
      return;
    }
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedAscii = atob(base64);
      const utf8String = decodeURIComponent(Array.prototype.map.call(decodedAscii, (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
      const payload = JSON.parse(utf8String);
      setUserName(payload.name || '회원');
    } catch (error) {
      console.error('토큰 파싱 실패:', error);
      setUserName('회원');
    }
  }, [navigate]);

  const fetchDashboardData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      else setIsRefreshing(true);
      
      const groupId = localStorage.getItem('currentGroupId');
      if (!groupId) {
        navigate('/select-group', { replace: true });
        return;
      }
      
      const response = await fetch(`https://seongchan-spring.store/api/groups/${groupId}/dashboard`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      if (!response.ok) throw new Error('데이터 로딩 실패');

      const data = await response.json();
      setDashboardData(data);
      setLastUpdated(new Date(data.lastUpdated));
      
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
      // 에러 처리는 상황에 맞게
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const groupId = localStorage.getItem('currentGroupId');
    if (token && groupId) fetchDashboardData(true);
  }, [fetchDashboardData]);

  useEffect(() => {
    const interval = setInterval(() => {
      const groupId = localStorage.getItem('currentGroupId');
      if (groupId) fetchDashboardData(false);
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleManualRefresh = async () => {
    const groupId = localStorage.getItem('currentGroupId');
    if (!groupId) return;
    try {
      setIsRefreshing(true);
      await fetch(`https://seongchan-spring.store/api/groups/${groupId}/dashboard/refresh`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      await fetchDashboardData(false);
    } catch (error) {
      console.error('새로고침 오류:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  // -----------------[ 기존 로직 복붙 구간 끝 ]-----------------

  // 🎨 UI 렌더링 시작
  if (isLoading || !dashboardData) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    { id: 'fees', icon: '💰', title: '회비 관리', desc: '납부 현황 확인', path: '/fees' },
    { id: 'members', icon: '👥', title: '멤버 목록', desc: '우리 팀원 보기', path: '/members' },
    { id: 'notices', icon: '📢', title: '공지사항', desc: '새로운 소식', path: '/notices' }
  ];

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return date.toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        
        {/* 1. 헤더 영역 */}
        <div className="dashboard-header">
          <div className="header-greeting">
            <h2>반가워요, {userName}님! 👋</h2>
            <p>
              <span className="group-badge">GROUP</span>
              {dashboardData.groupName}
            </p>
          </div>
          
          <div className="refresh-container">
            <button 
              className="refresh-btn" 
              onClick={handleManualRefresh} 
              disabled={isRefreshing}
            >
              <span className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`}>🔄</span>
              새로고침
            </button>
            {lastUpdated && (
              <span className="last-updated">
                {lastUpdated.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })} 기준
              </span>
            )}
          </div>
        </div>

        {/* 2. 히어로 카드 (납부율 & 총액) */}
        <div className="hero-card">
          <div className="hero-header">
            <span className="hero-title">이번 달 회비 납부율</span>
          </div>
          
          <div className="hero-content">
            <div className="payment-rate-big">
              {dashboardData.paymentRate}%
            </div>
            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ width: `${dashboardData.paymentRate}%` }}
              ></div>
            </div>
            
            <div className="hero-stats-row">
              <div className="stat-pill">
                <label>납부 완료</label>
                <span>{dashboardData.paidMembers}명</span>
              </div>
              <div className="stat-pill">
                <label>미납</label>
                <span>{dashboardData.unpaidMembers}명</span>
              </div>
              <div className="stat-pill" style={{ background: 'rgba(255,255,255,0.3)' }}>
                <label>총 모인 금액</label>
                <span>{dashboardData.totalAmount?.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 빠른 실행 (위젯) */}
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <div 
              key={action.id} 
              className="action-card"
              onClick={() => navigate(action.path)}
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-title">{action.title}</span>
              <span className="action-desc">{action.desc}</span>
            </div>
          ))}
        </div>

        {/* 4. 하단 정보 그리드 (최근 활동 & 상세) */}
        <div className="dashboard-bottom-grid">
          
          {/* 왼쪽 패널: 상세 정보 (예시로 총 인원 등 표시, 필요시 다른 정보로 대체 가능) */}
          <div className="glass-panel">
            <h3 className="panel-title">📊 상세 현황</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
               <div className="activity-item">
                 <div className="activity-icon">💵</div>
                 <div className="activity-info">
                    <p className="activity-msg">총 목표 금액</p>
                    <strong>{(dashboardData.totalMembers * (dashboardData.fee || 0))?.toLocaleString() || 0}원</strong>
                 </div>
               </div>
               <div className="activity-item">
                 <div className="activity-icon">👥</div>
                 <div className="activity-info">
                    <p className="activity-msg">전체 멤버</p>
                    <strong>{dashboardData.totalMembers}명</strong>
                 </div>
               </div>
            </div>
             {/* 챗봇 버튼 */}
             <button 
                className="refresh-btn" 
                style={{ width: '100%', justifyContent: 'center', marginTop: '20px', background: '#f1f5f9', border: 'none' }}
                onClick={() => alert('준비 중입니다!')}
             >
               🤖 AI 비서에게 물어보기
             </button>
          </div>

          {/* 오른쪽 패널: 최근 입금 내역 */}
          <div className="glass-panel">
            <h3 className="panel-title">💳 최근 입금 내역</h3>
            
            {dashboardData.recentPayments && dashboardData.recentPayments.length > 0 ? (
              <div className="activity-list">
                {dashboardData.recentPayments.map((payment) => (
                  <div key={payment.paymentId} className="activity-item">
                    <div className="activity-icon">
                      {payment.status === 'PAID' ? '✅' : '⏳'}
                    </div>
                    <div className="activity-info">
                      <p className="activity-msg">
                        <strong>{payment.memberName}</strong>님이 입금했습니다.
                      </p>
                      <span className="activity-time">{formatTime(payment.paidAt)}</span>
                    </div>
                    <div style={{ fontWeight: '700', color: '#3b82f6' }}>
                      {payment.amount?.toLocaleString()}원
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>아직 입금 내역이 없어요.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;