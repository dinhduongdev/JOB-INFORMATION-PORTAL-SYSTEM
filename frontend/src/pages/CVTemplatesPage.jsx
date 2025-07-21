import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import html2pdf from 'html2pdf.js';
import '../css/CVTemplatesPage.css';
import { BsArrowLeft, BsTelephone, BsEnvelope, BsGeoAlt, BsCalendarEvent, BsDownload } from 'react-icons/bs';
import { fetchApplicantProfile } from '../features/applicant-profile/applicantProfileActions';
import { fetchJobTitles } from '../features/job-title/jobTitleAction';

const templates = [
  { id: 'classic', name: 'Classic', img: 'https://placehold.co/400x565/ffffff/333?text=Classic+Template' },
  { id: 'elegant', name: 'Elegant', img: 'https://placehold.co/400x565/1A2E4A/FFFFFF?text=Elegant+Template', recommended: true },
  { id: 'modern', name: 'Modern', img: 'https://placehold.co/400x565/EAEAEA/333?text=Modern+Template' },
  { id: 'creative', name: 'Creative', img: 'https://placehold.co/400x565/333333/FFFFFF?text=Creative+Template' },
];

// Sử dụng forwardRef cho CVPreviewComponent
const CVPreviewComponent = React.forwardRef(({ profile, template, color, jobTitles }, ref) => {
  const templateStyles = {
    classic: { backgroundColor: '#fff', color: '#333' },
    elegant: { backgroundColor: '#1A2E4A', color: '#fff' },
    modern: { backgroundColor: '#EAEAEA', color: '#333' },
    creative: { backgroundColor: '#333333', color: '#fff' },
  };
  const workExperienceText = profile.work_experiences
    .map(exp => `${exp.company_name} - ${jobTitles.find(jt => jt.id === exp.title)?.name || 'Unknown Title'} (${exp.start_date} - ${exp.end_date || 'Present'})`)
    .join('\n');
  const skillsText = profile.skills.map(skill => skill.name).join(', ');

  return (
    <div ref={ref} className="cv-preview-container" style={{ ...templateStyles[template.id], borderColor: color, width: '210mm', height: '297mm' }}>
      <div className="cv-header" style={{ backgroundColor: template.id === 'elegant' ? '#2a3b4c' : '#3d4a58' }}>
        <img src={profile.avatar || 'https://placehold.co/100x100/EFEFEF/333?text=PD'} alt="Avatar" className="cv-avatar" />
        <div className="cv-header-info">
          <h1>{profile.name || 'Phạm Đình Dương'}</h1>
          <p className="cv-title">{profile.title || 'ADD YOUR TITLE'}</p>
          <div className="cv-contact-info">
            <span><BsTelephone /> {profile.phone_number || 'Add your phone number'}</span>
            <span><BsCalendarEvent /> {profile.birth_date || 'Add your date of birth'}</span>
            <span><BsEnvelope /> {profile.user?.email || 'duongxummo@gmail.com'}</span>
            <span><BsGeoAlt /> {profile.address || 'Add your current location'}</span>
          </div>
        </div>
      </div>
      <div className="cv-body">
        <div className="cv-section">
          <div className="cv-section-title">About me</div>
          <div className="cv-section-content">{profile.description || 'Update your about me'}</div>
        </div>
        <div className="cv-section">
          <div className="cv-section-title">Education</div>
          <div className="cv-section-content text-muted">{profile.education || 'Update your education background'}</div>
        </div>
        <div className="cv-section">
          <div className="cv-section-title">Skills</div>
          <div className="cv-section-content text-muted">{skillsText || 'Update your specialist skills'}</div>
        </div>
        <div className="cv-section">
          <div className="cv-section-title">Work Experience</div>
          <div className="cv-section-content text-muted">{workExperienceText || 'Update your work experience'}</div>
        </div>
      </div>
    </div>
  );
});

