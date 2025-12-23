import { useState, useRef } from 'react'
import { AlertTriangle, Edit2, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Sidebar } from '../components/layout/Sidebar'
import { Header } from '../components/layout/Header'
import { EditShipmentModal } from '../components/modals/EditShipmentModal'
import { AccountModal } from '../components/modals/AccountModal'
import {
  useShipments,
  useCreateShipment,
  useUpdateShipment,
  useDeleteShipment,
  useExtractOCR,
  useDownloadPDF,
} from '../hooks'
import { useToast } from '../components/ui/Toast'
import type { Shipment } from '../types'

export function Dashboard() {
  const { user, userProfile, logout, deleteAccount } = useAuth()
  const { showToast } = useToast()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null)
  const [loadingMessage, setLoadingMessage] = useState('Analyzing...')

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

      // Extract data using OCR
      const result = await extractOCR.mutateAsync(file)

      setLoadingMessage('Creating shipment...')

      // Create shipment with extracted data
      await createShipment.mutateAsync(result.data)

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

  const handleDeleteShipment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this shipment?')) return

    try {
      await deleteShipmentMutation.mutateAsync(id)
      showToast('Shipment deleted')
    } catch (error) {
      console.error('Error deleting shipment:', error)
      showToast('Error deleting shipment', 'error')
    }
  }

  if (!user) return null

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
      <AccountModal
        user={user}
        userProfile={userProfile}
        isOpen={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onDeleteAccount={deleteAccount}
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
              No shipments yet. Upload a document to start.
            </div>
          ) : (
            <div className="space-y-4">
              {shipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="font-bold">
                      {shipment.shipTo_name ||
                        shipment.parties?.consignee?.name ||
                        'Unknown'}
                    </div>
                    <div className="text-xs text-gray-400">
                      {shipment.id.slice(0, 8)} &bull;{' '}
                      {shipment.createdAt
                        ? new Date(shipment.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </div>
                    {shipment.container_no && (
                      <div className="text-xs text-blue-600 mt-1">
                        Container: {shipment.container_no}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingShipment(shipment)}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteShipment(shipment.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
