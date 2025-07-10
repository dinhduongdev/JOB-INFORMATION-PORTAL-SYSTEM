import { FcGoogle } from "react-icons/fc";
import { FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.webp";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  return (
    <div className="p-4 p-md-5">
      <h4 className="text-center">
        Chào mừng bạn đến với{" "}
        <img
          src={logo}
          alt="ITviec"
          style={{ height: "28px", verticalAlign: "middle" }}
        />
      </h4>
      <h2 className="fw-bold text-center mt-2 mb-4">Đăng ký tài khoản</h2>

      <form>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="googleTerms"
          />
          <label className="form-check-label small" htmlFor="googleTerms">
            Bằng việc đăng ký bằng tài khoản Google, bạn đồng ý với các{" "}
            <a href="#">Điều khoản dịch vụ</a> và{" "}
            <a href="#">Chính sách quyền riêng tư</a> của ITviec liên quan đến
            thông tin riêng tư của bạn.
          </label>
        </div>

        <button className="btn btn-outline-secondary w-100 py-2 mb-3 d-flex align-items-center justify-content-center">
          <FcGoogle className="me-2" size={24} /> Đăng ký bằng Google
        </button>

        <div className="separator my-3">HOẶC</div>

        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">
            Họ và Tên *
          </label>
          <input
            type="text"
            className="form-control"
            id="fullName"
            placeholder="Nhập họ và tên"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email *
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Nhập email"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Mật khẩu *
          </label>
          <div className="input-group">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Nhập mật khẩu"
            />
            <span className="input-group-text bg-transparent">
              <FaEyeSlash />
            </span>
          </div>
        </div>

        <ul className="list-unstyled text-muted small mt-2 mb-3">
          <li>Ít nhất 12 ký tự</li>
          <li>Ít nhất 1 ký tự đặc biệt (! @ # $ ...)</li>
          <li>Ít nhất 1 số</li>
          <li>Ít nhất 1 chữ viết HOA</li>
          <li>Ít nhất 1 chữ viết thường</li>
        </ul>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="mainTerms"
          />
          <label className="form-check-label small" htmlFor="mainTerms">
            Tôi đã đọc và đồng ý với các <a href="#">Điều khoản dịch vụ</a> và{" "}
            <a href="#">Chính sách quyền riêng tư</a> của ITviec liên quan đến
            thông tin riêng tư của tôi.
          </label>
        </div>

        <button type="submit" className="btn btn-secondary w-100 py-2 fw-bold">
          Đăng ký bằng Email
        </button>
      </form>

      <p className="text-center mt-4 mb-0">
        Bạn đã có tài khoản?{" "}
        <Link to="/dang-nhap" className="text-decoration-none">
          Đăng nhập ngay!
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
