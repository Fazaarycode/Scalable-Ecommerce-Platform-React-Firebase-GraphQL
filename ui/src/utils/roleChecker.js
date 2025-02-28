import { useAuth } from '../contexts/AuthContext';

// Role hierarchy (higher roles include permissions of lower roles)
const roleHierarchy = {
  admin: 3,
  manager: 2,
  user: 1,
  guest: 0
};

/**
 * Check if a user has the required role
 * @param {string} userRole - The user's role
 * @param {string} requiredRole - The required role
 * @returns {boolean} - Whether the user has the required role
 */
export const hasRole = (userRole, requiredRole) => {
  // If no role is provided, default to guest
  const userRoleLevel = roleHierarchy[userRole] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
  
  return userRoleLevel >= requiredRoleLevel;
};

/**
 * Hook to check if the current user has the required role
 * @param {string} requiredRole - The required role
 * @returns {boolean} - Whether the user has the required role
 */
export const useHasRole = (requiredRole) => {
  const { userRole } = useAuth();
  return hasRole(userRole, requiredRole);
};

/**
 * Higher-order function to check if a user has the required role before executing a function
 * @param {Function} fn - The function to execute
 * @param {string} requiredRole - The required role
 * @returns {Function} - A function that checks the role before executing the original function
 */
export const withRoleCheck = (fn, requiredRole) => {
  return (...args) => {
    const { userRole } = useAuth();
    
    if (!hasRole(userRole, requiredRole)) {
      throw new Error(`Access denied. Required role: ${requiredRole}`);
    }
    
    return fn(...args);
  };
}; 