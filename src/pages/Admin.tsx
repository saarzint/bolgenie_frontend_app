import { useState, useRef } from 'react'
import { LayoutDashboard, Users, UploadCloud, Edit2, Trash2, Loader2, Shield, ShieldOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { EditShipmentModal } from '../components/modals/EditShipmentModal'
import { useExtractOCR, useDownloadPDF } from '../hooks'
import { useToast } from '../components/ui/Toast'
import { adminApi, type AdminUser } from '../api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Shipment } from '../types'

export function Admin() {
  const { logout } = useAuth()
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const [adminView, setAdminView] = useState<'overview' | 'users'>('overview')
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null)
  const [loadingMsg, setLoadingMsg] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const extractOCR = useExtractOCR()
  const downloadPDF = useDownloadPDF()

  // Fetch all shipments (admin view)
  const { data: allShipments = [], isLoading: shipmentsLoading } = useQuery({
    queryKey: ['admin', 'shipments'],
    queryFn: async () => {
      const response = await adminApi.getShipments()
      return response.items as Shipment[]
    },
    enabled: adminView === 'overview',
  })

  // Fetch all users (admin view)
  const { data: usersList = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const response = await adminApi.getUsers()
      return response.items as AdminUser[]
    },
    enabled: adminView === 'users',
  })

  // Delete shipment mutation
  const deleteShipment = useMutation({
    mutationFn: async (id: string) => {
      await adminApi.deleteShipment(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipments'] })
      showToast('Shipment deleted')
    },
  })

  // Set admin mutation
  const setAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      await adminApi.setAdmin(userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      showToast('User promoted to admin')
    },
    onError: () => {
      showToast('Failed to set admin role', 'error')
    },
  })

  // Remove admin mutation
  const removeAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      await adminApi.removeAdmin(userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
      showToast('Admin role removed')
    },
    onError: () => {
      showToast('Failed to remove admin role', 'error')
    },
  })

  const handleToggleAdmin = async (user: AdminUser) => {
    if (user.role === 'admin') {
      if (window.confirm(`Remove admin role from ${user.email}?`)) {
        removeAdminMutation.mutate(user.id)
      }
    } else {
      if (window.confirm(`Make ${user.email} an admin?`)) {
        setAdminMutation.mutate(user.id)
      }
    }
  }

  const handleTestUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoadingMsg('Analyzing...')
      const result = await extractOCR.mutateAsync(file)
      setEditingShipment({
        ...result.data,
        id: 'test-' + Date.now(),
        userId: 'admin',
        createdAt: new Date(),
        status: 'Draft',
      } as Shipment)
    } catch (error) {
      console.error('Error processing test file:', error)
      showToast('Error processing file', 'error')
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      setLoadingMsg('')
    }
  }

  const handleSaveAdmin = async (data: Partial<Shipment>) => {
    try {
      await downloadPDF.mutateAsync({
        shipment: data as Shipment,
        filename: `BOL_TEST_${Date.now()}.pdf`,
      })
      setEditingShipment(null)
      showToast('PDF generated successfully!')
    } catch (error) {
      showToast('Error generating PDF', 'error')
    }
  }

  const handleDeleteShipment = async (id: string) => {
    if (window.confirm('Delete this shipment?')) {
      deleteShipment.mutate(id)
    }
  }

  const testLoading = extractOCR.isPending

  return (
    <div className="flex h-screen bg-slate-900 text-white">
      {/* Edit Modal */}
      {editingShipment && (
        <EditShipmentModal
          shipment={editingShipment}
          isOpen={!!editingShipment}
          onClose={() => setEditingShipment(null)}
          onSave={handleSaveAdmin}
        />
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,.pdf"
        onChange={handleTestUpload}
      />

      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold border-b border-slate-700">
          Admin
        </div>
        <div className="p-4 space-y-2">
          <button
            onClick={() => setAdminView('overview')}
            className={`w-full flex items-center px-4 py-3 rounded-xl ${
              adminView === 'overview' ? 'bg-blue-600' : 'hover:bg-slate-700'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Overview
          </button>
          <button
            onClick={() => setAdminView('users')}
            className={`w-full flex items-center px-4 py-3 rounded-xl ${
              adminView === 'users' ? 'bg-blue-600' : 'hover:bg-slate-700'
            }`}
          >
            <Users className="w-5 h-5 mr-3" />
            Users
          </button>
        </div>
        <button
          onClick={logout}
          className="m-4 text-left text-red-400 mt-auto"
        >
          Log Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Portal</h1>

        {adminView === 'overview' ? (
          <div className="grid grid-cols-2 gap-8">
            {/* AI Sandbox */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="font-bold mb-4">AI Sandbox (Drayage/3PL Ready)</h3>
              <p className="text-sm text-gray-400 mb-4">
                Upload any document to test the 'Aggressive Handwriting' extraction.
                Produces a PDF BOL to save/edit.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={testLoading}
                className="bg-blue-600 px-4 py-2 rounded flex items-center hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {testLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    {loadingMsg || 'Processing...'}
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-5 h-5 mr-2" />
                    Upload Test Doc
                  </>
                )}
              </button>
            </div>

            {/* Global Feed */}
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
              <h3 className="font-bold mb-4">Global Feed</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {shipmentsLoading ? (
                  <div className="text-slate-500 text-center py-4">Loading...</div>
                ) : allShipments.length === 0 ? (
                  <div className="text-slate-500 text-center py-4">
                    No shipments found.
                  </div>
                ) : (
                  allShipments.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 bg-slate-700 rounded text-sm flex justify-between items-center"
                    >
                      <div>
                        <div className="font-bold">
                          {s.shipTo_name || 'Unknown'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {s.id.slice(0, 8)} &bull; User:{' '}
                          {s.userId ? s.userId.slice(0, 5) : 'Anon'}...
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingShipment(s)}
                          className="p-1 hover:text-blue-400 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteShipment(s.id)}
                          className="p-1 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Users View */
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="font-bold mb-4">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-slate-400 border-b border-slate-600">
                  <tr>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Role</th>
                    <th className="pb-2">Plan</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Joined</th>
                    <th className="pb-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        Loading users...
                      </td>
                    </tr>
                  ) : usersList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    usersList.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-slate-700/50 hover:bg-slate-700/50"
                      >
                        <td className="py-3">{u.email}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold capitalize ${
                              u.role === 'admin'
                                ? 'bg-purple-900 text-purple-200'
                                : 'bg-slate-600 text-slate-300'
                            }`}
                          >
                            {u.role || 'user'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold capitalize ${
                              u.plan === 'pro'
                                ? 'bg-blue-900 text-blue-200'
                                : 'bg-slate-600 text-slate-300'
                            }`}
                          >
                            {u.plan || 'Starter'}
                          </span>
                        </td>
                        <td className="py-3">
                          {u.isPaid ? (
                            <span className="text-green-400">Active</span>
                          ) : (
                            <span className="text-slate-500">Free</span>
                          )}
                        </td>
                        <td className="py-3 text-slate-400">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => handleToggleAdmin(u)}
                            disabled={setAdminMutation.isPending || removeAdminMutation.isPending}
                            className={`p-1.5 rounded transition-colors ${
                              u.role === 'admin'
                                ? 'hover:bg-red-900/50 text-red-400 hover:text-red-300'
                                : 'hover:bg-purple-900/50 text-slate-400 hover:text-purple-300'
                            } disabled:opacity-50`}
                            title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                          >
                            {u.role === 'admin' ? (
                              <ShieldOff className="w-4 h-4" />
                            ) : (
                              <Shield className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
