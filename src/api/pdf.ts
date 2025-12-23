import { api } from './client'
import type { Shipment } from '../types'

export const pdfApi = {
  generate: async (shipment: Shipment): Promise<Blob> => {
    const response = await api.post('/pdf/generate', shipment, {
      responseType: 'blob',
    })
    return response.data
  },

  download: async (shipment: Shipment, filename?: string): Promise<void> => {
    const blob = await pdfApi.generate(shipment)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename || `BOL_${shipment.id.slice(0, 8)}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  },
}
