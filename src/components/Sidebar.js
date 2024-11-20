import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/inventory" className="sidebar-link">Kho hàng</Link></li>
        <li><Link to="/invoices" className="sidebar-link">Hóa đơn</Link></li>
        <li><Link to="/employees" className="sidebar-link">Nhân viên</Link></li>
        <li><Link to="#" onClick={onLogout} className="sidebar-link">Đăng xuất</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;