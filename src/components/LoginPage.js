import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';  // Import react-router-dom's useNavigate

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();  // Declare the useNavigate hook
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Vui lòng nhập tài khoản và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/login', { username, password });
      setLoading(false);
      if (response.data) {
        onLogin(response.data);  // Assuming the backend returns user data
        navigate('/employees');   // Use navigate to redirect
      } else {
        setError('Tài khoản hoặc mật khẩu không chính xác');
      }
    } catch (err) {
      setLoading(false);
      setError('Đã xảy ra lỗi, vui lòng thử lại');
    }
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h2 className="login-header">Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Tài khoản</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tài khoản của bạn"
            />
          </div>
          <div>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu của bạn"
            />
          </div>
          {error && <div className="login-error">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;