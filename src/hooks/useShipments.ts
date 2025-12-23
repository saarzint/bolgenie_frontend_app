import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { shipmentsApi, ocrApi, pdfApi } from '../api'
import type { Shipment, BillOfLadingData } from '../types'

export function useShipments(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['shipments', page, pageSize],
    queryFn: () => shipmentsApi.list(page, pageSize),
  })
}

export function useShipment(id: string) {
  return useQuery({
    queryKey: ['shipment', id],
    queryFn: () => shipmentsApi.get(id),
    enabled: !!id,
  })
}

export function useCreateShipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BillOfLadingData) => shipmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
    },
  })
}

export function useUpdateShipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Shipment> }) =>
      shipmentsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
      queryClient.invalidateQueries({ queryKey: ['shipment', id] })
    },
  })
}

export function useDeleteShipment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => shipmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shipments'] })
    },
  })
}

export function useExtractOCR() {
  return useMutation({
    mutationFn: (file: File) => ocrApi.extract(file),
  })
}

export function useDownloadPDF() {
  return useMutation({
    mutationFn: ({ shipment, filename }: { shipment: Shipment; filename?: string }) =>
      pdfApi.download(shipment, filename),
  })
}
