import { VscTriangleDown } from "react-icons/vsc";
import logo from "../assets/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useEffect } from "react";
import { fetchMe } from "../features/user/userAction"; // import action lấy me

import "../css/Header.css";

const Header = () => {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.user); // lấy user từ userSlice
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // gọi API lấy user info khi có token
  useEffect(() => {
    if (token) {
      dispatch(fetchMe(token));
    }
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  console.log("User in Header:", user);
  

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
            <a href="#" className="nav-link px-2 text-white">
              Việc Làm IT <VscTriangleDown size={12} />
            </a>
          </li>
          <li>
            <a href="#" className="nav-link px-2 text-white">
              Top Công Ty IT <VscTriangleDown size={12} />
            </a>
          </li>
          <li>
            <a href="#" className="nav-link px-2 text-white">
              Blog
            </a>
          </li>
          <li>
            <a href="/cv" className="nav-link px-2 text-warning fw-bold">
              Mẫu CV IT <span className="badge bg-danger">HOT</span>
            </a>
          </li>
        </ul>

        <div className="text-end d-flex align-items-center">
          {
            user?.data?.role === "Employer" && (
              <Link to="/employer" className="btn btn-outline-light me-3">
                Nhà tuyển dụng
              </Link>
            )
          }

          {token ? (
            <div className="dropdown hover-dropdown">
              <button
                className="btn btn-secondary dropdown-toggle d-flex align-items-center"
                type="button"
                aria-expanded="false"
                aria-label="User menu"
              >
                <span className="me-2 text-white">
                  Xin chào, {user?.data?.first_name + " " + user?.data?.last_name || "Người dùng"}!
                </span>
                <i className="bi bi-person-circle"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/profile-cv">
                    Profile
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Đăng Xuất
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="dropdown hover-dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle"></i>
              </button>
              <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="/login">Đăng Nhập</Link></li>
                <li><Link className="dropdown-item" to="/register">Đăng Ký</Link></li>
              </ul>
            </div>
          )}

          <div className="ms-3">
            <a href="#" className="text-decoration-none text-muted">
              EN
            </a>
            <span className="text-muted"> | </span>
            <a href="#" className="text-decoration-none text-white fw-bold">
              VI
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
