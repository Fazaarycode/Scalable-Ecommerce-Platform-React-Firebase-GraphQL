import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';
import { useAuth } from '../../contexts/AuthContext';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      email
      role
      createdAt
      lastSignIn
    }
  }
`;

const SET_USER_ROLE = gql`
  mutation SetUserRole($userId: ID!, $role: String!) {
    setUserRole(userId: $userId, role: $role) {
      id
      email
      role
    }
  }
`;

export default function AdminDashboard() {
  const { currentUser, isAdmin } = useAuth();
  const { loading, error, data } = useQuery(GET_USERS);
  const [setUserRole] = useMutation(SET_USER_ROLE);

  if (!isAdmin) {
    return <div className="error-message">Access Denied: Admin only area</div>;
  }

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;

  const handleRoleChange = async (userId, newRole) => {
    try {
      await setUserRole({
        variables: { userId, role: newRole },
        refetchQueries: [{ query: GET_USERS }]
      });
    } catch (err) {
      console.error('Error changing role:', err);
      alert('Failed to update user role');
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>User Management</h2>
      
      <div className="admin-panel">
        <div className="current-admin">
          Logged in as: {currentUser?.email} (Admin)
        </div>
        
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Last Sign In</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>{new Date(user.lastSignIn).toLocaleDateString()}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                    disabled={user.id === currentUser.uid} // Prevent changing own role
                  >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .admin-dashboard {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .admin-panel {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 20px;
        }

        .current-admin {
          margin-bottom: 20px;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 4px;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table th,
        .users-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .users-table th {
          background: #f9f9f9;
          font-weight: 600;
        }

        .role-select {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
        }

        .role-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.85em;
          font-weight: 500;
        }

        .role-badge.admin {
          background: #e3f2fd;
          color: #1976d2;
        }

        .role-badge.user {
          background: #f5f5f5;
          color: #616161;
        }

        .loading {
          text-align: center;
          padding: 40px;
          font-size: 1.2em;
          color: #666;
        }

        .error-message {
          color: #d32f2f;
          padding: 20px;
          text-align: center;
          background: #ffebee;
          border-radius: 4px;
          margin: 20px 0;
        }
      `}</style>
    </div>
  );
} 