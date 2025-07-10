import React from 'react';
import { TfiGift } from "react-icons/tfi";

const InfoBanner = () => {
  return (
    <div className="bg-white py-3 border-bottom border-top">
      <div className="container">
        <div className="d-flex align-items-center justify-content-center">
          <TfiGift size={24} className="text-danger me-3" />
          <span>
            <strong className="text-danger">Khảo sát thị trường IT & Ứng dụng AI</strong> Mối phân phối, một điểm sáng giữa thị trường biến động. <a href="#" className="fw-bold text-decoration-none">Tham gia ngay!</a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;