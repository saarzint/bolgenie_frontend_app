// User Profile
export interface UserProfile {
  uid?: string
  email: string
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  role: 'user' | 'admin'
  plan: 'starter' | 'pro' | 'enterprise'
  usage: number
  isPaid: boolean
  isEmailVerified: boolean
  status: 'active' | 'inactive' | 'canceled'
  companyName?: string
  companyAddress?: string
  subscriptionStart?: string
}

// Bill of Lading Schema
export interface Party {
  name: string
  address?: string
}

export interface Carrier extends Party {
  scac?: string
}

export interface Parties {
  shipper: Party
  consignee: Party
  carrier: Carrier
}

export interface Routing {
  vessel_name?: string
  port_of_loading?: string
  port_of_discharge?: string
}

export interface CargoItem {
  container_number?: string
  seal_number?: string
  description: string
  gross_weight_kg?: string
  package_type?: string
  package_count?: string
  measurement_cbm?: number
}

export interface Reference {
  bol_number?: string
  booking_number?: string
}

export interface BillOfLadingData {
  parties: Parties
  routing?: Routing
  cargo: CargoItem[]
  reference?: Reference
  status?: 'Draft' | 'Manual' | 'Complete'
}

// Shipment (Document from backend)
export interface Shipment extends BillOfLadingData {
  id: string
  userId: string
  createdAt: Date | null
  updatedAt?: Date | null
  // Flattened fields for quick display
  shipFrom_name?: string
  shipTo_name?: string
  carrier?: string
  container_no?: string
  seal_no?: string
  items?: string
  // File information
  fileUrl?: string
  fileName?: string
  fileSize?: number
  fileType?: string
  // AI extraction metadata
  aiConfidence?: number
  aiProcessingTime?: number
  aiModelUsed?: string
  source?: 'manual' | 'ocr' | 'api' | 'legacy'
}

// Auth Context
export interface AuthContextType {
  userProfile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<AuthResult>
  signup: (email: string, password: string) => Promise<AuthResult>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResult>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
  deleteAccount: () => Promise<AuthResult>
  selectedPlan: string | null
  setSelectedPlan: (plan: string | null) => void
  completePayment: () => Promise<void>
}

export interface AuthResult {
  success: boolean
  error?: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface OCRExtractResponse {
  data: BillOfLadingData
  confidence: number
  processingTime: number
  modelUsed?: string
  documentId?: string
}

export interface DocumentPreviewResponse {
  url: string
  expiresIn: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Toast notifications
export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

// Admin types
export interface AdminStats {
  totalUsers: number
  totalShipments: number
  activeSubscriptions: number
  monthlyRevenue: number
}
