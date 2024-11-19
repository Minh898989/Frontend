import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import InventoryTable from './components/InventoryTable';
import InvoiceTable from './components/InvoiceTable';
import EmployeeTable from './components/EmployeeTable';
import PurchaseHistoryTable from './components/PurchaseHistory';
import LoginPage from './components/LoginPage';
import './App.css';

const PrivateRoute = ({ element, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return element;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';

    if (storedAuth) {
      setIsAuthenticated(storedAuth);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-profile')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <>
            <header className="header">
              <div className="header-title">Hệ thống quản lí cửa hàng</div>
              <div className="user-profile" onClick={toggleDropdown}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbW7joGwZ9EsLTTD0Xk9EKf2oNvHog1MGThA&s"
                  alt="User Avatar"
                  className="profile-icon"
                />
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <ul>
                      <li>
                        <button onClick={handleLogout}>Đăng xuất</button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </header>
            <Sidebar onLogout={handleLogout} />
          </>
        )}
        <div className="main-content">
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/employees" />
                ) : (
                  <LoginPage onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/inventory"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  element={<InventoryTable />}
                />
              }
            />
            <Route
              path="/invoices"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  element={<InvoiceTable setPurchaseHistory={setPurchaseHistory} />}
                />
              }
            />
            <Route
              path="/employees"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  element={<EmployeeTable />}
                />
              }
            />
            <Route
              path="/purchaseHistory"
              element={
                <PrivateRoute
                  isAuthenticated={isAuthenticated}
                  element={<PurchaseHistoryTable purchaseHistory={purchaseHistory} />}
                />
              }
            />
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/employees" : "/login"} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;