/**
 * Handles Firebase errors and returns user-friendly messages
 * @param {Error} error - The Firebase error object
 * @returns {string} A user-friendly error message
 */
export const handleFirebaseError = (error) => {
  console.error('Firebase error:', error);
  
  // Extract the error code
  const errorCode = error.code || '';
  
  // Common Firebase error codes and their user-friendly messages
  switch (errorCode) {
    // Auth errors
    case 'auth/user-not-found':
      return 'No user found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please use a different email or try logging in.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/requires-recent-login':
      return 'This operation requires a recent login. Please log out and log back in.';
      
    // Firestore errors
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    case 'unavailable':
      return 'The service is currently unavailable. Please try again later.';
    case 'not-found':
      return 'The requested document was not found.';
    case 'already-exists':
      return 'The document already exists.';
    case 'failed-precondition':
      return 'Operation failed due to a precondition failure.';
    case 'resource-exhausted':
      return 'Too many requests. Please try again later.';
      
    // Network errors
    case 'network-request-failed':
      return 'Network error. Please check your internet connection.';
      
    // Default case for unknown errors
    default:
      if (error.message) {
        return `Error: ${error.message}`;
      }
      return 'An unexpected error occurred. Please try again later.';
  }
};

/**
 * Checks if the error is related to Firebase being offline
 * @param {Error} error - The error object
 * @returns {boolean} True if the error is related to being offline
 */
export const isOfflineError = (error) => {
  if (!error) return false;
  
  const errorCode = error.code || '';
  const errorMessage = error.message || '';
  
  return (
    errorCode === 'unavailable' ||
    errorCode === 'network-request-failed' ||
    errorMessage.includes('network') ||
    errorMessage.includes('offline') ||
    errorMessage.includes('unavailable') ||
    errorMessage.includes('connection')
  );
}; 