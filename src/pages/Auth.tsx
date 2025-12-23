import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui'
import { Button } from '../components/ui'
import { BolgenieLogo } from '../components/BolgenieLogo'

interface AuthProps {
  mode: 'login' | 'signup'
}

export function Auth({ mode }: AuthProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, signup, resetPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const from = (location.state as { from?: string })?.from || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = mode === 'login'
      ? await login(email, password)
      : await signup(email, password)

    setLoading(false)

    if (result.success) {
      navigate(mode === 'signup' ? '/settings' : from, { replace: true })
    } else {
      setError(result.error || 'An error occurred')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await resetPassword(email)
    setLoading(false)

    if (result.success) {
      setResetSent(true)
    } else {
      setError(result.error || 'Failed to send reset email')
    }
  }

  if (showResetPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 animate-fade-in">
        <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-xl">
          <div className="flex justify-center mb-6">
            <BolgenieLogo className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

          {resetSent ? (
            <div className="text-center">
              <p className="text-green-600 mb-4">
                Password reset email sent! Check your inbox.
              </p>
              <button
                onClick={() => {
                  setShowResetPassword(false)
                  setResetSent(false)
                }}
                className="text-blue-600 hover:underline"
              >
                Back to login
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 mb-4 text-sm rounded-xl">
                  {error}
                </div>
              )}
              <form onSubmit={handleResetPassword} className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" loading={loading} className="w-full">
                  Send Reset Link
                </Button>
              </form>
              <button
                onClick={() => setShowResetPassword(false)}
                className="mt-4 w-full text-sm text-gray-500 hover:text-black"
              >
                Back to login
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-sm p-8 rounded-3xl shadow-xl">
        <div className="flex justify-center mb-6">
          <BolgenieLogo className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">
          {mode === 'login' ? 'Welcome Back' : 'Join Bolgenie'}
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 mb-4 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} className="w-full">
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
        </form>

        {mode === 'login' && (
          <button
            onClick={() => setShowResetPassword(true)}
            className="mt-4 w-full text-sm text-gray-400 hover:text-gray-600"
          >
            Forgot password?
          </button>
        )}

        <button
          onClick={() => navigate(mode === 'login' ? '/signup' : '/login')}
          className="mt-4 w-full text-sm text-gray-500 hover:text-black"
        >
          Switch to {mode === 'login' ? 'Sign Up' : 'Log In'}
        </button>
      </div>
    </div>
  )
}
