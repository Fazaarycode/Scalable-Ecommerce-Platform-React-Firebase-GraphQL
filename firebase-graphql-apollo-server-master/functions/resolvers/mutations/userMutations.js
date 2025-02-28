const admin = require('../../database/database');

const userMutations = {
  setUserRole: async (_, { userId, role }, context) => {
    console.log('Setting user role:', { userId, role });
    
    try {
      // Verify the requester is an admin
      const requesterId = context.userId;
      const requesterClaims = await admin.auth().getUser(requesterId)
        .then(user => user.customClaims);
      
      if (!requesterClaims?.admin) {
        throw new Error('Unauthorized. Only admins can set roles.');
      }

      // Set the custom claims (role)
      await admin.auth().setCustomUserClaims(userId, {
        admin: role === 'ADMIN',
        user: role === 'USER'
      });

      // Get updated user info
      const user = await admin.auth().getUser(userId);
      
      return {
        id: user.uid,
        email: user.email,
        role: user.customClaims?.admin ? 'ADMIN' : 'USER'
      };
    } catch (error) {
      console.error('Error setting user role:', error);
      throw error;
    }
  },
  updateUserRole: async (_, { userId, role }, context) => {
    console.log('========== UPDATE USER ROLE MUTATION STARTED ==========');
    console.log('Input:', { userId, role });
    console.log('Context received:', context);

    try {
      // Verify the role is valid
      const validRoles = ['ADMIN', 'USER'];
      if (!validRoles.includes(role)) {
        throw new Error(`Invalid role: ${role}. Must be one of: ${validRoles.join(', ')}`);
      }

      // Set custom claims based on role
      const customClaims = {
        admin: role === 'ADMIN'
      };

      // Update the user's custom claims in Firebase Auth
      await admin.auth.setCustomUserClaims(userId, customClaims);

      // Fetch the updated user to return
      const userRecord = await admin.auth.getUser(userId);
      
      return {
        id: userRecord.uid,
        email: userRecord.email || 'No email',
        role: userRecord.customClaims?.admin ? 'ADMIN' : 'USER',
        createdAt: userRecord.metadata.creationTime || null,
        lastSignIn: userRecord.metadata.lastSignInTime || null
      };

    } catch (error) {
      console.error('========== ERROR IN UPDATE USER ROLE MUTATION ==========');
      console.error('Error details:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }
};

module.exports = userMutations; 