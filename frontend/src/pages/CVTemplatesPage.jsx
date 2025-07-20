import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/CVTemplatesPage.css';
import { BsArrowLeft, BsTelephone, BsEnvelope, BsGeoAlt, BsCalendarEvent } from 'react-icons/bs';

const templates = [
  { id: 'classic', name: 'Classic', img: 'https://placehold.co/400x565/ffffff/333?text=Classic+Template' },
  { id: 'elegant', name: 'Elegant', img: 'https://placehold.co/400x565/1A2E4A/FFFFFF?text=Elegant+Template', recommended: true },
  { id: 'modern', name: 'Modern', img: 'https://placehold.co/400x565/EAEAEA/333?text=Modern+Template' },
  { id: 'creative', name: 'Creative', img: 'https://placehold.co/400x565/333333/FFFFFF?text=Creative+Template' },
];

const CVPreviewComponent = ({ profile, template, color }) => {
  const templateStyles = {
    classic: { backgroundColor: '#fff', color: '#333' },
    elegant: { backgroundColor: '#1A2E4A', color: '#fff' },
    modern: { backgroundColor: '#EAEAEA', color: '#333' },
    creative: { backgroundColor: '#333333', color: '#fff' },
  };
  return (
    <div className="cv-preview-container" style={{ ...templateStyles[template.id], borderColor: color }}>
      <div className="cv-header" style={{ backgroundColor: template.id === 'elegant' ? '#2a3b4c' : '#3d4a58' }}>
        <img src={profile.avatar} alt="Avatar" className="cv-avatar" />
        <div className="cv-header-info">
          <h1>{profile.name}</h1>
          <p className="cv-title">{profile.title}</p>
          <div className="cv-contact-info">
            <span><BsTelephone /> {profile.phone}</span>
            <span><BsCalendarEvent /> {profile.birthDate}</span>
            <span><BsEnvelope /> {profile.email}</span>
            <span><BsGeoAlt /> {profile.location}</span>
          </div>
        </div>
      </div>
      <div className="cv-body">
        <div className="cv-section">
          <div className="cv-section-title">About me</div>
          <div className="cv-section-content">{profile.aboutMe}</div>
        </div>
        <div className="cv-section">
          <div className="cv-section-title">Education</div>
          <div className="cv-section-content text-muted">{profile.education}</div>
        </div>
        <div className="cv-section">
          <div className="cv-section-title">Skill</div>
          <div className="cv-section-content text-muted">{profile.skills}</div>
        </div>
        <div className="cv-section">
          <div className="cv-section-title">Work Experience</div>
          <div className="cv-section-content text-muted">{profile.workExperience}</div>
        </div>
      </div>
    </div>
  );
};

const CVTemplatesPage = () => {
  const { state } = useLocation();
  const profile = state?.profile || {
    name: 'Phạm Đình Dương',
    title: 'ADD YOUR TITLE',
    phone: 'Add your phone number',
    email: 'duongxummo@gmail.com',
    birthDate: 'Add your date of birth',
    location: 'Add your current location',
    avatar: 'https://placehold.co/100x100/EFEFEF/333?text=PD',
    aboutMe: 'Phạm Đình Dương',
    education: 'Update your education background',
    skills: 'Update your specialist skills',
    workExperience: 'Update your work experience',
  };
  const [selectedTemplate, setSelectedTemplate] = useState(templates[1]);
  const [selectedColor, setSelectedColor] = useState('#4A90E2');
  const [selectedLanguage, setSelectedLanguage] = useState('VI');

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
          <CVPreviewComponent profile={profile} template={selectedTemplate} color={selectedColor} />
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
          <button className="btn btn-red">Update your profile</button>
        </div>
      </footer>
    </div>
  );
};

export default CVTemplatesPage;