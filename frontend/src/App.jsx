import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import "./App.css";
import CVPage from "./pages/CVPage";
import CreateCVPage from "./pages/CreateCVPage";

function App() {
  return (
    <BrowserRouter>
      <Header />

      {/* Routes sẽ render các page component */}
      <Routes>
        {/* Route cho trang chủ */}
        <Route path="/" element={<HomePage />} />

        {/* Các routes cho đăng nhập và đăng ký được gói trong layout riêng */}
        <Route
          path="/login"
          element={
            <LayoutAuth>
              <LoginPage />
            </LayoutAuth>
          }
        />
        <Route
          path="/register"
          element={
            <LayoutAuth>
              <RegisterPage />
            </LayoutAuth>
          }
        />
        <Route path="/cv" element={<CVPage />} />
        <Route path="/create-cv" element={<CreateCVPage />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

const LayoutAuth = ({ children }) => {
  return (
    <div className="container">
      <main className="my-5">
        <div className="row justify-content-center">
          <div className="col-lg-10 col-xl-9">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default App;
