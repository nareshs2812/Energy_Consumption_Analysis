import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import '../styles/userDashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Tooltip,
  Legend
);

const UserDashboard = ({ user, onLogout }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    const fetchData = async () => {
      const res = await axios.get('/api/user/me/consumption');
      setRecords(res.data);
    };
    fetchData().catch(() => {});
  }, []);

  const monthlyChartData = {
    labels: records.map((r) => `${r.month}/${r.year}`),
    datasets: [
      {
        label: 'Units Consumed',
        data: records.map((r) => r.unitsConsumed),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.3)',
      },
    ],
  };

  const billChartData = {
    labels: records.map((r) => `${r.month}/${r.year}`),
    datasets: [
      {
        label: 'Bill Amount',
        data: records.map((r) => r.billAmount),
        backgroundColor: '#22c55e',
      },
    ],
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h2>User Dashboard</h2>
          <p>
            {user?.name} &mdash; {user?.area}, {user?.city}
          </p>
        </div>
        <button onClick={onLogout}>Logout</button>
      </header>

      <section className="grid">
        <div className="card">
          <h3>Monthly Consumption Trend</h3>
          <Line data={monthlyChartData} />
        </div>
        <div className="card">
          <h3>Bill History</h3>
          <Bar data={billChartData} />
        </div>
      </section>

      <section className="card full-width">
        <h3>Consumption History</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Month/Year</th>
              <th>Units</th>
              <th>Bill Amount</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>
                  {r.month}/{r.year}
                </td>
                <td>{r.unitsConsumed}</td>
                <td>{r.billAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default UserDashboard;

