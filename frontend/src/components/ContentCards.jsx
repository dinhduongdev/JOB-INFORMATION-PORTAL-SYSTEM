
import iconBriefcase from '../assets/icon-briefcase.png';
import iconCv from '../assets/icon-cv.png';
import iconBlog from '../assets/icon-blog.png';

const ContentCards = () => {
  return (
    <div className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row">
          {/* Card 1: Tìm việc thụ động */}
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <img src={iconBriefcase} alt="Briefcase Icon" height="60" className="mb-3"/>
                <h5 className="card-title">Tìm việc thụ động <span className="badge bg-danger">HOT</span></h5>
                <p className="card-text">Nhận lời mời công việc trên ITviec khi chỉ cần tải CV lên</p>
                <a href="#" className="btn btn-outline-danger">Tìm hiểu thêm</a>
              </div>
            </div>
          </div>

          {/* Card 2: Mẫu CV */}
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <img src={iconCv} alt="CV Icon" height="60" className="mb-3"/>
                <h5 className="card-title">Mẫu CV <span className="badge bg-danger">HOT</span></h5>
                <p className="card-text">Nâng cấp CV với các mẫu CV IT chuyên nghiệp - được nhà tuyển dụng đề xuất</p>
                <a href="#" className="btn btn-outline-danger">Xem mẫu CV</a>
              </div>
            </div>
          </div>
          
          {/* Card 3: Blog */}
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <img src={iconBlog} alt="Blog Icon" height="60" className="mb-3"/>
                <h5 className="card-title">Blog về IT <span className="badge bg-secondary">BLOG</span></h5>
                <p className="card-text">Cập nhật những kiến thức và xu hướng mới nhất trong ngành IT</p>
                <a href="#" className="btn btn-outline-danger">Khám phá</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCards;