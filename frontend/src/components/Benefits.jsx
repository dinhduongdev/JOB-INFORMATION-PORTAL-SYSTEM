import { FaCheck } from "react-icons/fa";

const Benefits = () => {
  return (
    <div className="p-5">
      <h3 className="fw-bold mb-4">Đăng nhập để truy cập ngay vào hàng ngàn đánh giá và dữ liệu lương thị trường IT</h3>
      <ul className="list-unstyled">
        <li className="d-flex align-items-start mb-3">
          <FaCheck className="text-success me-3 mt-1" />
          <span>Xem trước mức lương để có thể ký thế khi thoả thuận lương</span>
        </li>
        <li className="d-flex align-items-start mb-3">
          <FaCheck className="text-success me-3 mt-1" />
          <span>Tìm hiểu về phúc lợi, con người, văn hóa công ty qua các đánh giá chân thật</span>
        </li>
        <li className="d-flex align-items-start mb-3">
          <FaCheck className="text-success me-3 mt-1" />
          <span>Dễ dàng ứng tuyển chỉ với một thao tác</span>
        </li>
        <li className="d-flex align-items-start mb-3">
          <FaCheck className="text-success me-3 mt-1" />
          <span>Quản lý hồ sơ và quyền riêng tư của bạn</span>
        </li>
      </ul>
    </div>
  );
};

export default Benefits;