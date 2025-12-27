import { LayoutDashboard, Settings } from 'lucide-react'
import { BolgenieLogo } from '../BolgenieLogo'

interface SidebarProps {
  currentView: string
  onNavigate: (view: string) => void
  onLogout: () => void
  onSettingsClick: () => void
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({
  currentView,
  onNavigate,
  onLogout,
  onSettingsClick,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white
          transform transition-transform duration-300
          md:relative md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col
        `}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 font-bold text-xl border-b border-slate-800">
          <BolgenieLogo className="w-6 h-6 mr-2" />
          Bolgenie
        </div>

        {/* Navigation */}
        <div className="p-4 space-y-2">
          <button
            onClick={() => {
              onNavigate('dashboard')
              onClose()
            }}
            className={`
              w-full flex items-center px-4 py-3 rounded-xl transition-colors
              ${currentView === 'dashboard' ? 'bg-slate-800' : 'hover:bg-slate-800'}
            `}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </button>

          <button
            onClick={() => {
              onSettingsClick()
              onClose()
            }}
            className="w-full flex items-center px-4 py-3 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </button>
        </div>

        <button
          onClick={onLogout}
          className="m-4 text-left text-red-400 mt-auto"
        >
          Log Out
        </button>
      </aside>
    </>
  )
}
