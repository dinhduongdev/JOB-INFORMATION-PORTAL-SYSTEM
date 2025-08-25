import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/logo.webp';
import { Link, useNavigate } from 'react-router-dom';
import { loginUserAPI } from '../features/auth/authAPI';
import { useDispatch } from 'react-redux';
import { setCredentials, setError, setLoading } from '../features/auth/authSlice';
import { toast } from 'react-toastify'; 



const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      console.log({ username, password }); 
      const response = await loginUserAPI({ username, password });
      dispatch(setCredentials({
        user: { username },
        token: response.access_token,
        refreshToken: response.refresh_token,
      }));
      toast.success('Đăng nhập thành công!'); ``
      navigate('/');
    } catch (error) {
      dispatch(setError(error?.message || 'Đăng nhập thất bại'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGoogleLogin = () => {
    alert('Đăng nhập Google chưa được hỗ trợ trong ví dụ này');
  };

  return (
    <div className="p-4">
      <h3 className="fw-bold mb-4">
        Chào mừng bạn đến với{' '}
        <img
          src={logo}
          alt="ITviec"
          style={{ height: '30px', verticalAlign: 'middle' }}
        />
      </h3>
      <p style={{ fontSize: '14px' }}>
        Bằng việc đăng nhập, bạn đồng ý với các{' '}
        <a href="#">Điều khoản dịch vụ</a> và{' '}
        <a href="#">Chính sách quyền riêng tư</a> của ITviec liên quan đến thông
        tin riêng tư của bạn.
      </p>

      <button
        className="btn btn-outline-secondary w-100 py-2 mt-3 d-flex align-items-center justify-content-center"
        onClick={handleGoogleLogin}
        disabled={false}
      >
        <FcGoogle className="me-2" size={24} /> Đăng nhập bằng Google
      </button>

      <div className="separator my-4">hoặc</div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="usernameInput" className="form-label">
            Tên đăng nhập
          </label>
          <input
            type="text"
            className="form-control"
            id="usernameInput"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
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
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              id="passwordInput"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span 
              className="input-group-text bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-danger w-100 py-2 fw-bold mt-3"
          disabled={false} // Có thể dùng state.loading
        >
          Đăng nhập
        </button>
      </form>
      <p className="text-center mt-4">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-decoration-none">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;