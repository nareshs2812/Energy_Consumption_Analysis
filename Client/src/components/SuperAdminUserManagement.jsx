import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/superAdminUserManagement.css';

const SuperAdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    area: '',
    city: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
    const fetchUsers = async () => {
      const res = await axios.get('/api/admin/users');
      setUsers(res.data);
    };
    fetchUsers().catch(() => {});
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const res = await axios.post('/api/admin/users', newUser);
    setUsers((prev) => [...prev, res.data]);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'admin',
      area: '',
      city: '',
    });
  };

  return (
    <div className="grid">
      <div className="card">
        <h3>Create Admin/User</h3>
        <form className="simple-form" onSubmit={handleCreateUser}>
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <input
            placeholder="Area"
            value={newUser.area}
            onChange={(e) => setNewUser({ ...newUser, area: e.target.value })}
            required
          />
          <input
            placeholder="City"
            value={newUser.city}
            onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
            required
          />
          <button type="submit">Create</button>
        </form>
      </div>

      <div className="card">
        <h3>Existing Users</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Area</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id || u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.area}</td>
                <td>{u.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminUserManagement;

