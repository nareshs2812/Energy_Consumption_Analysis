import React, { useState } from 'react';
import SuperAdminUserManagement from './SuperAdminUserManagement';
import SuperAdminAnalytics from './SuperAdminAnalytics';
import '../styles/superAdminDashboard.css';

const SuperAdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h2>Super Admin Dashboard</h2>
          <p>Welcome, {user?.name}</p>
        </div>
        <button onClick={onLogout}>Logout</button>
      </header>

      <div className="tab-row">
        <button
          type="button"
          className={activeTab === 'users' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('users')}
        >
          User &amp; Admin Management
        </button>
        <button
          type="button"
          className={activeTab === 'analytics' ? 'tab-button active' : 'tab-button'}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics &amp; Trends
        </button>
      </div>

      {activeTab === 'users' ? <SuperAdminUserManagement /> : <SuperAdminAnalytics />}
    </div>
  );
};

export default SuperAdminDashboard;

