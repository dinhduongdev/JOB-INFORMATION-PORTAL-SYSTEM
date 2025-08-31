import React, { useState } from 'react';
import '../css/CreateCVPage.css';
import  {useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  BsPerson, BsBriefcase, BsEnvelope, BsBell, BsGear, BsPencil, 
  BsPlusCircle, BsTelephone, BsCalendar, BsGenderAmbiguous, 
  BsGeoAlt, BsLink45Deg, BsChevronDown, BsX, BsLightbulb, 
  BsPen
} from 'react-icons/bs';
import { FiGrid, FiFileText, FiStar } from "react-icons/fi";
import { Link } from 'react-router-dom';
import { fetchApplicantProfile, updateApplicantProfile } from '../features/applicant-profile/applicantProfileActions'; // Điều chỉnh đường dẫn nếu cần
import { fetchSkills } from '../features/skill/skillActions'; // Điều chỉnh đường dẫn nếu cần
import { fetchJobTitles } from '../features/job-title/jobTitleAction';
import { fetchWorkExperiences, createWorkExperience, updateWorkExperience } from '../features/work-experience/workExperienceAction';


const sections = [
  { id: 'about', title: 'Giới thiệu bản thân', description: 'Giới thiệu điểm mạnh và số năm kinh nghiệm của bạn' },
  { id: 'education', title: 'Học vấn', description: 'Chia sẻ trình độ học vấn của bạn' },
  { id: 'experience', title: 'Kinh nghiệm làm việc', description: 'Thể hiện những thông tin chi tiết về quá trình làm việc' },
  { id: 'skills', title: 'Kỹ năng', description: 'Liệt kê các kỹ năng chuyên môn của bạn' },
  { id: 'languages', title: 'Ngoại ngữ', description: 'Mô tả khả năng ngoại ngữ của bạn' },
];

// --- MODAL COMPONENTS ---

