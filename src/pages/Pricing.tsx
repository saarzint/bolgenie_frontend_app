import { useNavigate } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { BolgenieLogo } from '../components/BolgenieLogo'
import { useAuth } from '../context/AuthContext'

export function Pricing() {
  const navigate = useNavigate()
  const { setSelectedPlan } = useAuth()

  const selectPlan = (plan: string) => {
    setSelectedPlan(plan)
    navigate('/signup')
  }

  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in">
      {/* Navigation */}
      <nav className="p-6 bg-white flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div
          className="font-bold text-xl flex items-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <BolgenieLogo className="w-8 h-8 mr-2" />
          Bolgenie
        </div>
        <button
          onClick={() => navigate('/')}
          className="font-bold text-sm text-gray-500 hover:text-black"
        >
          Back
        </button>
      </nav>

      <div className="container mx-auto px-6 py-16 text-center">
        {/* Header */}
        <header className="max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">
            Transparent Logistics Software Pricing for Brokers & Carriers
          </h1>
          <p className="text-xl text-gray-600">
            Simple, flat-rate pricing. No hidden fees. Cancel anytime.
          </p>
        </header>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          {/* Starter */}
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:-translate-y-1 transition-transform text-left">
            <div className="bg-gray-100 w-fit px-3 py-1 rounded-full text-xs font-bold text-gray-600 mb-4">
              FOR INDIVIDUALS
            </div>
            <h3 className="text-2xl font-bold">Starter Plan</h3>
            <div className="text-5xl font-bold my-6">
              $99
              <span className="text-lg text-gray-400 font-medium">/mo</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              Perfect for independent freight brokers processing standard shipments.
            </p>
            <ul className="space-y-4 mb-8 text-gray-700 text-sm font-medium">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                50 BOLs / Month
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                Standard AI OCR
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                Email Support
              </li>
            </ul>
            <button
              onClick={() => selectPlan('starter')}
              className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
            >
              Select Starter
            </button>
          </div>

          {/* Pro */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-blue-600 relative text-left transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl rounded-tr-2xl">
              MOST POPULAR
            </div>
            <div className="bg-blue-50 w-fit px-3 py-1 rounded-full text-xs font-bold text-blue-600 mb-4">
              FOR TEAMS & DRAYAGE
            </div>
            <h3 className="text-2xl font-bold">Pro Plan</h3>
            <div className="text-5xl font-bold my-6 text-blue-600">
              $299
              <span className="text-lg text-gray-400 font-medium">/mo</span>
            </div>
            <p className="text-gray-500 text-sm mb-6">
              For high-volume dispatchers requiring container tracking and advanced OCR.
            </p>
            <ul className="space-y-4 mb-8 text-gray-700 text-sm font-medium">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-blue-600" />
                <strong>500 BOLs / Month</strong>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-blue-600" />
                <strong>Drayage / Container Support</strong>
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-blue-600" />
                Advanced AI Pro (Handwriting)
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-blue-600" />
                Priority Processing
              </li>
            </ul>
            <button
              onClick={() => selectPlan('pro')}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-colors"
            >
              Start Free Trial
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white text-left">
            <div className="bg-slate-800 w-fit px-3 py-1 rounded-full text-xs font-bold text-slate-300 mb-4">
              FOR 3PLs & ENTERPRISE
            </div>
            <h3 className="text-2xl font-bold">Enterprise</h3>
            <div className="text-5xl font-bold my-6">Custom</div>
            <p className="text-slate-400 text-sm mb-6">
              Unlimited volume, custom API integrations, and dedicated support.
            </p>
            <ul className="space-y-4 mb-8 text-slate-300 text-sm font-medium">
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                Unlimited BOLs
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                API Access
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                Custom Templates
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                Dedicated Account Manager
              </li>
            </ul>
            <a
              href="mailto:info@hellolisa.ai?subject=Bolgenie Enterprise Quote"
              className="block w-full py-4 bg-green-500 text-white text-center rounded-xl font-bold hover:bg-green-600 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-20 text-left">
          <div className="p-8 border-b bg-gray-50">
            <h3 className="font-bold text-xl">Feature Breakdown</h3>
          </div>
          <div className="grid grid-cols-3 p-4 border-b text-sm font-bold text-gray-500">
            <div>FEATURE</div>
            <div>STARTER</div>
            <div className="text-blue-600">PRO</div>
          </div>
          <div className="grid grid-cols-3 p-4 border-b text-sm hover:bg-gray-50">
            <div>Monthly BOL Limit</div>
            <div>50</div>
            <div className="font-bold">500</div>
          </div>
          <div className="grid grid-cols-3 p-4 border-b text-sm hover:bg-gray-50">
            <div>Handwriting OCR</div>
            <div>Basic</div>
            <div className="font-bold text-green-600">Advanced AI Pro</div>
          </div>
          <div className="grid grid-cols-3 p-4 border-b text-sm hover:bg-gray-50">
            <div>Container/Seal # Extraction</div>
            <div className="text-gray-300">-</div>
            <div className="font-bold text-green-600">Included</div>
          </div>
          <div className="grid grid-cols-3 p-4 border-b text-sm hover:bg-gray-50">
            <div>Cloud Storage</div>
            <div>30 Days</div>
            <div className="font-bold">Unlimited</div>
          </div>
          <div className="grid grid-cols-3 p-4 text-sm hover:bg-gray-50">
            <div>Support</div>
            <div>Email</div>
            <div className="font-bold">Priority Chat</div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto text-left">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white p-6 rounded-2xl border hover:shadow-sm group">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center">
                Can I upgrade later?
                <span className="text-blue-600 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm">
                Yes! You can switch between Starter and Pro plans at any time from your
                account settings. The change is immediate.
              </p>
            </details>
            <details className="bg-white p-6 rounded-2xl border hover:shadow-sm group">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center">
                Do you support Enterprise volumes?
                <span className="text-blue-600 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm">
                Yes. For 3PLs needing 1,000+ BOLs/month or API access, please contact
                sales for custom pricing.
              </p>
            </details>
            <details className="bg-white p-6 rounded-2xl border hover:shadow-sm group">
              <summary className="font-bold cursor-pointer list-none flex justify-between items-center">
                Is there a contract?
                <span className="text-blue-600 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-4 text-gray-600 text-sm">
                No. Bolgenie is a month-to-month service. You can cancel anytime with one
                click in your dashboard.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  )
}
