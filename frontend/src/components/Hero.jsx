import "../css/Hero.css";
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <>
      <main className="hero-section d-flex align-items-center text-center text-white">
        <div className="container-fluid">
          <h1>
            Xây dựng mẫu <span className="highlight-border">CV IT</span> từ <span className="highlight-text">ITviec</span>
          </h1>
          <h2 className="fw-normal mt-3">chuẩn gu nhà tuyển dụng IT</h2>
          <p className="lead mt-4 mx-auto" style={{ maxWidth: '600px' }}>
            90% lý do CV bị loại qua sớm vì trình bày chưa đúng cách, theo khảo sát ITviec - Đừng để bạn là người tiếp theo. Dùng ngay mẫu CV được chính nhà tuyển dụng IT đề xuất và được hàng ngàn nhân sự IT sử dụng.
          </p>
          <div className="d-flex justify-content-center gap-3 mt-5">
            <Link to="/profile-cv/cv-templates" className="btn btn-lg px-5 btn-custom-primary text-decoration-none">
              Tạo CV ngay
            </Link>
            <button className="btn btn-lg px-5 btn-custom-outline">
              Xem mẫu CV IT
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Hero;
