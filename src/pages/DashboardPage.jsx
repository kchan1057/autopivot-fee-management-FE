import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ChatBot from '../components/ChatBot';
import './DashboardPage.css';

// ✨ groupId 유효성 검증 유틸리티 함수
const isValidGroupId = (groupId) => {
  return groupId && groupId !== 'undefined' && groupId !== 'null';
};

// 🎨 세련된 SVG 아이콘 컴포넌트들
const Icons = {
  // 새로고침 아이콘
  Refresh: ({ className }) => (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
      <path d="M16 16h5v5"/>
    </svg>
  ),
  
  // 회비 관리 (지갑 아이콘)
  Wallet: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/>
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>
    </svg>
  ),
  
  // 멤버 목록 (사용자들 아이콘)
  Users: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  
  // 그룹 설정 (톱니바퀴 아이콘)
  Settings: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  
  // 총 목표 금액 (동전 쌓인 아이콘)
  Coins: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6"/>
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18"/>
      <path d="M7 6h1v4"/>
      <path d="m16.71 13.88.7.71-2.82 2.82"/>
    </svg>
  ),
  
  // 전체 멤버 (사용자 그룹 아이콘)
  UserGroup: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 21a8 8 0 0 0-16 0"/>
      <circle cx="10" cy="8" r="5"/>
      <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/>
    </svg>
  ),
  
  // AI 챗봇 (스파클 아이콘)
  Sparkles: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  ),
  
  // 체크 완료 (체크 서클)
  CheckCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22,4 12,14.01 9,11.01"/>
    </svg>
  ),
  
  // 대기중 (시계)
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  )
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [userName, setUserName] = useState('회원');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 🤖 챗봇 상태 추가
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  // ✅ 최우선: URL에서 token 처리 및 인증/그룹 체크
  useEffect(() => {
    // 1. URL 파라미터에서 token 확인 (OAuth 콜백)
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      console.log('URL에서 token 발견, localStorage에 저장');
      localStorage.setItem('accessToken', tokenFromUrl);
      // URL에서 token 파라미터 제거 (보안)
      window.history.replaceState({}, '', '/dashboard');
    }

    // 2. 토큰 체크
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('토큰 없음, 로그인 페이지로 이동');
      navigate('/login', { replace: true });
      return;
    }

    // 3. groupId 체크 - 없으면 즉시 리다이렉트
    const currentGroupId = localStorage.getItem('currentGroupId');
    if (!isValidGroupId(currentGroupId)) {
      console.log('groupId 없음 또는 유효하지 않음, select-group으로 이동');
      navigate('/select-group', { replace: true });
      return;
    }

    // 4. 토큰에서 사용자 정보 파싱
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedAscii = atob(base64);
      const utf8String = decodeURIComponent(
        Array.prototype.map.call(
          decodedAscii, 
          (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
      );
      const payload = JSON.parse(utf8String);
      setUserName(payload.name || '회원');
    } catch (error) {
      console.error('토큰 파싱 실패:', error);
      setUserName('회원');
    }
  }, [navigate, searchParams]);

  // 대시보드 데이터 가져오기
  const fetchDashboardData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      else setIsRefreshing(true);
      
      const groupId = localStorage.getItem('currentGroupId');
      
      // ✅ 개선된 groupId 검증
      if (!isValidGroupId(groupId)) {
        console.warn('유효하지 않은 groupId:', groupId);
        navigate('/select-group', { replace: true });
        return;
      }
      
      const response = await fetch(
        `https://seongchan-spring.store/api/groups/${groupId}/dashboard`, 
        {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
          }
        }
      );

      if (!response.ok) throw new Error('데이터 로딩 실패');

      const data = await response.json();
      setDashboardData(data);
      setLastUpdated(new Date(data.lastUpdated));
      
    } catch (error) {
      console.error('데이터 로딩 오류:', error);
      toast.error('데이터를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [navigate]);

  // 초기 데이터 로드
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const groupId = localStorage.getItem('currentGroupId');
    
    if (token && isValidGroupId(groupId)) {
      fetchDashboardData(true);
    }
  }, [fetchDashboardData]);

  // ✅ 자동 새로고침 (60초마다) - 개선된 검증
  useEffect(() => {
    const interval = setInterval(() => {
      const groupId = localStorage.getItem('currentGroupId');
      
      // ✅ 핵심 수정: 'undefined', 'null' 문자열도 체크
      if (isValidGroupId(groupId)) {
        fetchDashboardData(false);
      } else {
        console.warn('자동 새로고침 건너뜀: 유효하지 않은 groupId');
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // ✅ 수동 새로고침 - 개선된 검증
  const handleManualRefresh = async () => {
    const groupId = localStorage.getItem('currentGroupId');
    
    if (!isValidGroupId(groupId)) {
      toast.error('그룹을 먼저 선택해주세요.');
      navigate('/select-group');
      return;
    }
    
    const loadingToast = toast.loading('데이터 갱신 중...');
    
    try {
      setIsRefreshing(true);
      await fetch(
        `https://seongchan-spring.store/api/groups/${groupId}/dashboard/refresh`, 
        {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
          }
        }
      );
      await fetchDashboardData(false);
      toast.success('새로고침 완료!', { id: loadingToast });
    } catch (error) {
      console.error('새로고침 오류:', error);
      toast.error('데이터 갱신 중 오류가 발생했습니다.', { id: loadingToast });
    } finally {
      setIsRefreshing(false);
    }
  };

  // 🤖 챗봇 열기
  const handleOpenChatBot = () => {
    const groupId = localStorage.getItem('currentGroupId');
    
    if (!isValidGroupId(groupId)) {
      toast.error('그룹을 먼저 선택해주세요.');
      navigate('/select-group');
      return;
    }
    
    setIsChatBotOpen(true);
  };

  // 시간 포맷 함수
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    return date.toLocaleDateString('ko-KR', { 
      month: 'numeric', 
      day: 'numeric' 
    });
  };

  // 로딩 화면
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

  // 빠른 실행 메뉴 - SVG 아이콘으로 교체
  const quickActions = [
    { 
      id: 'fees', 
      icon: <Icons.Wallet />, 
      title: '회비 관리', 
      desc: '납부 현황 확인', 
      path: '/fees' 
    },
    { 
      id: 'members', 
      icon: <Icons.Users />, 
      title: '멤버 목록', 
      desc: '우리 팀원 보기', 
      path: '/members' 
    },
    { 
      id: 'groupSettings',
      icon: <Icons.Settings />,
      title: '그룹 설정',
      desc: '그룹 정보 수정',
      path: '/group-settings'
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        
        {/* 1. 헤더 영역 */}
        <div className="dashboard-header">
          <div className="header-greeting">
            <h2>반가워요, {userName}님!</h2>
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
              <Icons.Refresh className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
              새로고침
            </button>
            {lastUpdated && (
              <span className="last-updated">
                {lastUpdated.toLocaleTimeString('ko-KR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })} 기준
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
              <div className="stat-pill stat-pill--highlight">
                <label>총 모인 금액</label>
                <span>{dashboardData.totalAmount?.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. 빠른 실행 */}
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <div 
              key={action.id} 
              className="action-card"
              onClick={() => navigate(action.path)}
            >
              <span className="action-icon">{action.icon}</span>
              <div className="action-text">
                <span className="action-title">{action.title}</span>
                <span className="action-desc">{action.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 4. 하단 정보 그리드 */}
        <div className="dashboard-bottom-grid">
          
          {/* 상세 현황 패널 */}
          <div className="glass-panel">
            <h3 className="panel-title">상세 현황</h3>
            <div className="status-list">
              <div className="status-item">
                <div className="status-icon status-icon--coins">
                  <Icons.Coins />
                </div>
                <div className="status-info">
                  <span className="status-label">총 목표 금액</span>
                  <strong className="status-value">
                    {(dashboardData.totalMembers * (dashboardData.fee || 0))
                      ?.toLocaleString() || 0}원
                  </strong>
                </div>
              </div>
              <div className="status-item">
                <div className="status-icon status-icon--users">
                  <Icons.UserGroup />
                </div>
                <div className="status-info">
                  <span className="status-label">전체 멤버</span>
                  <strong className="status-value">{dashboardData.totalMembers}명</strong>
                </div>
              </div>
            </div>
            
            {/* 🤖 AI 비서 버튼 - 챗봇 열기 */}
            <button 
              className="chatbot-trigger-btn" 
              onClick={handleOpenChatBot}
            >
              <Icons.Sparkles />
              AI 비서 총총이에게 물어보기
            </button>
          </div>

          {/* 최근 입금 내역 패널 */}
          <div className="glass-panel">
            <h3 className="panel-title">최근 입금 내역</h3>
            
            {dashboardData.recentPayments && dashboardData.recentPayments.length > 0 ? (
              <div className="activity-list">
                {dashboardData.recentPayments.map((payment) => (
                  <div key={payment.paymentId} className="activity-item">
                    <div className="activity-icon">
                      {payment.status === 'PAID' ? <Icons.CheckCircle /> : <Icons.Clock />}
                    </div>
                    <div className="activity-info">
                      <p className="activity-msg">
                        <strong>{payment.memberName}</strong>님이 입금했습니다.
                      </p>
                      <span className="activity-time">
                        {formatTime(payment.paidAt)}
                      </span>
                    </div>
                    <div className="activity-amount">
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

      {/* 🤖 챗봇 컴포넌트 */}
      <ChatBot 
        isOpen={isChatBotOpen}
        onClose={() => setIsChatBotOpen(false)}
        groupId={localStorage.getItem('currentGroupId')}
      />
    </div>
  );
};

export default DashboardPage;