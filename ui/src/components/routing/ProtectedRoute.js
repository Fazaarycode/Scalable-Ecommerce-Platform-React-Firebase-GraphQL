import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasRole } from '../../utils/roleChecker';

/**
 * A component that protects routes based on authentication and role
 * @param {Object} props - Component props
 * @param {string} [props.requiredRole] - The role required to access the route
 * @param {string} [props.redirectPath='/login'] - Where to redirect if not authenticated
 * @returns {JSX.Element} - The protected route component
 */
export default function ProtectedRoute({ 
  requiredRole, 
  redirectPath = '/login' 
}) {
  const { currentUser, userRole, isAuthenticated } = useAuth();
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // If a role is required and the user doesn't have it, redirect to home
  if (requiredRole && !hasRole(userRole, requiredRole)) {
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and has the required role, render the child routes
  return <Outlet />;
} 