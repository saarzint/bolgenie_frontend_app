// Error codes that match backend error responses
export const ErrorCodes = {
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  PERMISSION_DENIED: 'PERMISSION_DENIED',

  // Resource errors
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',

  // Service errors
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  OCR_EXTRACTION_FAILED: 'OCR_EXTRACTION_FAILED',
  PDF_GENERATION_FAILED: 'PDF_GENERATION_FAILED',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',

  // Rate limiting
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',

  // Generic
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

// API error response structure from backend
export interface APIErrorResponse {
  success: false
  error: {
    code: ErrorCode
    message: string
    details?: Record<string, unknown>
    request_id?: string
    timestamp?: string
  }
}

// Custom error class for API errors
export class APIError extends Error {
  code: ErrorCode
  details: Record<string, unknown>
  requestId?: string
  statusCode: number

  constructor(
    message: string,
    code: ErrorCode = ErrorCodes.UNKNOWN_ERROR,
    statusCode: number = 500,
    details: Record<string, unknown> = {},
    requestId?: string
  ) {
    super(message)
    this.name = 'APIError'
    this.code = code
    this.statusCode = statusCode
    this.details = details
    this.requestId = requestId
  }

  // Check if error is retryable
  isRetryable(): boolean {
    return (
      this.statusCode >= 500 ||
      this.code === ErrorCodes.RATE_LIMIT_EXCEEDED ||
      this.code === ErrorCodes.NETWORK_ERROR
    )
  }

  // Get user-friendly message
  getUserMessage(): string {
    switch (this.code) {
      case ErrorCodes.AUTH_REQUIRED:
        return 'Please sign in to continue.'
      case ErrorCodes.INVALID_TOKEN:
        return 'Your session has expired. Please sign in again.'
      case ErrorCodes.PERMISSION_DENIED:
        return "You don't have permission to perform this action."
      case ErrorCodes.NOT_FOUND:
        return 'The requested resource was not found.'
      case ErrorCodes.FILE_TOO_LARGE:
        return `File is too large. Maximum size is ${this.details.max_size_mb || 10}MB.`
      case ErrorCodes.INVALID_FILE_TYPE:
        return `Invalid file type. Allowed types: ${(this.details.allowed_types as string[])?.join(', ') || 'images and PDFs'}.`
      case ErrorCodes.OCR_EXTRACTION_FAILED:
        return 'Unable to extract data from the document. Please try a clearer image or enter data manually.'
      case ErrorCodes.PDF_GENERATION_FAILED:
        return 'Failed to generate PDF. Please try again.'
      case ErrorCodes.RATE_LIMIT_EXCEEDED:
        return 'Too many requests. Please wait a moment and try again.'
      case ErrorCodes.CONFIGURATION_ERROR:
        return 'Service temporarily unavailable. Please try again later.'
      case ErrorCodes.NETWORK_ERROR:
        return 'Network error. Please check your connection and try again.'
      default:
        return this.message || 'An unexpected error occurred. Please try again.'
    }
  }
}

// Parse error response from backend or network error
export function parseAPIError(error: unknown): APIError {
  // Check if it's an Axios error with response data
  if (isAxiosError(error)) {
    const response = error.response

    // Network error (no response)
    if (!response) {
      return new APIError(
        'Network error - unable to reach server',
        ErrorCodes.NETWORK_ERROR,
        0
      )
    }

    // Try to parse structured error response
    const data = response.data as APIErrorResponse | undefined
    if (data?.error) {
      return new APIError(
        data.error.message,
        data.error.code as ErrorCode,
        response.status,
        data.error.details || {},
        data.error.request_id
      )
    }

    // Fallback for non-structured errors
    return new APIError(
      getDefaultMessage(response.status),
      getErrorCodeFromStatus(response.status),
      response.status
    )
  }

  // Already an APIError
  if (error instanceof APIError) {
    return error
  }

  // Generic Error
  if (error instanceof Error) {
    return new APIError(error.message, ErrorCodes.UNKNOWN_ERROR)
  }

  // Unknown error type
  return new APIError('An unexpected error occurred', ErrorCodes.UNKNOWN_ERROR)
}

// Type guard for Axios errors
interface AxiosErrorLike {
  isAxiosError: boolean
  response?: {
    status: number
    data: unknown
  }
}

function isAxiosError(error: unknown): error is AxiosErrorLike {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosErrorLike).isAxiosError === true
  )
}

// Get default error message from status code
function getDefaultMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid request'
    case 401:
      return 'Authentication required'
    case 403:
      return 'Permission denied'
    case 404:
      return 'Resource not found'
    case 413:
      return 'File too large'
    case 422:
      return 'Validation failed'
    case 429:
      return 'Too many requests'
    case 500:
      return 'Server error'
    case 502:
      return 'Service unavailable'
    case 503:
      return 'Service temporarily unavailable'
    default:
      return 'An error occurred'
  }
}

// Map HTTP status to error code
function getErrorCodeFromStatus(status: number): ErrorCode {
  switch (status) {
    case 401:
      return ErrorCodes.AUTH_REQUIRED
    case 403:
      return ErrorCodes.PERMISSION_DENIED
    case 404:
      return ErrorCodes.NOT_FOUND
    case 409:
      return ErrorCodes.CONFLICT
    case 413:
      return ErrorCodes.FILE_TOO_LARGE
    case 422:
      return ErrorCodes.VALIDATION_ERROR
    case 429:
      return ErrorCodes.RATE_LIMIT_EXCEEDED
    case 502:
    case 503:
      return ErrorCodes.EXTERNAL_SERVICE_ERROR
    default:
      return ErrorCodes.UNKNOWN_ERROR
  }
}
