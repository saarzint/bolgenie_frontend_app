import axios, { type AxiosError, type AxiosRequestConfig } from 'axios'
import { APIError, ErrorCodes, parseAPIError } from '../lib/errors'
import { tokenManager, authApi } from './auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

// Flag to prevent multiple refresh attempts
let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token))
  refreshSubscribers = []
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = tokenManager.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(parseAPIError(error))
  }
)

// Handle response errors with structured error parsing and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const apiError = parseAPIError(error)
    const originalRequest = error.config

    // Handle authentication errors with token refresh
    if (
      (apiError.code === ErrorCodes.AUTH_REQUIRED ||
        apiError.code === ErrorCodes.INVALID_TOKEN) &&
      originalRequest &&
      !(originalRequest as { _retry?: boolean })._retry
    ) {
      const refreshToken = tokenManager.getRefreshToken()

      if (refreshToken) {
        if (isRefreshing) {
          // Wait for the ongoing refresh to complete
          return new Promise((resolve) => {
            subscribeTokenRefresh((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            })
          })
        }

        ;(originalRequest as { _retry?: boolean })._retry = true
        isRefreshing = true

        try {
          const tokens = await authApi.refreshToken(refreshToken)
          tokenManager.setTokens(tokens)
          isRefreshing = false
          onRefreshed(tokens.idToken)

          originalRequest.headers.Authorization = `Bearer ${tokens.idToken}`
          return api(originalRequest)
        } catch (refreshError) {
          isRefreshing = false
          // Refresh failed, clear tokens and dispatch logout event
          tokenManager.clearTokens()
          window.dispatchEvent(new CustomEvent('auth:logout'))
          return Promise.reject(apiError)
        }
      } else {
        // No refresh token, clear tokens
        tokenManager.clearTokens()
        window.dispatchEvent(new CustomEvent('auth:logout'))
      }
    }

    // Log error details in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        code: apiError.code,
        message: apiError.message,
        statusCode: apiError.statusCode,
        details: apiError.details,
        requestId: apiError.requestId,
      })
    }

    return Promise.reject(apiError)
  }
)

// Helper function for file uploads with progress tracking
export async function uploadFile<T = unknown>(
  endpoint: string,
  file: File,
  options?: {
    config?: AxiosRequestConfig
    onProgress?: (progress: number) => void
  }
): Promise<T> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.post<T>(endpoint, formData, {
    ...options?.config,
    headers: {
      ...options?.config?.headers,
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (options?.onProgress && progressEvent.total) {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        options.onProgress(progress)
      }
    },
  })

  return response.data
}

// Retry helper for transient failures
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: {
    maxRetries?: number
    delayMs?: number
    shouldRetry?: (error: APIError) => boolean
  }
): Promise<T> {
  const maxRetries = options?.maxRetries ?? 3
  const delayMs = options?.delayMs ?? 1000
  const shouldRetry = options?.shouldRetry ?? ((error: APIError) => error.isRetryable())

  let lastError: APIError | null = null

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof APIError ? error : parseAPIError(error)

      if (attempt < maxRetries && shouldRetry(lastError)) {
        // Exponential backoff
        const delay = delayMs * Math.pow(2, attempt)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      throw lastError
    }
  }

  throw lastError ?? new APIError('Retry failed', ErrorCodes.UNKNOWN_ERROR)
}

// Type-safe API request helpers
export const apiClient = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.get<T>(url, config)
    return response.data
  },

  post: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.post<T>(url, data, config)
    return response.data
  },

  put: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.put<T>(url, data, config)
    return response.data
  },

  patch: async <T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response = await api.patch<T>(url, data, config)
    return response.data
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await api.delete<T>(url, config)
    return response.data
  },
}
