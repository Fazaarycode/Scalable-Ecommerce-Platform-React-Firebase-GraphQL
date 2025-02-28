import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const AuthContext = createContext({
  currentUser: null,
  userRole: 'user',
  signup: () => Promise.resolve(),
  login: () => Promise.resolve(),
  googleSignIn: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  updateUserProfile: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  isAdmin: false,
  isAuthenticated: false
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function signup(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with their name
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // In a real app, you would also create a user document in Firestore with role information
      // For now, we'll just set the role to 'user'
      setUserRole('user');
      
      return userCredential.user;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document if it doesn't exist
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'user',
          createdAt: serverTimestamp()
        });
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    return signOut(auth);
  }

  async function updateUserProfile(data) {
    try {
      const user = auth.currentUser;
      
      if (user) {
        // Update auth profile if display name is provided
        if (data.displayName) {
          await updateProfile(user, { displayName: data.displayName });
        }
        
        // Update user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          ...data,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (error) {
      throw error;
    }
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Effect to handle auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Get user claims to check admin status
        try {
          const claims = await api.getUserClaims(user.uid);
          setIsAdmin(claims.admin);
        } catch (error) {
          console.error('Error fetching user claims:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    googleSignIn,
    logout,
    updateUserProfile,
    resetPassword,
    isAdmin,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 