import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/logo.webp';
import { Link, useNavigate } from 'react-router-dom';
import { registerUserAPI } from '../features/auth/authAPI';
import { useDispatch } from 'react-redux';
import { setError, setLoading } from '../features/auth/authSlice';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      console.log('Register data:', formData); // Log dữ liệu gửi đi
      const response = await registerUserAPI(formData);
      console.log('Register response:', response); // Log response
      navigate('/login'); // Điều hướng tới trang đăng nhập sau khi đăng ký thành công
    } catch (error) {
      console.error('Register error:', error);
      dispatch(setError(error?.message || 'Đăng ký thất bại'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleLogin = () => {
    alert('Đăng ký bằng Google chưa được hỗ trợ trong ví dụ này');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 p-md-5">
      <h4 className="text-center">
        Chào mừng bạn đến với{' '}
        <img
          src={logo}
          alt="ITviec"
          style={{ height: '28px', verticalAlign: 'middle' }}
        />
      </h4>
      <h2 className="fw-bold text-center mt-2 mb-4">Đăng ký tài khoản</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id="googleTerms"
            required
          />
          <label className="form-check-label small" htmlFor="googleTerms">
            Bằng việc đăng ký bằng tài khoản Google, bạn đồng ý với các{' '}
            <a href="#">Điều khoản dịch vụ</a> và{' '}
            <a href="#">Chính sách quyền riêng tư</a> của ITviec liên quan đến
            thông tin riêng tư của bạn.
          </label>
        </div>

        <button
          className="btn btn-outline-secondary w-100 py-2 mb-3 d-flex align-items-center justify-content-center"
          type="button"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="me-2" size={24} /> Đăng ký bằng Google
        </button>

        <div className="separator my-3">HOẶC</div>

        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            Họ *
          </label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            placeholder="Nhập họ"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="middleName" className="form-label">
            Tên lót *
          </label>
          <input
            type="text"
            className="form-control"
            id="middleName"
            name="middleName"
            placeholder="Nhập tên lót"
            value={formData.middleName}
            onChange={handleChange}
            required
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
            name="email"
            placeholder="Nhập email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Mật khẩu *
          </label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className="input-group-text bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEyeSlash />}
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
            required
          />
          <label className="form-check-label small" htmlFor="mainTerms">
            Tôi đã đọc và đồng ý với các{' '}
            <a href="#">Điều khoản dịch vụ</a> và{' '}
            <a href="#">Chính sách quyền riêng tư</a> của ITviec liên quan đến
            thông tin riêng tư của tôi.
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-secondary w-100 py-2 fw-bold"
          disabled={false} // Có thể dùng state.loading để disable
        >
          Đăng ký bằng Email
        </button>
      </form>

      <p className="text-center mt-4 mb-0">
        Bạn đã có tài khoản?{' '}
        <Link to="/dang-nhap" className="text-decoration-none">
          Đăng nhập ngay!
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;