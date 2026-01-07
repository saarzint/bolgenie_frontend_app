import { api } from './client'
import type { Shipment, UserProfile, PaginatedResponse } from '../types'

// Admin user with ID for list display
export interface AdminUser extends UserProfile {
  id: string
}

// Admin API methods - requires admin role
export const adminApi = {
  /**
   * List all shipments (admin only)
   * GET /api/admin/shipments
   */
  getShipments: async (): Promise<PaginatedResponse<Shipment>> => {
    const response = await api.get<PaginatedResponse<Shipment>>('/admin/shipments')
    return response.data
  },

  /**
   * List all users (admin only)
   * GET /api/admin/users
   */
  getUsers: async (): Promise<PaginatedResponse<AdminUser>> => {
    const response = await api.get<PaginatedResponse<AdminUser>>('/admin/users')
    return response.data
  },

  /**
   * Delete any shipment (admin only)
   * DELETE /api/admin/shipments/{id}
   */
  deleteShipment: async (id: string): Promise<void> => {
    await api.delete(`/admin/shipments/${id}`)
  },

  /**
   * Set user as admin (admin only)
   * POST /api/admin/users/{id}/set-admin
   */
  setAdmin: async (userId: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/admin/users/${userId}/set-admin`
    )
    return response.data
  },

  /**
   * Bulk set admin roles by email (admin only)
   * POST /api/admin/set-admins
   */
  setAdminsByEmail: async (emails: string[]): Promise<{ message: string; updated: number }> => {
    const response = await api.post<{ message: string; updated: number }>(
      '/admin/set-admins',
      { emails }
    )
    return response.data
  },

  /**
   * Remove admin role from user (admin only)
   * POST /api/admin/users/{id}/remove-admin
   */
  removeAdmin: async (userId: string): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/admin/users/${userId}/remove-admin`
    )
    return response.data
  },
}
