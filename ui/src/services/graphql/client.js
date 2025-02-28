import { GraphQLClient } from 'graphql-request';
import { auth } from '../../firebase/config';
import { handleFirebaseError } from '../../utils/firebaseErrorHandler';

// Create a GraphQL client instance
const endpoint = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://127.0.0.1:5001/zimozi-ecom/us-central1/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: async () => {
    const token = await auth.currentUser?.getIdToken();
    return {
      authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  },
});

// Add request middleware
const originalRequest = graphqlClient.request.bind(graphqlClient);
graphqlClient.request = async (...args) => {
  try {
    return await originalRequest(...args);
  } catch (error) {
    console.error('GraphQL request error:', error);
    
    // Check if it's a Firebase error
    if (error.code || (error.message && error.message.includes('firebase'))) {
      const friendlyMessage = handleFirebaseError(error);
      throw new Error(friendlyMessage);
    }
    
    // Handle GraphQL specific errors
    if (error.response && error.response.errors) {
      const graphqlErrors = error.response.errors.map(e => e.message).join(', ');
      throw new Error(`GraphQL Error: ${graphqlErrors}`);
    }
    
    // For network errors
    if (error.message && error.message.includes('Failed to fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    
    // For other errors
    throw error;
  }
};

// Add auth token to requests if user is logged in
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdToken().then(token => {
      graphqlClient.setHeader('Authorization', `Bearer ${token}`);
    }).catch(error => {
      console.error('Error getting auth token:', error);
    });
  } else {
    // Clear the authorization header when logged out
    graphqlClient.setHeader('Authorization', '');
  }
});
