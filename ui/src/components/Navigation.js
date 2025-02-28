import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const { currentUser, userRole } = useAuth();

  return (
    <nav>
      {/* Other nav items */}
      {userRole === 'ADMIN' && (
        <Link to="/admin/users" className="admin-link">
          User Management
        </Link>
      )}
      
      <style jsx>{`
        .admin-link {
          background: #1976d2;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          margin-left: 16px;
        }

        .admin-link:hover {
          background: #1565c0;
        }
      `}</style>
    </nav>
  );
} 