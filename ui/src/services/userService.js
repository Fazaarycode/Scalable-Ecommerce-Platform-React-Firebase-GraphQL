import { 
  collection, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Get all users (admin only)
export async function getAllUsers() {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
}

// Update user role (admin only)
export async function updateUserRole(userId, role) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: role
    });
    
    return {
      uid: userId,
      role
    };
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    return {
      uid: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
} 