'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut 
} from 'firebase/auth'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/app/store/useAuthStore'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/app/firebase/config'

export function useAuth() {
  const { setUser } = useCartStore()
  const { user } = useAuthStore()
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [setUser])

  useEffect(() => {
    const fetchRole = async () => {
      if (!user) {
        setRole(null)
        setLoading(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setRole(userDoc.data().role)
        }
      } catch (error) {
        console.error('Error fetching role:', error)
      }
      setLoading(false)
    }

    fetchRole()
  }, [user])

  const signIn = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    } catch (error) {
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      throw error
    }
  }

  const signOut = () => firebaseSignOut(auth)

  return {
    user,
    role,
    loading,
    isAdmin: role === 'admin',
    isUser: role === 'user',
    signIn,
    signInWithGoogle,
    signOut,
  }
} 