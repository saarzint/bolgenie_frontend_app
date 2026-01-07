import { useState, useRef } from 'react'
import { AlertTriangle, Edit2, Trash2, Eye, FileText, Sparkles } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { EditShipmentModal } from '../components/modals/EditShipmentModal'
import { AccountModal } from '../components/modals/AccountModal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import {
  useShipments,
  useCreateShipment,
  useUpdateShipment,
  useDeleteShipment,
  useExtractOCR,
  useDownloadPDF,
} from '../hooks'
import { useToast } from '../components/ui/Toast'
import { shipmentsApi } from '../api/shipments'
import type { Shipment } from '../types'

// Helper to format confidence as percentage with color
function ConfidenceBadge({ confidence }: { confidence?: number }) {
  if (confidence === undefined || confidence === null) return null

  const percentage = Math.round(confidence * 100)
  let colorClass = 'bg-red-100 text-red-700'
  if (percentage >= 85) colorClass = 'bg-green-100 text-green-700'
  else if (percentage >= 70) colorClass = 'bg-yellow-100 text-yellow-700'

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      <Sparkles className="w-3 h-3 mr-1" />
      {percentage}% AI
    </span>
  )
}

export function Dashboard() {
  const { userProfile, logout, deleteAccount } = useAuth()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null)
  const [loadingMessage, setLoadingMessage] = useState('Analyzing...')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; shipmentId: string | null }>({
    isOpen: false,
    shipmentId: null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Queries and mutations
  const { data: shipmentsData, isLoading: shipmentsLoading } = useShipments()
  const createShipment = useCreateShipment()
  const updateShipment = useUpdateShipment()
  const deleteShipmentMutation = useDeleteShipment()
  const extractOCR = useExtractOCR()
  const downloadPDF = useDownloadPDF()

  const shipments = shipmentsData?.items || []
  const isUploading = extractOCR.isPending || createShipment.isPending

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoadingMessage('Scanning document...')

      // Extract data using OCR - this automatically saves the document
      await extractOCR.mutateAsync(file)

      // Refresh the shipments list
      queryClient.invalidateQueries({ queryKey: ['shipments'] })

      showToast('Shipment created successfully!')
    } catch (error) {
      console.error('Error processing file:', error)
      showToast('Error processing file. Please try again.', 'error')
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleNewShipment = () => {
    fileInputRef.current?.click()
  }

  const handleSaveShipment = async (data: Partial<Shipment>) => {
    if (!data.id) return

    try {
      await updateShipment.mutateAsync({ id: data.id, data })

      // Download PDF
      await downloadPDF.mutateAsync({
        shipment: data as Shipment,
        filename: `BOL_${data.id.slice(0, 8)}.pdf`,
      })

      setEditingShipment(null)
      showToast('PDF downloaded successfully!')
    } catch (error) {
      console.error('Error saving shipment:', error)
      showToast('Error saving shipment', 'error')
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeleteConfirm({ isOpen: true, shipmentId: id })
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.shipmentId) return

    try {
      await deleteShipmentMutation.mutateAsync(deleteConfirm.shipmentId)
      showToast('Shipment deleted')
      setDeleteConfirm({ isOpen: false, shipmentId: null })
    } catch (error) {
      console.error('Error deleting shipment:', error)
      showToast('Error deleting shipment', 'error')
    }
  }

  if (!userProfile) return null

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,.pdf"
        onChange={handleFileChange}
      />

      {/* Edit Shipment Modal */}
      {editingShipment && (
        <EditShipmentModal
          shipment={editingShipment}
          isOpen={!!editingShipment}
          onClose={() => setEditingShipment(null)}
          onSave={handleSaveShipment}
        />
      )}

      {/* Account Modal */}
      {accountModalOpen && (
        <AccountModal
          userProfile={userProfile}
          isOpen={accountModalOpen}
          onClose={() => setAccountModalOpen(false)}
          onDeleteAccount={deleteAccount}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, shipmentId: null })}
        onConfirm={handleConfirmDelete}
        title="Delete Shipment"
        message="Are you sure you want to delete this shipment? This action cannot be undone and will also remove the associated document from storage."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteShipmentMutation.isPending}
      />

      {/* Sidebar */}
      <Sidebar
        currentView="dashboard"
        onNavigate={() => {}}
        onLogout={logout}
        onSettingsClick={() => setAccountModalOpen(true)}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full">
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
          onNewShipment={handleNewShipment}
          isUploading={isUploading}
          loadingMessage={loadingMessage}
        />

        <div className="flex-1 overflow-y-auto p-6">
          {/* Handwriting Notice */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl mb-6 flex items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <strong>Handwriting Notice:</strong> For messy documents, the AI uses a
              'Best Guess' algorithm. Always verify data (especially container #s)
              before downloading.
            </div>
          </div>

          {/* Shipments List */}
          {shipmentsLoading ? (
            <div className="text-center py-20 text-gray-400">
              Loading shipments...
            </div>
          ) : shipments.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No shipments yet. Upload a PDF to start.
            </div>
          ) : (
            <div className="space-y-4">
              {shipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="bg-white p-4 rounded-xl shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {shipment.shipTo_name || 'Unknown'}
                        </span>
                        <ConfidenceBadge confidence={shipment.aiConfidence} />
                        {shipment.source === 'ocr' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <FileText className="w-3 h-3 mr-1" />
                            OCR
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {shipment.id.slice(0, 8)} •{' '}
                        {shipment.createdAt
                          ? new Date(shipment.createdAt).toLocaleDateString()
                          : 'N/A'}
                        {shipment.aiModelUsed && (
                          <span className="ml-2 text-gray-300">
                            • {shipment.aiModelUsed}
                          </span>
                        )}
                      </div>
                      {shipment.fileName && (
                        <div className="text-xs text-gray-400 mt-1">
                          📎 {shipment.fileName}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {shipment.fileUrl && (
                        <button
                          onClick={async () => {
                            try {
                              const { url } = await shipmentsApi.getPreviewUrl(shipment.id)
                              window.open(url, '_blank')
                            } catch {
                              showToast('No document preview available', 'error')
                            }
                          }}
                          className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100"
                          title="Preview original document"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingShipment(shipment)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        title="Edit shipment"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(shipment.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                        title="Delete shipment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
