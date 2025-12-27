import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { authApi, tokenManager } from '../api/auth'
import type { AuthContextType, UserProfile, AuthResult } from '../types'

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(
    localStorage.getItem('selectedPlan')
  )

  const isAuthenticated = !!userProfile && tokenManager.hasToken()

  // Initialize auth state from stored token
  useEffect(() => {
    const initAuth = async () => {
      const token = tokenManager.getToken()
      if (token) {
        try {
          const profile = await authApi.getProfile(token)
          setUserProfile(profile)
        } catch (error) {
          // Token invalid or expired, try to refresh
          const refreshToken = tokenManager.getRefreshToken()
          if (refreshToken) {
            try {
              const tokens = await authApi.refreshToken(refreshToken)
              tokenManager.setTokens(tokens)
              const profile = await authApi.getProfile(tokens.idToken)
              setUserProfile(profile)
            } catch (refreshError) {
              // Refresh failed, clear tokens
              tokenManager.clearTokens()
              setUserProfile(null)
            }
          } else {
            tokenManager.clearTokens()
            setUserProfile(null)
          }
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  // Listen for logout events from API client (when token refresh fails)
  useEffect(() => {
    const handleLogout = () => {
      setUserProfile(null)
      localStorage.removeItem('selectedPlan')
      setSelectedPlan(null)
    }

    window.addEventListener('auth:logout', handleLogout)
    return () => {
      window.removeEventListener('auth:logout', handleLogout)
    }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await authApi.login(email, password)
      tokenManager.setTokens(response.tokens)
      setUserProfile(response.user)
      return { success: true }
    } catch (err) {
      const error = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const message = error.response?.data?.error?.message || error.message || 'Login failed'
      return { success: false, error: message }
    }
  }, [])

  const signup = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    try {
      const response = await authApi.signup(email, password)
      tokenManager.setTokens(response.tokens)
      setUserProfile(response.user)
      return { success: true }
    } catch (err) {
      const error = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const message = error.response?.data?.error?.message || error.message || 'Signup failed'
      return { success: false, error: message }
    }
  }, [])

  const logout = useCallback(async () => {
    const token = tokenManager.getToken()
    if (token) {
      try {
        await authApi.logout(token)
      } catch (error) {
        // Ignore logout errors, still clear local state
        console.error('Logout error:', error)
      }
    }
    tokenManager.clearTokens()
    setUserProfile(null)
    localStorage.removeItem('selectedPlan')
    setSelectedPlan(null)
  }, [])

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    try {
      await authApi.resetPassword(email)
      return { success: true }
    } catch (err) {
      const error = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const message = error.response?.data?.error?.message || error.message || 'Password reset failed'
      return { success: false, error: message }
    }
  }, [])

  const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
    const token = tokenManager.getToken()
    if (!token) return

    try {
      const updatedProfile = await authApi.updateProfile(token, data)
      setUserProfile(updatedProfile)
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }, [])

  const deleteAccount = useCallback(async (): Promise<AuthResult> => {
    const token = tokenManager.getToken()
    if (!token) return { success: false, error: 'Not authenticated' }

    try {
      await authApi.deleteAccount(token)
      tokenManager.clearTokens()
      setUserProfile(null)
      localStorage.removeItem('selectedPlan')
      setSelectedPlan(null)
      return { success: true }
    } catch (err) {
      const error = err as { response?: { data?: { error?: { message?: string } } }; message?: string }
      const message = error.response?.data?.error?.message || error.message || 'Delete account failed'
      return { success: false, error: message }
    }
  }, [])

  const completePayment = useCallback(async () => {
    const token = tokenManager.getToken()
    if (!token) return

    const plan = selectedPlan || 'starter'
    try {
      const updatedProfile = await authApi.completePayment(token, plan)
      setUserProfile(updatedProfile)
    } catch (error) {
      console.error('Failed to complete payment:', error)
      throw error
    }
  }, [selectedPlan])

  const handleSetSelectedPlan = useCallback((plan: string | null) => {
    if (plan) {
      localStorage.setItem('selectedPlan', plan)
    } else {
      localStorage.removeItem('selectedPlan')
    }
    setSelectedPlan(plan)
  }, [])

  const value: AuthContextType = {
    userProfile,
    loading,
    isAuthenticated,
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
