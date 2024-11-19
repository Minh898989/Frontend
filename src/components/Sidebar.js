import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/inventory" className="sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 7H5V4h14v3zM19 12H5v3h14v-3zM19 17H5v3h14v-3z"></path>
            </svg>
            Kho hàng
          </Link>
        </li>
        <li>
          <Link to="/invoices" className="sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"></path>
            </svg>
            Hóa đơn
          </Link>
        </li>
        <li>
          <Link to="/employees" className="sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M5.24 18c.16-3.41 3.46-6 7.76-6s7.6 2.59 7.76 6"></path>
            </svg>
            Nhân viên
          </Link>
        </li>
        <li>
          <Link to="/purchaseHistory" className="sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            </svg>
            Lịch sử mua hàng
          </Link>
        </li>
        <li>
          <Link to="#" onClick={onLogout} className="sidebar-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 17l5-5-5-5"></path>
              <path d="M4 12h10"></path>
            </svg>
            Đăng xuất
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
