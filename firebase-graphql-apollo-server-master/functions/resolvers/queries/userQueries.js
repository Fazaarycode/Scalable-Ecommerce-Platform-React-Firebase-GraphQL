const admin = require('../../database/database');

const userQueries = {
  users: async (_, args, context) => {
    console.log('========== USERS QUERY STARTED ==========');
    console.log('Context received:', context);
    try {
      // Temporarily bypass admin check for testing
      console.log('Fetching all users directly');
      const usersList = await admin.auth.listUsers();
      
      console.log('Raw users list:', usersList);
      
      if (!usersList || !usersList.users) {
        console.log('No users found in Firebase Auth');
        return [];
      }

      const formattedUsers = usersList.users.map(user => {
        console.log('Processing user:', user.uid);
        return {
          id: user.uid,
          email: user.email || 'No email',
          role: user.customClaims?.admin ? 'ADMIN' : 'USER',
          createdAt: user.metadata.creationTime || null,
          lastSignIn: user.metadata.lastSignInTime || null
        };
      });

      console.log('Formatted users:', JSON.stringify(formattedUsers, null, 2));
      console.log(`Found ${formattedUsers.length} users`);
      
      // Verify database connection
      console.log('Verifying database connection...');
      const db = admin.db;
      if (!db) {
        console.error('Database connection not established');
        throw new Error('Database connection failed');
      }
      
      // List collections to verify database access
      console.log('Listing collections...');
      const collections = await db.listCollections();
      collections.forEach(collection => {
        console.log('Collection found:', collection.id);
      });

      return formattedUsers;
    } catch (error) {
      console.error('========== ERROR IN USERS QUERY ==========');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      return [];
    }
  },

  currentUser: async (_, args, context) => {
    console.log('========== CURRENT USER QUERY STARTED ==========');
    console.log('Context received:', context);

    try {
      // Temporarily bypass authentication check
      const users = await admin.auth.listUsers();
      const firstUser = users.users[0]; // Just get the first user for testing
      
      if (firstUser) {
        console.log('Found user:', firstUser.uid);
        return {
          id: firstUser.uid,
          email: firstUser.email || 'No email',
          role: firstUser.customClaims?.admin ? 'ADMIN' : 'USER',
          createdAt: firstUser.metadata.creationTime || null,
          lastSignIn: firstUser.metadata.lastSignInTime || null
        };
      }
      
      throw new Error('No users found');
    } catch (error) {
      console.error('========== ERROR IN CURRENT USER QUERY ==========');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  },

  getUserClaims: async (_, { userId }, context) => {
    console.log('========== GET USER CLAIMS QUERY STARTED ==========');
    console.log('UserId:', userId);
    
    try {
      const userRecord = await admin.auth.getUser(userId);
      return {
        admin: userRecord.customClaims?.admin || false,
        customClaims: JSON.stringify(userRecord.customClaims || {})
      };
    } catch (error) {
      console.error('========== ERROR IN GET USER CLAIMS QUERY ==========');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }
};

module.exports = userQueries; 