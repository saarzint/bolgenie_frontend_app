import { useCallback } from 'react'
import { useToast } from '../components/ui/Toast'
import { APIError, parseAPIError, ErrorCodes } from '../lib/errors'

interface UseErrorHandlerOptions {
  showToast?: boolean
  onAuthError?: () => void
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
  const { showToast = true, onAuthError } = options
  const toast = useToast()

  const handleError = useCallback(
    (error: unknown, customMessage?: string) => {
      const apiError =
        error instanceof APIError ? error : parseAPIError(error)

      // Handle auth errors specially
      if (
        apiError.code === ErrorCodes.AUTH_REQUIRED ||
        apiError.code === ErrorCodes.INVALID_TOKEN
      ) {
        onAuthError?.()
      }

      // Show toast notification
      if (showToast) {
        toast.error(customMessage || apiError.getUserMessage())
      }

      // Log error in development
      if (import.meta.env.DEV) {
        console.error('Error handled:', {
          code: apiError.code,
          message: apiError.message,
          details: apiError.details,
          requestId: apiError.requestId,
        })
      }

      return apiError
    },
    [showToast, onAuthError, toast]
  )

  return { handleError }
}

// Hook for handling mutation errors in TanStack Query
export function useMutationErrorHandler() {
  const { handleError } = useErrorHandler()

  return useCallback(
    (error: unknown) => {
      handleError(error)
    },
    [handleError]
  )
}

// Hook for handling query errors in TanStack Query
export function useQueryErrorHandler() {
  const toast = useToast()

  return useCallback(
    (error: unknown) => {
      const apiError =
        error instanceof APIError ? error : parseAPIError(error)

      // Only show toast for non-auth errors (auth errors redirect)
      if (
        apiError.code !== ErrorCodes.AUTH_REQUIRED &&
        apiError.code !== ErrorCodes.INVALID_TOKEN
      ) {
        toast.error(apiError.getUserMessage())
      }
    },
    [toast]
  )
}
