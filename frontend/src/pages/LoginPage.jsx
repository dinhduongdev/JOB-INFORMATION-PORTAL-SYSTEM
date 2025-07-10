import LoginForm from '../components/LoginForm';
import Benefits from '../components/Benefits';

const LoginPage = () => {
  return (
    <div className="card shadow-sm border-0">
      <div className="row g-0">
        <div className="col-md-6 border-end">
          <LoginForm />
        </div>
        <div className="col-md-6 bg-light d-none d-md-flex align-items-center">
          <Benefits />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;