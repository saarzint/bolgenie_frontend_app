import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { BolgenieLogo } from '../components/BolgenieLogo'

// Stripe checkout links - replace with your actual links
const STRIPE_CHECKOUT_LINKS = {
  starter: 'https://buy.stripe.com/your_starter_link',
  pro: 'https://buy.stripe.com/your_pro_link',
}

export function Payment() {
  const navigate = useNavigate()
  const { selectedPlan, completePayment } = useAuth()
  const [loading, setLoading] = useState(false)

  const plan = selectedPlan || 'starter'
  const planDetails = {
    starter: { name: 'Starter', price: '$99/mo', features: ['50 BOLs/month', 'Standard OCR', 'Email support'] },
    pro: { name: 'Pro', price: '$299/mo', features: ['500 BOLs/month', 'Advanced AI', 'Priority support'] },
  }

  const details = planDetails[plan as keyof typeof planDetails] || planDetails.starter

  const handleCheckout = () => {
    setLoading(true)
    // Redirect to Stripe Checkout
    const checkoutUrl = STRIPE_CHECKOUT_LINKS[plan as keyof typeof STRIPE_CHECKOUT_LINKS]
    if (checkoutUrl && checkoutUrl !== 'https://buy.stripe.com/your_starter_link') {
      window.location.href = checkoutUrl
    } else {
      // Demo mode - simulate payment completion
      setTimeout(async () => {
        await completePayment()
        setLoading(false)
        navigate('/dashboard')
      }, 1000)
    }
  }

  const handleSkip = async () => {
    // For demo purposes only - skip payment
    await completePayment()
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <BolgenieLogo className="w-12 h-12" />
        </div>

        <CreditCard className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Subscribe to {details.name}</h2>
        <p className="text-3xl font-bold text-blue-600 mb-6">{details.price}</p>

        <div className="bg-gray-50 p-4 rounded-xl mb-6 text-left">
          <p className="text-sm font-bold text-gray-500 mb-3">INCLUDED:</p>
          <ul className="space-y-2">
            {details.features.map((feature, i) => (
              <li key={i} className="flex items-center text-sm">
                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <Button onClick={handleCheckout} loading={loading} className="w-full">
          {loading ? 'Processing...' : 'Pay Now'}
        </Button>

        <button
          onClick={handleSkip}
          className="mt-4 text-sm text-gray-400 hover:text-gray-600"
        >
          Skip for now (Demo)
        </button>

        <p className="mt-6 text-xs text-gray-400">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  )
}
