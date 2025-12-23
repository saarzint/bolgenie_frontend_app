import { useNavigate } from 'react-router-dom'
import { BrainCircuit, Container, FileCheck } from 'lucide-react'
import { BolgenieLogo } from '../components/BolgenieLogo'
import { useAuth } from '../context/AuthContext'

export function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="bg-white min-h-screen flex flex-col animate-fade-in">
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur z-50 border-b border-gray-100">
        <div
          className="font-bold text-xl flex items-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <BolgenieLogo className="w-8 h-8 mr-2" />
          Bolgenie
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/pricing')}
            className="hidden md:block font-medium text-gray-600 hover:text-black"
          >
            Pricing
          </button>
          <button
            onClick={() => navigate(user ? '/dashboard' : '/login')}
            className="font-bold bg-blue-50 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-100 transition"
          >
            {user ? 'Dashboard' : 'Log In'}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 leading-tight">
          Stop Typing.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Start Shipping.
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
          The #1 <strong>AI Bill of Lading Generator</strong> for Freight Brokers &
          Drayage Dispatchers. Instantly convert PDF Rate Cons into error-free BOLs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/pricing')}
            className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-xl hover:scale-105 transition-all"
          >
            Start Free Trial
          </button>
        </div>
        <div className="mt-12 w-full max-w-4xl">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
            <video
              src="/assets/demo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto"
            />
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-slate-50 py-20 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold mb-4">
              Why Logistics Leaders Choose Bolgenie
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built for speed, accuracy, and the specific needs of the modern freight
              industry.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <article className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-3">AI Handwriting OCR</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Our Advanced AI Pro engine reads messy handwriting, stamped paperwork,
                and low-quality scans that other OCR tools miss.
              </p>
            </article>
            <article className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                <Container className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-3">Drayage Ready</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Specifically trained to extract Container Numbers, Seal Numbers, and
                Steamship Line details for port dispatchers.
              </p>
            </article>
            <article className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl mb-3">Instant PDF Gen</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Generate professional, standardized Bills of Lading in seconds. Download,
                print, or email directly to drivers.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Trusted by Freight Brokers & 3PLs</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60 grayscale">
            <div className="font-black text-2xl text-gray-400">DHL</div>
            <div className="font-black text-2xl text-gray-400">C.H. ROBINSON</div>
            <div className="font-black text-2xl text-gray-400">TQL</div>
            <div className="font-black text-2xl text-gray-400">XPO</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-gray-400 py-16 px-6 text-sm">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center font-bold text-white text-xl mb-4">
              <BolgenieLogo className="w-6 h-6 mr-2" />
              Bolgenie
            </div>
            <p className="opacity-60">Automating logistics one document at a time.</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/pricing')}
                  className="hover:text-white"
                >
                  Pricing
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-white">
                  Features
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:info@hellolisa.ai" className="hover:text-white">
                  Contact Support
                </a>
              </li>
              <li className="text-xs mt-4 opacity-50">
                Hello Lisa AI LLC
                <br />
                1905 Sherman St
                <br />
                Denver, CO 80203
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-white">
                  Terms
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-white">
                  Privacy
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-xs opacity-40">
          &copy; 2025 Hello Lisa AI LLC. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
