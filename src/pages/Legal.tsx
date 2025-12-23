import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

interface LegalProps {
  type: 'terms' | 'privacy'
}

export function Legal({ type }: LegalProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-white min-h-screen p-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-8 font-bold flex items-center hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8">
          {type === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
        </h1>

        <article className="prose prose-slate max-w-none">
          <p className="text-gray-600 mb-6">
            Welcome to Bolgenie (Hello Lisa AI). By using our AI logistics tools, you
            agree to our standard SaaS terms.
          </p>

          {type === 'terms' ? (
            <>
              <h2 className="text-xl font-bold mt-8 mb-4">1. AI Accuracy & Liability</h2>
              <p className="text-gray-600 mb-4">
                Bolgenie uses advanced OCR technology to interpret documents. While we
                strive for high accuracy, all data must be verified by a human dispatcher.
                We are not liable for cargo claims, missed appointments, or financial
                losses resulting from incorrect data.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">2. Acceptable Use</h2>
              <p className="text-gray-600 mb-4">
                You agree to use Bolgenie only for lawful purposes related to logistics
                and freight operations. You may not attempt to reverse engineer, exploit,
                or abuse our AI systems.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">3. Subscription Terms</h2>
              <p className="text-gray-600 mb-4">
                Subscriptions are billed monthly. You may cancel at any time, and your
                access will continue until the end of the billing period. Refunds are not
                provided for partial months.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">4. Data Ownership</h2>
              <p className="text-gray-600 mb-4">
                You retain full ownership of all documents and data you upload to
                Bolgenie. We do not claim any intellectual property rights over your
                content.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">5. Service Availability</h2>
              <p className="text-gray-600 mb-4">
                We strive for 99.9% uptime but do not guarantee uninterrupted service.
                Scheduled maintenance will be announced in advance when possible.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold mt-8 mb-4">1. Data Collection</h2>
              <p className="text-gray-600 mb-4">
                We collect information you provide directly, including your email
                address, company name, and uploaded documents. We also collect usage data
                to improve our services.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">2. Data Processing</h2>
              <p className="text-gray-600 mb-4">
                We process your documents solely for the purpose of generating Bills of
                Lading. Documents are temporarily stored during processing and deleted
                according to your retention settings.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">3. Data Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell your shipping data to third parties. We may share data
                with service providers who assist in operating our platform (e.g., cloud
                hosting, payment processing).
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">4. Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement industry-standard security measures including encryption in
                transit and at rest. Access to customer data is restricted to authorized
                personnel only.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">5. Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to access, correct, or delete your personal data. You
                can request a copy of your data or account deletion by contacting
                support@hellolisa.ai.
              </p>

              <h2 className="text-xl font-bold mt-8 mb-4">6. Contact</h2>
              <p className="text-gray-600 mb-4">
                For privacy-related inquiries, contact us at:
                <br />
                Hello Lisa AI LLC
                <br />
                1905 Sherman St, Denver, CO 80203
                <br />
                info@hellolisa.ai
              </p>
            </>
          )}
        </article>

        <div className="mt-12 pt-8 border-t text-sm text-gray-400">
          Last updated: January 2025
        </div>
      </div>
    </div>
  )
}