const CVTemplatesPage = () => {
  const dispatch = useDispatch();
  const { profile, status } = useSelector((state) => state.applicantProfile || { profile: null, status: 'idle' });
  const { jobTitles, status: jobTitleStatus } = useSelector((state) => state.jobTitle || { jobTitles: [], status: 'idle' });
  const [selectedTemplate, setSelectedTemplate] = useState(templates[1]);
  const [selectedColor, setSelectedColor] = useState('#4A90E2');
  const [selectedLanguage, setSelectedLanguage] = useState('VI');
  const cvRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && (status === 'idle' || jobTitleStatus === 'idle')) {
      console.log('Fetching data with token:', token);
      dispatch(fetchApplicantProfile(token));
      dispatch(fetchJobTitles(token));
    } else if (!token) {
      console.warn('No token found in localStorage');
    }
  }, [dispatch, status, jobTitleStatus]);

  const handleDownloadPDF = () => {
    const element = cvRef.current;
    console.log('CV Element:', element); // Debug tham chiếu
    if (element) {
      html2pdf().from(element).set({
        margin: 10,
        filename: `${displayProfile.name}_CV.pdf`,
        html2canvas: { scale: 2, useCORS: true, logging: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).save().then(() => console.log('PDF downloaded successfully')).catch(err => console.error('PDF Error:', err));
    } else {
      console.error('CV element not found');
    }
  };

  const displayProfile = profile?.data || {
    name: 'Phạm Đình Dương',
    title: 'ADD YOUR TITLE',
    phone_number: 'Add your phone number',
    email: 'duongxummo@gmail.com',
    birth_date: 'Add your date of birth',
    address: 'Add your current location',
    avatar: 'https://placehold.co/100x100/EFEFEF/333?text=PD',
    description: 'Update your about me',
    education: 'Update your education background',
    skills: [],
    work_experiences: [],
    user: { email: 'duongxummo@gmail.com' },
  };

  return (
    <div className="templates-page">
      <header className="templates-header">
        <Link to="/tao-cv" className="back-link">
          <BsArrowLeft /> Back to update profile
        </Link>
        <div className="header-title">
          <img src="https://itviec.com/assets/logo-itviec-65afac80b834826d18235286e37ac5b33ef82a874339d0b58978de52641155fb.png" alt="ITviec Logo" style={{ height: '24px' }} />
          <span className="ms-2">CV TEMPLATE</span>
        </div>
        <div></div>
      </header>

      <main className="templates-body">
        <aside className="templates-sidebar">
          {templates.map(template => (
            <div
              key={template.id}
              className={`template-thumbnail ${selectedTemplate.id === template.id ? 'active' : ''}`}
              onClick={() => setSelectedTemplate(template)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedTemplate(template)}
              tabIndex={0}
              role="button"
              aria-label={`Select ${template.name} template`}
            >
              <img src={template.img} alt={template.name} />
              {template.recommended && <div className="recommended-badge">Recommended by recruiters</div>}
              <p className="template-name">{template.name}</p>
              {selectedTemplate.id === template.id && <div className="selected-overlay"><span className="checkmark">✔</span></div>}
            </div>
          ))}
        </aside>

        <section className="template-preview">
          <CVPreviewComponent ref={cvRef} profile={displayProfile} template={selectedTemplate} color={selectedColor} jobTitles={jobTitles} />
        </section>
      </main>

      <footer className="templates-footer">
        <div className="footer-options">
          <span>Color:</span>
          <button
            className={`color-swatch ${selectedColor === '#4A90E2' ? 'active' : ''}`}
            style={{ backgroundColor: '#4A90E2' }}
            onClick={() => setSelectedColor('#4A90E2')}
          ></button>
          <button
            className={`color-swatch ${selectedColor === '#50E3C2' ? 'active' : ''}`}
            style={{ backgroundColor: '#50E3C2' }}
            onClick={() => setSelectedColor('#50E3C2')}
          ></button>
          <span>Language:</span>
          <button
            className={`lang-btn ${selectedLanguage === 'EN' ? 'active' : ''}`}
            onClick={() => setSelectedLanguage('EN')}
          >
            EN
          </button>
          <button
            className={`lang-btn ${selectedLanguage === 'VI' ? 'active' : ''}`}
            onClick={() => setSelectedLanguage('VI')}
          >
            VI
          </button>
        </div>
        <div className="footer-actions">
          <span>Complete 70% of your profile to unlock Download CV</span>
          <button className="btn btn-red" onClick={handleDownloadPDF} disabled={status !== 'succeeded' || jobTitleStatus !== 'succeeded'}>
            <BsDownload /> Download CV
          </button>
        </div>
      </footer>
    </div>
  );
};

export default CVTemplatesPage;