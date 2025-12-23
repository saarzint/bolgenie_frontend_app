import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'
import type { AuthContextType, UserProfile, AuthResult } from '../types'

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

function getProfileRef(uid: string) {
  return doc(db, 'profiles', uid)
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(
    localStorage.getItem('selectedPlan')
  )

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const docRef = getProfileRef(u.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile)
        } else {
          // Create default profile for new users
          const defaultProfile: Partial<UserProfile> = {
            email: u.email || '',
            role: 'user',
            plan: 'starter',
            usage: 0,
            isPaid: false,
            status: 'inactive',
          }
          await setDoc(docRef, {
            ...defaultProfile,
            createdAt: serverTimestamp(),
          })
          setUserProfile(defaultProfile as UserProfile)
        }
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (err) {
      return { success: false, error: (err as Error).message }
    }
  }

  const signup = async (email: string, password: string): Promise<AuthResult> => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (err) {
      return { success: false, error: (err as Error).message }
    }
  }

  const logout = async () => {
    localStorage.removeItem('selectedPlan')
    setSelectedPlan(null)
    await signOut(auth)
  }

  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (err) {
      return { success: false, error: (err as Error).message }
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return
    await setDoc(getProfileRef(user.uid), data, { merge: true })
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null))
  }

  const deleteAccount = async (): Promise<AuthResult> => {
    if (!user) return { success: false, error: 'Not authenticated' }
    try {
      await deleteDoc(getProfileRef(user.uid))
      await deleteUser(user)
      return { success: true }
    } catch (err) {
      return { success: false, error: (err as Error).message }
    }
  }

  const completePayment = async () => {
    if (!user) return
    await updateProfile({
      isPaid: true,
      plan: (selectedPlan as UserProfile['plan']) || 'starter',
      status: 'active',
      subscriptionStart: new Date().toISOString(),
    })
  }

  const handleSetSelectedPlan = (plan: string | null) => {
    if (plan) {
      localStorage.setItem('selectedPlan', plan)
    } else {
      localStorage.removeItem('selectedPlan')
    }
    setSelectedPlan(plan)
  }

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    updateProfile,
    deleteAccount,
    selectedPlan,
    setSelectedPlan: handleSetSelectedPlan,
    completePayment,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
