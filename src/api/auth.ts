import axios from 'axios'
import type { UserProfile } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

// Auth tokens interface
export interface AuthTokens {
  idToken: string
  refreshToken: string
  expiresIn: string
}

// Auth response from backend
export interface AuthResponse {
  user: UserProfile
  tokens: AuthTokens
}

// Storage keys
const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// Token management
export const tokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY)
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setTokens: (tokens: AuthTokens): void => {
    localStorage.setItem(TOKEN_KEY, tokens.idToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  },

  clearTokens: (): void => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  hasToken: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY)
  },
}

// Create axios instance for auth requests (no token interceptor)
const authAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Auth API methods
export const authApi = {
  /**
   * Sign up a new user
   * POST /api/auth/signup
   */
  signup: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await authAxios.post<AuthResponse>('/auth/signup', {
      email,
      password,
    })
    return response.data
  },

  /**
   * Login with email and password
   * POST /api/auth/login
   */
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await authAxios.post<AuthResponse>('/auth/login', {
      email,
      password,
    })
    return response.data
  },

  /**
   * Refresh authentication tokens
   * POST /api/auth/refresh
   */
  refreshToken: async (refreshToken: string): Promise<AuthTokens> => {
    const response = await authAxios.post<AuthTokens>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return response.data
  },

  /**
   * Verify email with token
   * POST /api/auth/verify-email
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await authAxios.post<{ message: string }>(
      '/auth/verify-email',
      { token }
    )
    return response.data
  },

  /**
   * Resend verification email
   * POST /api/auth/resend-verification
   */
  resendVerification: async (email: string): Promise<{ message: string }> => {
    const response = await authAxios.post<{ message: string }>(
      '/auth/resend-verification',
      { email }
    )
    return response.data
  },

  /**
   * Request password reset email
   * POST /api/auth/password-reset
   */
  resetPassword: async (email: string): Promise<{ message: string }> => {
    const response = await authAxios.post<{ message: string }>(
      '/auth/password-reset',
      { email }
    )
    return response.data
  },

  /**
   * Reset password with token
   * POST /api/auth/password-reset/confirm
   */
  confirmPasswordReset: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await authAxios.post<{ message: string }>(
      '/auth/password-reset/confirm',
      { token, new_password: newPassword }
    )
    return response.data
  },

  /**
   * Get current user profile (requires token)
   * GET /api/v1/auth/me
   */
  getProfile: async (token: string): Promise<UserProfile> => {
    const response = await authAxios.get<UserProfile>('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  /**
   * Update user profile (requires token)
   * PUT /api/v1/auth/me
   */
  updateProfile: async (
    token: string,
    data: Partial<UserProfile>
  ): Promise<UserProfile> => {
    const response = await authAxios.put<UserProfile>('/auth/me', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },

  /**
   * Change password (requires token)
   * POST /api/auth/change-password
   */
  changePassword: async (
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await authAxios.post<{ message: string }>(
      '/auth/change-password',
      { current_password: currentPassword, new_password: newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  },

  /**
   * Delete user account (requires token)
   */
  deleteAccount: async (token: string): Promise<{ message: string }> => {
    const response = await authAxios.delete<{ message: string }>(
      '/auth/delete-account',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  },

  /**
   * Complete payment and update subscription (requires token)
   */
  completePayment: async (
    token: string,
    plan: string
  ): Promise<UserProfile> => {
    const response = await authAxios.post<UserProfile>(
      `/auth/complete-payment?plan=${plan}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    return response.data
  },

}
