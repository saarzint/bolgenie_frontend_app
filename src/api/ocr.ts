import { uploadFile } from './client'
import type { BillOfLadingData } from '../types'

export interface OCRExtractResponse {
  data: BillOfLadingData
  confidence: number
  processingTime: number
}

export const ocrApi = {
  extract: async (file: File): Promise<OCRExtractResponse> => {
    return await uploadFile<OCRExtractResponse>('/ocr/extract', file)
  },
}
