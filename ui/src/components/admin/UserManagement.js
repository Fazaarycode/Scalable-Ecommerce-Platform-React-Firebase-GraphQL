import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_USERS = gql`
  query Users {
    users {
      id
      email
      role
      createdAt
      lastSignIn
    }
  }
`;

export default function UserManagement() {
  const { loading, error, data, refetch } = useQuery(GET_USERS, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log('Query completed:', data);
    },
    onError: (error) => {
      console.error('Query error:', error);
    }
  });

  useEffect(() => {
    console.log('UserManagement mounted');
    console.log('Query status:', { loading, error, hasData: !!data });
  }, [loading, error, data]);

  if (loading) return <div className="loading">Loading users...</div>;
  
  if (error) {
    console.error('Error fetching users:', error);
    return (
      <div className="error-container">
        <p>Error: {error.message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="user-management">
      <h2>User Management</h2>
      
      <table className="users-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Last Sign In</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <span className={`role-badge ${user.role.toLowerCase()}`}>
                  {user.role}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>{new Date(user.lastSignIn).toLocaleString()}</td>
              <td>
                <select 
                  value={user.role}
                  onChange={(e) => {
                    // TODO: Implement role change mutation
                    console.log('Change role:', user.id, e.target.value);
                  }}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .user-management {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .users-table th,
        .users-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .users-table th {
          background: #f5f5f5;
          font-weight: 600;
        }

        .role-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.85em;
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

        .error-container {
          color: #d32f2f;
          padding: 20px;
          text-align: center;
          background: #ffebee;
          border-radius: 4px;
          margin: 20px;
        }

        select {
          padding: 6px;
          border-radius: 4px;
          border: 1px solid #ddd;
        }

        button {
          padding: 8px 16px;
          background: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }

        button:hover {
          background: #1565c0;
        }
      `}</style>
    </div>
  );
} 