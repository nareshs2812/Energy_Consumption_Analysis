import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginPage from './components/LoginPage';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [token]);

  const handleLogin = async (email, password) => {
    const response = await axios.post('/api/auth/login', { email, password });
    const { token: jwtToken, user: userData } = response.data;
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common.Authorization = `Bearer ${jwtToken}`;
    setToken(jwtToken);
    setUser(userData);

    if (userData.role === 'super_admin') navigate('/super-admin');
    else if (userData.role === 'admin') navigate('/admin');
    else navigate('/user');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common.Authorization;
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const ProtectedRoute = ({ roles, element }) => {
    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;
    return React.cloneElement(element, { user, token, onLogout: handleLogout });
  };

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute roles={['super_admin']} element={<SuperAdminDashboard />} />
          }
        />
        <Route
          path="/admin"
          element={<ProtectedRoute roles={['admin']} element={<AdminDashboard />} />}
        />
        <Route
          path="/user"
          element={<ProtectedRoute roles={['user']} element={<UserDashboard />} />}
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;

