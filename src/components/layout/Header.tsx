import { Menu, Plus, Loader2 } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
  onNewShipment: () => void
  isUploading: boolean
  loadingMessage: string
}

export function Header({
  onMenuClick,
  onNewShipment,
  isUploading,
  loadingMessage,
}: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      <button
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="hidden md:block" />

      <button
        onClick={onNewShipment}
        disabled={isUploading}
        className={`
          bg-blue-600 text-white px-4 py-2 rounded-lg font-bold
          flex items-center transition-colors
          ${isUploading ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'}
        `}
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {loadingMessage}
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 mr-2" />
            New Shipment
          </>
        )}
      </button>
    </header>
  )
}
