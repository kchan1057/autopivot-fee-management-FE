import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button'; // 버튼은 유지 (스타일은 CSS로 제어 가능)
import './CreateGroupPage.css';

const CreateGroupPage = () => {
  const navigate = useNavigate();
  
  // 그룹 기본 정보
  const [groupName, setGroupName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [description, setDescription] = useState('');
  const [fee, setFee] = useState('');
  const [groupCategory, setGroupCategory] = useState('');
  
  // 엑셀 파일 관련
  const [hasExcelFile, setHasExcelFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [fileName, setFileName] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const groupCategories = [
    { value: 'CLUB', label: '🏀 동아리' }, // 아이콘 살짝 추가해서 예쁘게
    { value: 'STUDY', label: '📚 스터디' },
    { value: 'SOCIAL_GATHERING', label: '🍺 친목회' },
    { value: 'PROJECT', label: '💻 프로젝트' },
    { value: 'OTHER', label: '✨ 기타' }
  ];

  const generateAccountName = (name) => {
    if (!name.trim()) return '';
    return `${name.trim()} 모임 통장`;
  };

  const handleGroupNameChange = (e) => {
    const name = e.target.value;
    setGroupName(name);
    setAccountName(generateAccountName(name));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (!['xlsx', 'xls', 'csv'].includes(fileExtension)) {
        alert('엑셀 파일(.xlsx, .xls) 또는 CSV 파일만 업로드 가능합니다.');
        return;
      }
      setExcelFile(file);
      setFileName(file.name);
    }
  };

  const validateStep1 = () => {
    if (!groupName.trim()) {
      alert('그룹명을 입력해주세요.');
      return false;
    }
    if (!accountName.trim()) {
      alert('통장 이름을 입력해주세요.');
      return false;
    }
    if (!fee || fee <= 0) {
      alert('월 회비 금액을 입력해주세요.');
      return false;
    }
    if (!groupCategory) {
      alert('그룹 카테고리를 선택해주세요.');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasExcelFile === null) {
      alert('엑셀 파일 보유 여부를 선택해주세요.');
      return;
    }
    
    if (hasExcelFile && !excelFile) {
      alert('엑셀 파일을 업로드해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      
      const formData = new FormData();
      
      const groupData = {
        groupName: groupName.trim(),
        accountName: accountName.trim(),
        description: description.trim(),
        fee: parseInt(fee),
        groupCategory
      };
      
      formData.append('groupData', new Blob([JSON.stringify(groupData)], {
        type: 'application/json'
      }));
      
      if (hasExcelFile && excelFile) {
        formData.append('memberFile', excelFile);
      }

      const response = await fetch('https://seongchan-spring.store/api/groups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || '그룹 생성에 실패했습니다.');
      }

      const result = await response.json();
      
      alert('그룹이 성공적으로 생성되었습니다!');
      
      if (result.groupId || result.id) {
        localStorage.setItem('currentGroupId', result.groupId || result.id);
      }
      
      navigate('/dashboard');
      
    } catch (error) {
      console.error('그룹 생성 오류:', error);
      alert(error.message || '그룹 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-group-page">
      {/* 유리 카드 컨테이너 시작 (이 안에 모든 내용이 들어갑니다) */}
      <div className="create-group-glass-panel">
        
        {/* 헤더 */}
        <div className="create-group-header">
          <h1 className="create-group-title">
            {currentStep === 1 ? '그룹 만들기' : '멤버 초대하기'}
          </h1>
          <p className="create-group-subtitle">
            {currentStep === 1 
              ? '모임 관리를 위한 기본 정보를 알려주세요.'
              : '함께할 멤버들을 어떻게 추가할까요?'
            }
          </p>
        </div>

        {/* 진행 단계 (Progress Bar) */}
        <div className="progress-steps">
          <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="progress-step-number">1</div>
            <div className="progress-step-label">기본 정보</div>
          </div>
          <div className="progress-step-line"></div>
          <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="progress-step-number">2</div>
            <div className="progress-step-label">멤버 추가</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && (
            <div className="form-step">
              
              {/* 섹션 1: 기본 정보 */}
              <div className="form-section">
                <h3 className="form-section-title">📝 기본 정보</h3>
                
                <div className="form-group">
                  <label className="form-label required">그룹명</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="예: 2024 독서 모임"
                    value={groupName}
                    onChange={handleGroupNameChange}
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">통장 이름</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="자동으로 입력됩니다"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    maxLength={100}
                    readOnly={!accountName} // 자동 생성이므로 사용자가 수정 못하게 해도 좋지만, 일단 수정 가능하게 둠
                  />
                  <span className="form-hint">💡 입금 확인 시 표시될 통장 이름입니다.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">설명 (선택)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="어떤 모임인지 간단하게 소개해주세요."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={200}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label required">카테고리</label>
                  <div className="category-grid">
                    {groupCategories.map((cat) => (
                      <div
                        key={cat.value}
                        className={`category-option ${groupCategory === cat.value ? 'selected' : ''}`}
                        onClick={() => setGroupCategory(cat.value)}
                      >
                        {cat.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 섹션 2: 회비 정보 */}
              <div className="form-section">
                <h3 className="form-section-title">💰 회비 설정</h3>
                
                <div className="form-group">
                  <label className="form-label required">월 회비</label>
                  <div className="input-with-unit">
                    <input
                      type="number"
                      className="form-input"
                      placeholder="0"
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      min="0"
                      step="1000"
                    />
                    <span className="input-unit">원</span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <Button
                  type="button"
                  variant="primary"
                  size="large"
                  onClick={handleNextStep}
                  fullWidth
                  // 기존 Button 컴포넌트 스타일이 안 맞으면 style prop으로 강제 조정 가능
                  style={{ borderRadius: '16px', height: '54px', fontSize: '16px' }} 
                >
                  다음으로 계속하기
                </Button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {currentStep === 2 && (
            <div className="form-step">
              <div className="form-section">
                <h3 className="form-section-title">📁 멤버 일괄 추가</h3>
                <p className="form-hint" style={{ marginBottom: '20px', fontSize: '14px' }}>
                  엑셀 파일로 멤버를 한 번에 등록할 수 있습니다.<br/>
                  없으시면 건너뛰고 나중에 추가해도 됩니다.
                </p>

                <div className="excel-choice">
                  <div
                    className={`choice-card ${hasExcelFile === true ? 'selected' : ''}`}
                    onClick={() => {
                      setHasExcelFile(true);
                      setExcelFile(null);
                      setFileName('');
                    }}
                  >
                    <span className="choice-icon">📄</span>
                    <span className="choice-title">파일이 있어요</span>
                    <span className="choice-description">엑셀/CSV 업로드</span>
                  </div>

                  <div
                    className={`choice-card ${hasExcelFile === false ? 'selected' : ''}`}
                    onClick={() => {
                      setHasExcelFile(false);
                      setExcelFile(null);
                      setFileName('');
                    }}
                  >
                    <span className="choice-icon">✋</span>
                    <span className="choice-title">없어요</span>
                    <span className="choice-description">나중에 추가할게요</span>
                  </div>
                </div>

                {hasExcelFile === true && (
                  <div className="file-upload-section">
                    <div className="file-upload-area">
                      <input
                        type="file"
                        id="excel-file"
                        className="file-input"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="excel-file" className="file-upload-label">
                        {fileName ? (
                          <>
                            <span className="choice-icon">✅</span>
                            <p className="file-name">{fileName}</p>
                            <p className="file-hint">파일을 변경하려면 클릭하세요</p>
                          </>
                        ) : (
                          <>
                            <span className="choice-icon">📤</span>
                            <p className="file-upload-text">여기를 클릭해 파일을 업로드하세요</p>
                            <p className="file-hint">지원 형식: .xlsx, .xls, .csv</p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <Button
                  type="button"
                  variant="secondary"
                  size="large"
                  onClick={() => setCurrentStep(1)}
                  style={{ flex: 1, borderRadius: '16px', height: '54px' }}
                >
                  이전
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  disabled={isLoading}
                  style={{ flex: 2, borderRadius: '16px', height: '54px' }}
                >
                  {isLoading ? '생성 중...' : '완료 및 그룹 생성 🎉'}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateGroupPage;