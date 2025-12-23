import { uploadFile } from './client'
import type { BillOfLadingData } from '../types'

export interface OCRExtractResponse {
  data: BillOfLadingData
  confidence: number
  processingTime: number
}

export const ocrApi = {
  extract: async (file: File): Promise<OCRExtractResponse> => {
    const response = await uploadFile('/ocr/extract', file)
    return response.data
  },
}
