import { FcGoogle } from "react-icons/fc";
import { FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.webp";
import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
    <div className="p-4">
      <h3 className="fw-bold mb-4">
        Chào mừng bạn đến với{" "}
        <img
          src={logo}
          alt="ITviec"
          style={{ height: "30px", verticalAlign: "middle" }}
        />
      </h3>
      <p style={{ fontSize: "14px" }}>
        Bằng việc đăng nhập, bạn đồng ý với các{" "}
        <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách quyền riêng tư</a> của ITviec liên quan đến thông
        tin riêng tư của bạn.
      </p>

      <button className="btn btn-outline-secondary w-100 py-2 mt-3 d-flex align-items-center justify-content-center">
        <FcGoogle className="me-2" size={24} /> Đăng nhập bằng Google
      </button>

      <div className="separator my-4">hoặc</div>

      <form>
        <div className="mb-3">
          <label htmlFor="emailInput" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="emailInput"
            placeholder="Email"
          />
        </div>
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <label htmlFor="passwordInput" className="form-label">
              Mật khẩu
            </label>
            <a href="#" className="form-text text-decoration-none">
              Quên mật khẩu?
            </a>
          </div>
          <div className="input-group">
            <input
              type="password"
              className="form-control"
              id="passwordInput"
              placeholder="Mật khẩu"
            />
            <span className="input-group-text bg-transparent">
              <FaEyeSlash />
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-danger w-100 py-2 fw-bold mt-3"
        >
          Đăng nhập bằng Email
        </button>
      </form>
      <p className="text-center mt-4">
        Chưa có tài khoản?{" "}
        <Link to="/dang-ky" className="text-decoration-none">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
