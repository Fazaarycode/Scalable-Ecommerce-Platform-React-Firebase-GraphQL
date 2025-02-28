import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './AdminStyles.css';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userClaims, setUserClaims] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUserClaims = async (userId) => {
    try {
      const claims = await api.getUserClaims(userId);
      setUserClaims(prev => ({
        ...prev,
        [userId]: claims.admin
      }));
    } catch (error) {
      console.error('Error fetching user claims:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const allUsers = await api.getAllUsers();
      setUsers(allUsers || []);
      // Fetch claims for each user
      allUsers.forEach(user => {
        fetchUserClaims(user.id);
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setLoading(true);
      await api.updateUserRole(userId, newRole.toUpperCase());
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Failed to update user role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };

  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  return (
    <div className="admin-page">
      <h1>User Management</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-content">
        <div className="list-section full-width">
          <h2>Users List</h2>
          
          {loading ? (
            <div className="loading">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="no-items">No users found</div>
          ) : (
            <div className="items-table-container">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>
                        <select 
                          value={userClaims[user.id] ? 'admin' : 'user'}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        <button 
                          className="btn-icon view"
                          onClick={() => viewUserDetails(user)}
                          title="View Details"
                        >
                          👁️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>User Details</h2>
              <button className="close-btn" onClick={closeUserDetails}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="user-details-section">
                <h3>Basic Information</h3>
                <p><strong>User ID:</strong> {selectedUser.uid}</p>
                <p><strong>Name:</strong> {selectedUser.displayName}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
              
              {/* Add more user details sections as needed */}
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeUserDetails}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 