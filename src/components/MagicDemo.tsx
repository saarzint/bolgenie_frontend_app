import { useState, useEffect } from 'react'

export function MagicDemo() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4)
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-64 h-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden mx-auto transform rotate-3 hover:rotate-0 transition-all duration-500">
      {/* Window Header */}
      <div className="absolute top-0 left-0 w-full h-8 bg-gray-100 border-b flex items-center px-2 gap-1">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <div className="w-2 h-2 rounded-full bg-green-400" />
      </div>

      {/* Blurred Document Preview */}
      <div className="p-4 mt-6 space-y-2 opacity-50 blur-[1px]">
        <div className="h-4 w-3/4 bg-gray-300 rounded" />
        <div className="h-4 w-1/2 bg-gray-300 rounded" />
        <div className="h-20 w-full bg-gray-200 rounded mt-4" />
        <div className="h-4 w-full bg-gray-300 rounded mt-4" />
      </div>

      {/* Scanner Line */}
      <div className="scanner-line" />

      {/* Data Pop-ups */}
      {step >= 1 && (
        <div className="absolute top-16 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pop">
          Shipper Found
        </div>
      )}
      {step >= 2 && (
        <div className="absolute top-28 right-4 bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pop">
          Weight: 42k
        </div>
      )}
      {step >= 3 && (
        <div className="absolute bottom-10 left-8 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg animate-pop">
          BOL Ready
        </div>
      )}
    </div>
  )
}
