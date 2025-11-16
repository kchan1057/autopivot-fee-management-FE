import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './MemberPage.css';

function MemberPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // 새 멤버 입력 폼
  const [newMember, setNewMember] = useState({
    studentId: '',
    name: '',
    amount: 0,
    account: 'ICON 모임통장'
  });

  // 더미 멤버 데이터 (학번 추가)
  const [members, setMembers] = useState([
    { id: 1, studentId: '214732', name: '김철수', amount: 15000, account: 'ICON 모임통장', paid: true },
    { id: 2, studentId: '214803', name: '이영희', amount: 15000, account: 'ICON 모임통장', paid: true },
    { id: 3, studentId: '223456', name: '박민수', amount: 17000, account: 'ICON 모임통장', paid: true },
    { id: 4, studentId: '231234', name: '정수진', amount: 0, account: 'ICON 모임통장', paid: false },
    { id: 5, studentId: '225678', name: '김성찬', amount: 15000, account: 'ICON 모임통장', paid: true },
    { id: 6, studentId: '247890', name: '정주훤', amount: 15000, account: 'ICON 모임통장', paid: true },
    { id: 7, studentId: '253421', name: '최민수', amount: 0, account: 'ICON 모임통장', paid: false },
    { id: 8, studentId: '241122', name: '강다혜', amount: 15000, account: 'ICON 모임통장', paid: true }
  ]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log('파일 선택됨:', selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('파일을 먼저 선택해주세요!');
      return;
    }
    alert('파일 업로드 기능은 백엔드 연동 후 사용 가능합니다!');
  };

  // 수동 멤버 추가
  const handleAddMember = () => {
    if (!newMember.studentId || !newMember.name) {
      alert('학번과 이름은 필수입니다!');
      return;
    }

    if (newMember.studentId.length !== 6) {
      alert('학번은 6자리여야 합니다!');
      return;
    }

    const memberToAdd = {
      id: members.length + 1,
      studentId: newMember.studentId,
      name: newMember.name,
      amount: parseInt(newMember.amount) || 0,
      account: newMember.account,
      paid: parseInt(newMember.amount) > 0
    };

    setMembers([...members, memberToAdd]);
    setShowAddModal(false);
    setNewMember({
      studentId: '',
      name: '',
      amount: 0,
      account: 'ICON 모임통장'
    });
    alert('멤버가 추가되었습니다!');
  };

  return (
    <div className="member-page">
      <div className="member-page__container">
        
        {/* 헤더 */}
        <div className="member-page__header">
          <button className="back-button" onClick={() => navigate('/dashboard')}>
            ← 돌아가기
          </button>
          <h1 className="member-page__title">👥 멤버 관리</h1>
          <p className="member-page__subtitle">엑셀 파일을 업로드하거나 수동으로 멤버를 추가하세요</p>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="member-page__content">
          
          {/* 왼쪽: 멤버 리스트 (메인) */}
          <div className="member-list-main">
            <h3 className="section-title">
              📋 멤버 목록 ({members.length}명)
            </h3>
            
            <div className="member-table-wrapper">
              <table className="member-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>학번</th>
                    <th>이름</th>
                    <th>납부 금액</th>
                    <th>계좌</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => (
                    <tr key={member.id} className={member.paid ? 'paid' : 'unpaid'}>
                      <td>{index + 1}</td>
                      <td className="member-student-id">{member.studentId}</td>
                      <td className="member-name">{member.name}</td>
                      <td className="member-amount">{member.amount.toLocaleString()}원</td>
                      <td>{member.account}</td>
                      <td>
                        <span className={`status-badge ${member.paid ? 'status-paid' : 'status-unpaid'}`}>
                          {member.paid ? '✅ 납부 완료' : '⏳ 미납'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 통계 카드 */}
            <div className="stats-section">
              <Card className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <div className="stat-label">납부 완료</div>
                  <div className="stat-value">
                    {members.filter(m => m.paid).length}명
                  </div>
                </div>
              </Card>
              
              <Card className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <div className="stat-label">미납</div>
                  <div className="stat-value">
                    {members.filter(m => !m.paid).length}명
                  </div>
                </div>
              </Card>
              
              <Card className="stat-card">
                <div className="stat-icon">💵</div>
                <div className="stat-content">
                  <div className="stat-label">총 납부액</div>
                  <div className="stat-value">
                    {members.reduce((sum, m) => sum + m.amount, 0).toLocaleString()}원
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* 오른쪽: 파일 업로드 + 수동 추가 (사이드바) */}
          <div className="upload-sidebar">
            {/* 파일 업로드 */}
            <Card className="upload-card-mini">
              <h4 className="upload-card-mini__title">📁 멤버 파일 올리기</h4>
              
              <div className="upload-area-mini">
                <input
                  type="file"
                  id="file-input"
                  className="file-input"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-input" className="file-label-mini">
                  <div className="file-icon-mini">📄</div>
                  <div className="file-text-mini">
                    {file ? file.name : '파일 선택'}
                  </div>
                </label>
              </div>

              <Button onClick={handleUpload}>
                {uploading ? '업로드 중...' : '업로드'}
              </Button>
            </Card>

            {/* 수동 멤버 추가 버튼 */}
            <div style={{ marginTop: '16px' }}>
              <Button onClick={() => setShowAddModal(true)}>
                ➕ 수동으로 멤버 추가
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* 멤버 추가 모달 */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">➕ 새 멤버 추가</h3>
            
            <div className="form-group">
              <label>학번 (6자리) *</label>
              <input
                type="text"
                maxLength="6"
                placeholder="예: 214732"
                value={newMember.studentId}
                onChange={(e) => setNewMember({...newMember, studentId: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>이름 *</label>
              <input
                type="text"
                placeholder="예: 홍길동"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>납부 금액</label>
              <input
                type="number"
                placeholder="0"
                value={newMember.amount}
                onChange={(e) => setNewMember({...newMember, amount: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>계좌</label>
              <input
                type="text"
                value={newMember.account}
                onChange={(e) => setNewMember({...newMember, account: e.target.value})}
              />
            </div>

            <div className="modal-buttons">
              <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                취소
              </button>
              <button className="btn-submit" onClick={handleAddMember}>
                추가하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberPage;