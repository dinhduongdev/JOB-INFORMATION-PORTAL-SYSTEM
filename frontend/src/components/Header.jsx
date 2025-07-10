import { VscTriangleDown } from "react-icons/vsc";
import logo from "../assets/logo.webp";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="py-2 bg-dark" data-bs-theme="dark">
      <div className="container d-flex flex-wrap justify-content-between align-items-center">
        <a
          href="/"
          className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none"
        >
          <img src={logo} alt="ITviec Logo" style={{ height: "32px" }} />
        </a>

        <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li>
            <a href="#" className="nav-link px-2 text-muted">
              Việc Làm IT <VscTriangleDown size={12} />
            </a>
          </li>
          <li>
            <a href="#" className="nav-link px-2 text-muted">
              Top Công Ty IT <VscTriangleDown size={12} />
            </a>
          </li>
          <li>
            <a href="#" className="nav-link px-2 text-muted">
              Blog
            </a>
          </li>
          <li>
            <a href="#" className="nav-link px-2 text-muted">
              Mẫu CV IT <span className="badge bg-danger">HOT</span>
            </a>
          </li>
        </ul>

        <div className="text-end">
          <a href="#" className="btn btn-outline-secondary me-2">
            Nhà Tuyển Dụng
          </a>
          <Link to="/dang-nhap" className="btn btn-outline-secondary me-2 text-decoration-none text-muted">
            Đăng Nhập/Đăng Ký
          </Link>
          <a href="#" className="text-decoration-none text-muted">
            EN
          </a>
          <span className="text-muted"> | </span>
          <a href="#" className="text-decoration-none text-muted fw-bold">
            VI
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
