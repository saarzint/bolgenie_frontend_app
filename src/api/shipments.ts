import { api } from './client'
import type { Shipment, BillOfLadingData, PaginatedResponse } from '../types'

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
}
