import { api } from './client'
import type { Shipment, BillOfLadingData, PaginatedResponse, DocumentPreviewResponse } from '../types'

export const shipmentsApi = {
  list: async (page = 1, pageSize = 20): Promise<PaginatedResponse<Shipment>> => {
    const response = await api.get('/shipments', {
      params: { page, pageSize },
    })
    return response.data
  },

  get: async (id: string): Promise<Shipment> => {
    const response = await api.get(`/shipments/${id}`)
    return response.data
  },

  create: async (data: BillOfLadingData): Promise<Shipment> => {
    const response = await api.post('/shipments', data)
    return response.data
  },

  update: async (id: string, data: Partial<Shipment>): Promise<Shipment> => {
    const response = await api.put(`/shipments/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/shipments/${id}`)
  },

  /**
   * Get a signed URL to preview/download the original document
   * @param id - Shipment ID
   * @param expirationMinutes - How long the URL should be valid (default: 60)
   */
  getPreviewUrl: async (id: string, expirationMinutes = 60): Promise<DocumentPreviewResponse> => {
    const response = await api.get(`/shipments/${id}/preview`, {
      params: { expiration_minutes: expirationMinutes },
    })
    return response.data
  },
}
