import React, { useState } from 'react';
import '../css/CreateCVPage.css';
import  {useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BsPerson, BsBriefcase, BsEnvelope, BsBell, BsGear, BsPencil, 
  BsPlusCircle, BsTelephone, BsCalendar, BsGenderAmbiguous, 
  BsGeoAlt, BsLink45Deg, BsChevronDown, BsX, BsLightbulb 
} from 'react-icons/bs';
import { FiGrid, FiFileText, FiStar } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { fetchApplicantProfile } from '../features/applicant-profile/applicantProfileActions'; // Điều chỉnh đường dẫn nếu cần
import { fetchSkills, updateSkills } from '../features/skill/skillActions'; // Điều chỉnh đường dẫn nếu cần

const sections = [
  { id: 'about', title: 'Giới thiệu bản thân', description: 'Giới thiệu điểm mạnh và số năm kinh nghiệm của bạn' },
  { id: 'education', title: 'Học vấn', description: 'Chia sẻ trình độ học vấn của bạn' },
  { id: 'experience', title: 'Kinh nghiệm làm việc', description: 'Thể hiện những thông tin chi tiết về quá trình làm việc' },
  { id: 'skills', title: 'Kỹ năng', description: 'Liệt kê các kỹ năng chuyên môn của bạn' },
  { id: 'languages', title: 'Ngoại ngữ', description: 'Mô tả khả năng ngoại ngữ của bạn' },
];

// --- MODAL COMPONENTS ---

