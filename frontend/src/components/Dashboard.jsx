import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Dashboard.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/fetch");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/users/${selectedUserId}`
      );
      if (response.status === 200) {
        toast.success("User Deleted Successfully");
      }
      setUsers(users.filter((user) => user._id !== selectedUserId));
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const openModal = (id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>
      <table className="dashboard-table">
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
                  <button
                    className="delete-button"
                    onClick={() => openModal(user._id)}
                  >
                    Delete
                  </button>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-actions">
              <button className="confirm-button" onClick={handleDelete}>
                Yes, Delete
              </button>
              <button className="cancel-button" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