const AboutMeModal = ({ section, onClose }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.applicantProfile || { profile: null });
  const [description, setDescription] = useState(profile?.data?.description || '');
  const token = localStorage.getItem('token');

  const handleSave = () => {
    if (description.trim()) {
      dispatch(updateApplicantProfile({ token, data: { description } })).then(() => {
        onClose();
      }).catch((err) => console.error("Update failed:", err));
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
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
          <textarea
            placeholder="Nhập thông tin vào đây..."
            value={description}
            onChange={handleDescriptionChange}
            maxLength={2500}
          ></textarea>
          <div className="text-end text-muted mt-1">{description.length}/2500 characters</div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn btn-red" onClick={handleSave} disabled={!description.trim()}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};



const WorkExperienceModal = ({ section, onClose, selectedExperience }) => {
  const dispatch = useDispatch();
  const { jobTitles, status: jobTitleStatus } = useSelector((state) => state.jobTitle || { jobTitles: [], status: 'idle' });
  const { workExperiences, status: workExpStatus } = useSelector((state) => state.workExperience || { workExperiences: [], status: 'idle' });
  const token = localStorage.getItem('token');

  const [companyName, setCompanyName] = useState('');
  const [jobTitleId, setJobTitleId] = useState('');
  const [startDate, setStartDate] = useState({ month: '', year: '' });
  const [endDate, setEndDate] = useState({ month: '', year: '' });
  const [isCurrent, setIsCurrent] = useState(false);

  const months = ["Month", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  const currentYear = new Date().getFullYear();
  const years = ["Year", ...Array.from({ length: 30 }, (_, i) => currentYear - i)];

  useEffect(() => {
    if (token && jobTitleStatus === 'idle') {
      dispatch(fetchJobTitles(token));
    }
    if (token && workExpStatus === 'idle') {
      dispatch(fetchWorkExperiences(token));
    }
  }, [dispatch, token, jobTitleStatus, workExpStatus]);

  // Điền dữ liệu khi chỉnh sửa
  useEffect(() => {
    if (selectedExperience) {
      setCompanyName(selectedExperience.company_name || '');
      setJobTitleId(selectedExperience.title?.toString() || '');
      const start = selectedExperience.start_date ? selectedExperience.start_date.split('-') : ['', ''];
      const end = selectedExperience.end_date ? selectedExperience.end_date.split('-') : ['', ''];
      setStartDate({ month: start[1] || '', year: start[0] || '' });
      setEndDate({ month: end[1] || '', year: end[0] || '' });
      setIsCurrent(!selectedExperience.end_date);
    } else {
      // Reset khi tạo mới
      setCompanyName('');
      setJobTitleId('');
      setStartDate({ month: '', year: '' });
      setEndDate({ month: '', year: '' });
      setIsCurrent(false);
    }
  }, [selectedExperience]);

  const handleSave = async () => {
    if (companyName && jobTitleId && startDate.month !== 'Month' && startDate.year !== 'Year') {
      const workExperience = {
        company_name: companyName,
        title: parseInt(jobTitleId),
        start_date: `${startDate.year}-${startDate.month}-01`,
        end_date: isCurrent ? null : `${endDate.year}-${endDate.month}-01`,
      };

      try {
        let newWorkExperienceId;
        if (selectedExperience) {
          // Chế độ chỉnh sửa: cập nhật work-experience hiện có
          await dispatch(updateWorkExperience({
            token,
            workExperienceId: selectedExperience.id,
            workExperience,
          })).unwrap();
          newWorkExperienceId = selectedExperience.id;
        } else {
          // Chế độ tạo mới
          const createResponse = await dispatch(createWorkExperience({ token, workExperience })).unwrap();
          newWorkExperienceId = createResponse.id;
        }

        // Cập nhật profile với work_experience_id mới
        await dispatch(updateApplicantProfile({
          token,
          data: { work_experience_ids: [newWorkExperienceId] },
        })).unwrap();
        onClose();
      } catch (err) {
        console.error("Update failed:", err);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>{selectedExperience ? 'Edit Experience' : 'Add New Experience'}</h5>
          <button onClick={onClose} className="modal-close-btn"><BsX /></button>
        </div>
        <div className="modal-body">
          <div className="form-group mb-3">
            <label className="form-label">Job title <span className="text-danger">*</span></label>
            <select
              className="form-control"
              value={jobTitleId}
              onChange={(e) => setJobTitleId(e.target.value)}
            >
              <option value="" disabled>Select a job title</option>
              {jobTitles.map((jobTitle) => (
                <option key={jobTitle.id} value={jobTitle.id}>
                  {jobTitle.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Company <span className="text-danger">*</span></label>
            <input
              type="text"
              className="form-control"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="currentWork"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="currentWork">I am currently working here</label>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">From <span className="text-danger">*</span></label>
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  value={startDate.month}
                  onChange={(e) => setStartDate({ ...startDate, month: e.target.value })}
                >
                  {months.map(m => <option key={`from-${m}`}>{m}</option>)}
                </select>
                <select
                  className="form-select"
                  value={startDate.year}
                  onChange={(e) => setStartDate({ ...startDate, year: e.target.value })}
                >
                  {years.map(y => <option key={`from-${y}`}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label">To <span className="text-danger">*</span></label>
              <div className="d-flex gap-2">
                <select
                  className="form-select"
                  value={endDate.month}
                  onChange={(e) => setEndDate({ ...endDate, month: e.target.value })}
                  disabled={isCurrent}
                >
                  {months.map(m => <option key={`to-${m}`}>{m}</option>)}
                </select>
                <select
                  className="form-select"
                  value={endDate.year}
                  onChange={(e) => setEndDate({ ...endDate, year: e.target.value })}
                  disabled={isCurrent}
                >
                  {years.map(y => <option key={`to-${y}`}>{y}</option>)}
                </select>
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
          <button className="btn btn-red" onClick={handleSave} disabled={!companyName || !jobTitleId || startDate.month === 'Month' || startDate.year === 'Year'}>
            {selectedExperience ? 'Update' : 'Save'}
          </button>
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
  const [selectedSkills, setSelectedSkills] = useState(() => {
    return profile?.data?.skills ? [...new Set(profile.data.skills.map(skill => skill.id))] : [];
  });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token && status === 'idle') {
      dispatch(fetchSkills(token));
    }
  }, [dispatch, token, status]);

  useEffect(() => {
    if (profile?.data?.skills) {
      setSelectedSkills([...new Set(profile.data.skills.map(skill => skill.id))]);
    }
  }, [profile]);

  const handleAddSkill = () => {
    if (currentSkill && !selectedSkills.includes(parseInt(currentSkill))) {
      setSelectedSkills([...selectedSkills, parseInt(currentSkill)]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillId) => {
    setSelectedSkills(selectedSkills.filter(id => id !== skillId));
  };

  const handleSave = () => {
    dispatch(updateApplicantProfile({ token, data: { skill_ids: selectedSkills } })).then(() => {
      onClose();
    }).catch((err) => console.error("Update failed:", err));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h5>List skills ({selectedSkills.length}/20)</h5>
          <button onClick={onClose} className="modal-close-btn"><BsX /></button>
        </div>
        <div className="modal-body">
          <div className="row g-2 mb-3 align-items-end">
            <div className="col-sm-6">
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
            <div className="col-sm-2">
              <button className="btn btn-danger w-100 mt-4" onClick={handleAddSkill}>+</button>
            </div>
          </div>
          <div className="d-flex flex-wrap gap-2 border-top pt-3 min-vh-25">
            {selectedSkills.length > 0 ? (
              selectedSkills.map((skillId) => {
                const skill = skills.find(s => s.id === skillId);
                return (
                  <div key={skillId} className="skill-tag">
                    <span>{skill ? skill.name : `Skill ${skillId}`}</span>
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
  const [selectedExperience, setSelectedExperience] = useState(null); // Lưu kinh nghiệm đang chỉnh sửa
  const dispatch = useDispatch();
  const { profile, status: profileStatus } = useSelector((state) => state.applicantProfile || { profile: null, status: 'idle' });
  const { workExperiences, status: workExpStatus } = useSelector((state) => state.workExperience || { workExperiences: [], status: 'idle' });
  const { jobTitles, status: jobTitleStatus } = useSelector((state) => state.jobTitle || { jobTitles: [], status: 'idle' }); // Thêm jobTitles
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      dispatch(fetchApplicantProfile(token));
      dispatch(fetchSkills(token));
      dispatch(fetchJobTitles(token));
      dispatch(fetchWorkExperiences(token));
    }
  }, [dispatch, token]);

  const handleOpenModal = (section) => {
    const enabledSections = ['about', 'experience', 'skills'];
    if (enabledSections.includes(section.id)) {
      setCurrentSection(section);
      setSelectedExperience(null); // Mở modal trống cho tạo mới
      setIsModalOpen(true);
    }
  };

  const handleEditExperience = (experience) => {
    setCurrentSection({ id: 'experience', title: 'Kinh nghiệm làm việc' });
    setSelectedExperience(experience);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSection(null);
    setSelectedExperience(null);
  };

  const renderModal = () => {
    if (!isModalOpen || !currentSection) return null;
    switch (currentSection.id) {
      case 'about': return <AboutMeModal section={currentSection} onClose={handleCloseModal} />;
      case 'experience': return <WorkExperienceModal section={currentSection} onClose={handleCloseModal} selectedExperience={selectedExperience} />;
      case 'skills': return <SkillsModal section={currentSection} onClose={handleCloseModal} />;
      default: return null;
    }
  };

  console.log("profile", profile);
  

  return (
    <>
      <div className="cv-page-body">
        <div className="container-fluid px-5">
          <div className="row">
            <div className="col-lg-2">
              <div className="left-sidebar">
                <ul className="nav flex-column">
                  <li className="nav-item"><a className="nav-link" href="#"><BsPerson /> Xin chào <br/><strong>{profile?.data?.user?.full_name || "..."}</strong></a></li>
                  <li className="nav-item"><a className="nav-link" href="#"><FiGrid /> Tổng quan</a></li>
                  <Link to="/profile-cv/stored" className="nav-item"><a className="nav-link" href="#"><FiFileText /> Hồ sơ của tôi</a></Link>
                  <li className="nav-item"><a className="nav-link active" href="#"><FiStar /> Hồ sơ ITviec</a></li>
                  <Link to="/profile-cv/applied-jobs" className="nav-item">
                    <a className="nav-link" href="#"><BsBriefcase /> Việc làm của tôi</a>
                  </Link>
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
                        <h4 className="fw-bold mb-1">{profile?.data?.user?.full_name || "..."}</h4>
                        <button className="btn btn-light btn-sm"><BsPencil /></button>
                      </div>
                      <p className="text-muted">Cập nhật chức danh</p>
                      <div className="row">
                        <div className="col-md-6"><div className="profile-details"><span><BsEnvelope/> {profile?.data?.user.email || 'duongxummo@gmail.co...'}</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsTelephone/> {profile?.data?.phone_number || 'Số điện thoại'}</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsCalendar/> {profile?.data?.birth_date || 'Ngày sinh'}</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsGeoAlt/> {profile?.data?.address || 'Địa chỉ hiện tại'}</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsLink45Deg/> {profile?.data?.personalLink || 'Link cá nhân'}</span></div></div>
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
                      {section.id === 'experience' && profile?.data?.work_experiences?.length > 0 && (
                        <div className="section-card-body">
                          {profile.data.work_experiences.map((exp, index) => (
                            <div key={exp.id} className="experience-item d-flex justify-content-between align-items-center p-2">
                              <span>{exp.company_name} - {jobTitles.find(jt => jt.id === exp.title)?.name || 'Unknown Title'}</span>
                              <button className="btn btn-sm btn-light" onClick={() => handleEditExperience(exp)}><BsPen /></button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="col-lg-3">
              <div className="right-sidebar">
                <div className="card">
                  <h5 className="fw-bold">Độ hoàn thiện hồ sơ</h5>
                  <div className="progress-circle"><div className="progress-circle-inner">{profile?.data?.completionPercentage || '70%'}</div></div>
                  <p className="text-muted">Nâng cấp hồ sơ của bạn lên <strong>{profile?.data?.completionPercentage || '70%'}</strong> để tối mẫu CV dành cho chuyên gia IT.</p>
                  <ul className="completion-list">
                    <li><BsPlusCircle className="text-danger"/> Thêm Giới thiệu bản thân</li>
                    <li><BsPlusCircle className="text-danger"/> Thêm Thông tin cá nhân</li>
                    <li><BsPlusCircle className="text-danger"/> Thêm Kinh nghiệm làm việc</li>
                    <li><BsChevronDown /> Thêm thông tin khác</li>
                  </ul>
                  <Link to="/profile-cv/cv-templates" className="btn btn-red mt-3">Xem và Tải CV</Link>
                  <Link to="/profile-cv/stored" className="btn btn-red mt-3">Đăng tải CV</Link>
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