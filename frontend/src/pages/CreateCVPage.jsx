import '../css/CreateCVPage.css';
import { BsPerson, BsBriefcase, BsEnvelope, BsBell, BsGear, BsPencil, BsPlusCircle, BsTelephone, BsCalendar, BsGenderAmbiguous, BsGeoAlt, BsLink45Deg, BsChevronDown } from 'react-icons/bs';
import { FiGrid, FiFileText, FiStar } from "react-icons/fi";

const sections = [
  { id: 'about', title: 'Giới thiệu bản thân', description: 'Giới thiệu điểm mạnh và số năm kinh nghiệm của bạn', icon: <BsPerson /> },
  { id: 'education', title: 'Học vấn', description: 'Chia sẻ trình độ học vấn của bạn', icon: <BsBriefcase /> },
  { id: 'experience', title: 'Kinh nghiệm làm việc', description: 'Thể hiện những thông tin chi tiết về quá trình làm việc', icon: <FiFileText /> },
  { id: 'skills', title: 'Kỹ năng', description: 'Liệt kê các kỹ năng chuyên môn của bạn', icon: <FiStar /> },
  { id: 'languages', title: 'Ngoại ngữ', description: 'Mô tả khả năng ngoại ngữ của bạn', icon: <BsBriefcase /> },
];


const CreateCVPage = () => {
  return (
    <>
      <style >
      </style>
      <div className="cv-page-body">
        <div className="container-fluid px-5">
          <div className="row">
            {/* Left Sidebar */}
            <div className="col-lg-2">
              <div className="left-sidebar">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <a className="nav-link" href="#">
                      <BsPerson /> Xin chào <br/><strong>Phạm Đình Dương</strong>
                    </a>
                  </li>
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

            {/* Main Content */}
            <div className="col-lg-7">
              <div className="main-content">
                <div className="card p-4 mb-4">
                  <div className="profile-header">
                    <img src="https://placehold.co/80x80/EFEFEF/333?text=PD" alt="Avatar" className="profile-avatar" />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h4 className="fw-bold mb-1">Phạm Đình Dương</h4>
                        <button className="btn btn-light btn-sm"><BsPencil /></button>
                      </div>
                      <p className="text-muted">Cập nhật chức danh</p>
                      <div className="row">
                        <div className="col-md-6"><div className="profile-details"><span><BsEnvelope/> duongxummo@gmail.co...</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsTelephone/> Số điện thoại</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsCalendar/> Ngày sinh</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsGenderAmbiguous/> Giới tính</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsGeoAlt/> Địa chỉ hiện tại</span></div></div>
                        <div className="col-md-6"><div className="profile-details"><span><BsLink45Deg/> Link cá nhân</span></div></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {sections.map(section => (
                  <div className="card section-card" key={section.id}>
                    <div className="section-card-header">
                      <div>
                        <h5>{section.title}</h5>
                        <p>{section.description}</p>
                      </div>
                      <button className="btn btn-light"><BsPlusCircle className="text-danger" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="col-lg-3">
              <div className="right-sidebar">
                <div className="card">
                  <h5 className="fw-bold">Độ hoàn thiện hồ sơ</h5>
                  <div className="progress-circle">
                    <div className="progress-circle-inner">70%</div>
                  </div>
                  <p className="text-muted">Nâng cấp hồ sơ của bạn lên <strong>70%</strong> để tối mẫu CV dành cho chuyên gia IT.</p>
                  <ul className="completion-list">
                    <li><BsPlusCircle className="text-danger"/> Thêm Giới thiệu bản thân</li>
                    <li><BsPlusCircle className="text-danger"/> Thêm Thông tin cá nhân</li>
                    <li><BsPlusCircle className="text-danger"/> Thêm Kinh nghiệm làm việc</li>
                    <li><BsChevronDown /> Thêm thông tin khác</li>
                  </ul>
                  <button className="btn btn-red mt-3">Xem và Tải CV</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCVPage;
