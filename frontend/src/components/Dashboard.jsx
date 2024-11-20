import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fetch');
      console.log(response.data);
      
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`); 
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