const AboutMeModal = ({ section, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h5>{section.title}</h5>
        <button onClick={onClose} className="modal-close-btn"><BsX /></button>
      </div>
      <div className="modal-body">
        <div className="tip-box d-flex align-items-center gap-2">
          <BsLightbulb /><strong>Tips:</strong> Summarize your professional experience, highlight your skills and your strengths.
        </div>
        <textarea placeholder="Nhập thông tin vào đây..."></textarea>
        <div className="text-end text-muted mt-1">0/2500 characters</div>
      </div>
      <div className="modal-footer">
        <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
        <button className="btn btn-red">Save</button>
      </div>
    </div>
  </div>
);

const WorkExperienceModal = ({ section, onClose }) => {
  const months = ["Month", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const currentYear = new Date().getFullYear();
  const years = ["Year", ...Array.from({ length: 30 }, (_, i) => currentYear - i)];
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>{section.title}</h5>
          <button onClick={onClose} className="modal-close-btn"><BsX /></button>
        </div>
        <div className="modal-body">
          <div className="form-group mb-3">
            <label className="form-label">Job title <span className="text-danger">*</span></label>
            <input type="text" className="form-control" />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Company <span className="text-danger">*</span></label>
            <input type="text" className="form-control" />
          </div>
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" id="currentWork" />
            <label className="form-check-label" htmlFor="currentWork">I am currently working here</label>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">From <span className="text-danger">*</span></label>
              <div className="d-flex gap-2">
                <select className="form-select">{months.map(m => <option key={`from-${m}`}>{m}</option>)}</select>
                <select className="form-select">{years.map(y => <option key={`from-${y}`}>{y}</option>)}</select>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label">To <span className="text-danger">*</span></label>
              <div className="d-flex gap-2">
                <select className="form-select">{months.map(m => <option key={`to-${m}`}>{m}</option>)}</select>
                <select className="form-select">{years.map(y => <option key={`to-${y}`}>{y}</option>)}</select>
              </div>
            </div>
          </div>
          <div className="form-group mt-3">
            <label className="form-label">Description</label>
            <div className="tip-box d-flex align-items-center gap-2 mt-2 mb-2">
              <BsLightbulb /><strong>Tips:</strong> Brief the company's industry, then detail your responsibilities and achievements. For projects, write on the <strong>"Project"</strong> field below.
            </div>
            <textarea className="form-control" rows="5"></textarea>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn btn-red">Save</button>
        </div>
      </div>
    </div>
  );
};

// Trong SkillsModal (trong CreateCVPage.jsx)
const SkillsModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { skills, status } = useSelector((state) => state.skill || { skills: [], status: 'idle' });
  const { profile } = useSelector((state) => state.applicantProfile || { profile: null });
  const [currentSkill, setCurrentSkill] = useState('');
  const [currentYears, setCurrentYears] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(profile?.skill_ids || []);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && status === 'idle') {
      dispatch(fetchSkills(token));
      
    }
  }, [dispatch, token, status]);

  const handleAddSkill = () => {
    if (currentSkill && !selectedSkills.includes(parseInt(currentSkill))) {
      setSelectedSkills([...selectedSkills, parseInt(currentSkill)]);
      setCurrentSkill('');
      setCurrentYears('');
    }
  };

  const removeSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter(id => id !== skillId));
  };

  const handleSave = () => {
    dispatch(updateSkills({ token, skillIds: selectedSkills })).then(() => {
      onClose();
    });
  };

  console.log('skills', skills);
  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>List skills ({selectedSkills.length}/20)</h5>
          <button onClick={onClose} className="modal-close-btn"><BsX /></button>
        </div>
        <div className="modal-body">
          <div className="row g-2 mb-3 align-items-end">
            <div className="col-sm-5">
              <label className="form-label">Search skills</label>
              <select
                className="form-select"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
              >
                <option value="" disabled>Select a skill</option>
                {skills.map((skill) => (
                  <option key={skill.id} value={skill.id} disabled={selectedSkills.includes(skill.id)}>
                    {skill.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-sm-5">
              <label className="form-label">Years of experience</label>
              <select
                className="form-select"
                value={currentYears}
                onChange={(e) => setCurrentYears(e.target.value)}
              >
                <option value="" disabled>Select years</option>
                {Array.from({ length: 21 }, (_, i) => i).map((y) => (
                  <option key={y} value={y}>{y} {y === 1 ? 'year' : 'years'}</option>
                ))}
              </select>
            </div>
            <div className="col-sm-2">
              <button className="btn btn-danger w-100" onClick={handleAddSkill}>+</button>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2 border-top pt-3 min-vh-25">
            {selectedSkills.length > 0 ? (
              selectedSkills.map((skillId) => {
                const skill = skills.find(s => s.id === skillId);
                return (
                  <div key={skillId} className="skill-tag">
                    <span>{skill ? skill.name : `Skill ${skillId}`} ({currentYears || 0} {currentYears === 1 ? 'year' : 'years'})</span>
                    <button onClick={() => removeSkill(skillId)} className="skill-tag-remove-btn"><BsX size={16} /></button>
                  </div>
                );
              })
            ) : (
              <p className="text-muted w-100 text-center mt-4">No skills added yet.</p>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn btn-red" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};


const CreateCVPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState(null);
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.applicantProfile);

  // Gọi API khi component mount
  useEffect(() => {
    const token = localStorage.getItem('token'); // Giả sử token được lưu trong localStorage
    if (token) {
      dispatch(fetchApplicantProfile(token));
    }
  }, [dispatch]);

  const handleOpenModal = (section) => {
    const enabledSections = ['about', 'experience', 'skills'];
    if (enabledSections.includes(section.id)) {
      setCurrentSection(section);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSection(null);
  };

  const renderModal = () => {
    if (!isModalOpen || !currentSection) return null;
    switch (currentSection.id) {
      case 'about': return <AboutMeModal section={currentSection} onClose={handleCloseModal} />;
      case 'experience': return <WorkExperienceModal section={currentSection} onClose={handleCloseModal} />;
      case 'skills': return <SkillsModal section={currentSection} onClose={handleCloseModal} />;
      default: return null;
    }
  };

  // Hiển thị dữ liệu từ profile nếu có
  useEffect(() => {
    if (status === 'succeeded' && profile) {
      console.log('Applicant Profile:', profile);
      // Cập nhật UI với dữ liệu từ profile nếu cần
    }
    if (status === 'failed' && error) {
      console.error('Error fetching profile:', error);
    }
  }, [status, profile, error]);

  return (
    <>
      <div className="cv-page-body">
        <div className="container-fluid px-5">
          <div className="row">
            <div className="col-lg-2">
              <div className="left-sidebar">
                <ul className="nav flex-column">
                  <li className="nav-item"><a className="nav-link" href="#"><BsPerson /> Xin chào <br/><strong>Phạm Đình Dương</strong></a></li>
                  <li className="nav-item"><a className="nav-link" href="#"><FiGrid /> Tổng quan</a></li>
                  <li className="nav-item"><a className="nav-link" href="#"><FiFileText /> Hồ sơ đính kèm</a></li>
                  <li className="nav-item"><a className="nav-link active" href="#"><FiStar /> Hồ sơ ITviec</a></li>
                  <li className="nav-item"><a className="nav-link" href="#"><BsBriefcase /> Việc làm của tôi</a></li>
                  <li className="nav-item"><a className="nav-link" href="#"><BsEnvelope /> Lời mời công việc</a></li>
                  <li className="nav-item"><a className="nav-link" href="#"><BsEnvelope /> Đăng ký nhận email</a></li>
                  <li className="nav-item"><a className="nav-link" href="#"><BsBell /> Thông báo</a></li>
                  <li className="nav-item"><a className="nav-link" href="#"><BsGear /> Cài đặt</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="main-content">
                <div className="card p-4 mb-4">
                  <div className="profile-header">
                    <img src="https://placehold.co/80x80/EFEFEF/333?text=PD" alt="Avatar" className="profile-avatar" />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h4 className="fw-bold mb-1">{profile?.data.user.full_name}</h4>
                        <button className="btn btn-light btn-sm"><BsPencil /></button>
                      </div>
                      <p className="text-muted">Cập nhật chức danh</p>
                      <div className="row">
                        <div className="col-md-6"><div className="profile-details"><span><BsEnvelope/> {profile?.data.user.email || 'duongxummo@gmail.co...'}</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsTelephone/> {profile?.data.phone_number || 'Số điện thoại'}</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsCalendar/> {profile?.birthDate || 'Ngày sinh'}</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsGenderAmbiguous/> {profile?.gender || 'Giới tính'}</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsGeoAlt/> {profile?.address || 'Địa chỉ hiện tại'}</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsLink45Deg/> {profile?.personalLink || 'Link cá nhân'}</span></div></div>
                      </div>
                    </div>
                  </div>
                </div>
                {sections.map(section => {
                  const isEnabled = ['about', 'experience', 'skills'].includes(section.id);
                  return (
                    <div className="card section-card" key={section.id}>
                      <div className="section-card-header">
                        <div><h5>{section.title}</h5><p>{section.description}</p></div>
                        <button className="btn btn-light" onClick={() => handleOpenModal(section)} disabled={!isEnabled}>
                          <BsPlusCircle className={isEnabled ? "text-danger" : "text-muted"} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-lg-3">
              <div className="right-sidebar">
                <div className="card">
                  <h5 className="fw-bold">Độ hoàn thiện hồ sơ</h5>
                  <div className="progress-circle"><div className="progress-circle-inner">{profile?.completionPercentage || '70%'}</div></div>
                  <p className="text-muted">Nâng cấp hồ sơ của bạn lên <strong>{profile?.completionPercentage || '70%'}</strong> để tối mẫu CV dành cho chuyên gia IT.</p>
                  <ul className="completion-list">
                    <li><BsPlusCircle className="text-danger"/> Thêm Giới thiệu bản thân</li>
                    <li><BsPlusCircle className="text-danger"/> Thêm Thông tin cá nhân</li>
                    <li><BsPlusCircle className="text-danger"/> Thêm Kinh nghiệm làm việc</li>
                    <li><BsChevronDown /> Thêm thông tin khác</li>
                  </ul>
                  <Link to="/profile-cv/cv-templates" className="btn btn-red mt-3">Xem và Tải CV</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderModal()}
    </>
  );
};

export default CreateCVPage;