import React from 'react';

const whiteLogoStyle = {
    filter: 'brightness(0) invert(1)',
    height: '35px'
};

const Footer = () => {
    return (
        <footer className="bg-dark text-white-50 py-5">
            <div className="container">
                <div className="row">
                    <div className="col-lg-3 col-md-6 mb-4">
                        <img src="/path/to/itviec-logo.png" alt="ITviec Logo" style={whiteLogoStyle} className="mb-2" />
                        <p className="small">IT nhung ma chat</p>
                    </div>
                    <div className="col-lg-2 col-md-6 mb-4">
                        <h5 className="text-white small fw-bold text-uppercase">Về ITviec</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-decoration-none text-white-50">Trang Chủ</a></li>
                            <li><a href="#" className="text-decoration-none text-white-50">Về ITviec.com</a></li>
                        </ul>
                    </div>
                    <div className="col-lg-2 col-md-6 mb-4">
                        <h5 className="text-white small fw-bold text-uppercase">Chương Trình</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-decoration-none text-white-50">Chuyện IT</a></li>
                            <li><a href="#" className="text-decoration-none text-white-50">Cuộc thi viết</a></li>
                        </ul>
                    </div>
                    <div className="col-lg-2 col-md-6 mb-4">
                        <h5 className="text-white small fw-bold text-uppercase">Điều khoản</h5>
                        <ul className="list-unstyled">
                            <li><a href="#" className="text-decoration-none text-white-50">Quy định bảo mật</a></li>
                            <li><a href="#" className="text-decoration-none text-white-50">Quy chế hoạt động</a></li>
                        </ul>
                    </div>
                    <div className="col-lg-3 col-md-12 mb-4">
                        <h5 className="text-white small fw-bold text-uppercase">Liên hệ</h5>
                        <p className="mb-1">HCM: (+84) 977 460 519</p>
                        <p className="mb-1">Hà Nội: (+84) 983 131 351</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;