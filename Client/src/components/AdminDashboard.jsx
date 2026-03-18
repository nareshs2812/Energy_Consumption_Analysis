import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import '../styles/adminDashboard.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const AdminDashboard = ({ user, onLogout }) => {
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    userId: '',
    month: '',
    year: '',
    unitsConsumed: '',
    area: '',
    city: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    const fetchData = async () => {
      const [usersRes, recordsRes] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/consumption'),
      ]);
      setUsers(usersRes.data.filter((u) => u.role === 'user'));
      setRecords(recordsRes.data);
    };
    fetchData().catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      month: Number(form.month),
      year: Number(form.year),
      unitsConsumed: Number(form.unitsConsumed),
    };
    const res = await axios.post('/api/admin/consumption', payload);
    setRecords((prev) => {
      const existingIdx = prev.findIndex(
        (r) =>
          r.user._id === res.data.user &&
          r.month === res.data.month && 
          r.year === res.data.year
      );
      if (existingIdx >= 0) {
        const clone = [...prev];
        clone[existingIdx] = res.data;
        return clone;
      }
      return [...prev, res.data];
    });
  };

  const monthlyChartData = {
    labels: records.map((r) => `${r.month}/${r.year}`),
    datasets: [
      {
        label: 'Units',
        data: records.map((r) => r.unitsConsumed),
        borderColor: '#f97316',
        backgroundColor: 'rgba(249,115,22,0.3)',
      },
    ],
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p>Welcome, {user?.name}</p>
        </div>
        <button onClick={onLogout}>Logout</button>
      </header>

      <section className="grid">
        <div className="card">
          <h3>Update Monthly Consumption</h3>
          <form
            className="simple-form"
            onSubmit={handleSubmit}
          >
            <select
              required
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option
                  key={u._id}
                  value={u._id}
                >
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            <input
              placeholder="Month (1-12)"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              required
            />
            <input
              placeholder="Year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              required
            />
            <input
              placeholder="Units Consumed"
              value={form.unitsConsumed}
              onChange={(e) => setForm({ ...form, unitsConsumed: e.target.value })}
              required
            />
            <input
              placeholder="Area"
              value={form.area}
              onChange={(e) => setForm({ ...form, area: e.target.value })}
              required
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
            <button type="submit">Save</button>
          </form>
        </div>

        <div className="card">
          <h3>Monthly Units Trend (All Users)</h3>
          <Line data={monthlyChartData} />
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

