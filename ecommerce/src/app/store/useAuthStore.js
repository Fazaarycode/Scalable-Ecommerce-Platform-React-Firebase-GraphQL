import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ loading }),

      signup: async (email, password) => {
        try {
          // 1. Create the auth user
          const userCredential = await createUserWithEmailAndPassword(auth, email, password)
          
          // 2. Create a user document with default role
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            email: email,
            role: 'user',  // Default role
            createdAt: new Date().toISOString()
          })

          // 3. Update local state
          setUser(userCredential.user)
        } catch (error) {
          console.error('Error in signup:', error)
          throw error
        }
      },
      
      login: async (email, password) => {
        try {
          const result = await signInWithEmailAndPassword(auth, email, password)
          const token = await result.user.getIdTokenResult()
          set({ 
            user: {
              uid: result.user.uid,
              email: result.user.email,
              name: result.user.displayName,
              role: token.claims.role || 'customer'
            }
          })
          return result.user
        } catch (error) {
          throw error
        }
      },

      loginWithGoogle: async () => {
        try {
          const provider = new GoogleAuthProvider()
          const result = await signInWithPopup(auth, provider)
          const token = await result.user.getIdTokenResult()
          set({ 
            user: {
              uid: result.user.uid,
              email: result.user.email,
              name: result.user.displayName,
              role: token.claims.role || 'customer'
            }
          })
          return result.user
        } catch (error) {
          throw error
        }
      },

      logout: async () => {
        await signOut(auth)
        set({ user: null })
      },

      getUserRole: async (uid) => {
        try {
          const userDoc = await getDoc(doc(db, 'users', uid))
          if (userDoc.exists()) {
            return userDoc.data().role
          }
          return null
        } catch (error) {
          console.error('Error getting user role:', error)
          return null
        }
      },

      checkIsAdmin: async (uid) => {
        const role = await useAuthStore.getState().getUserRole(uid)
        return role === 'admin'
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user // only persist user state
      }),
    }
  )
)