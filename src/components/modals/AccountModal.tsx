import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { CreditCard, ArrowRight } from 'lucide-react'
import type { UserProfile } from '../../types'

const STRIPE_PORTAL_LINK = import.meta.env.VITE_STRIPE_PORTAL_LINK

interface AccountModalProps {
  userProfile: UserProfile | null
  isOpen: boolean
  onClose: () => void
  onDeleteAccount: () => Promise<void | { success: boolean; error?: string }>
}

export function AccountModal({
  userProfile,
  isOpen,
  onClose,
  onDeleteAccount,
}: AccountModalProps) {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to permanently delete your account? This action cannot be undone.')) {
      await onDeleteAccount()
      window.location.reload()
    }
  }

  const handleManageSubscription = () => {
    window.location.href = STRIPE_PORTAL_LINK
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account">
      <div className="p-6 space-y-4">
        {/* User Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
            {userProfile?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="font-bold">{userProfile?.email || 'Unknown'}</div>
            <div className="text-sm text-gray-500 capitalize">
              {userProfile?.plan || 'Starter'} Plan
            </div>
          </div>
        </div>

        {/* Company Info */}
        {userProfile?.companyName && (
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1">
              Company
            </div>
            <div className="font-medium">{userProfile.companyName}</div>
            {userProfile.companyAddress && (
              <div className="text-sm text-gray-500 mt-1">
                {userProfile.companyAddress}
              </div>
            )}
          </div>
        )}

        {/* Manage Subscription */}
        {userProfile?.isPaid && (
          <button
            onClick={handleManageSubscription}
            className="w-full flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <CreditCard className="w-5 h-5 mr-3 text-gray-600" />
              Manage Subscription
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* Delete Account */}
        <Button
          variant="ghost"
          onClick={handleDelete}
          className="w-full text-red-600 hover:bg-red-50"
        >
          Delete Account
        </Button>
      </div>
    </Modal>
  )
}
