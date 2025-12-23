import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useIsAdmin, useIsPaid, useHasCompletedSetup } from './hooks'
import {
  Landing,
  Pricing,
  Auth,
  Dashboard,
  Settings,
  Payment,
  Admin,
  Legal,
} from './pages'

// Loading spinner component
function LoadingScreen() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  )
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}

// Route that redirects authenticated users
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

// Main dashboard router - handles admin, setup, and payment checks
function DashboardRouter() {
  const { user, loading, userProfile } = useAuth()
  const isAdmin = useIsAdmin()
  const isPaid = useIsPaid()
  const hasCompletedSetup = useHasCompletedSetup()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Admin users go directly to admin dashboard
  if (isAdmin) {
    return <Admin />
  }

  // New users need to complete setup
  if (!hasCompletedSetup) {
    return <Navigate to="/settings" replace />
  }

  // Unpaid users need to complete payment
  if (!isPaid) {
    return <Navigate to="/payment" replace />
  }

  return <Dashboard />
}

// Settings route - only for users who haven't completed setup
function SettingsRouter() {
  const { user, loading } = useAuth()
  const hasCompletedSetup = useHasCompletedSetup()
  const isPaid = useIsPaid()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If setup is complete and paid, go to dashboard
  if (hasCompletedSetup && isPaid) {
    return <Navigate to="/dashboard" replace />
  }

  return <Settings />
}

// Payment route - only for users who have completed setup but not paid
function PaymentRouter() {
  const { user, loading } = useAuth()
  const hasCompletedSetup = useHasCompletedSetup()
  const isPaid = useIsPaid()

  if (loading) {
    return <LoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // If already paid, go to dashboard
  if (isPaid) {
    return <Navigate to="/dashboard" replace />
  }

  // If setup not complete, go to settings first
  if (!hasCompletedSetup) {
    return <Navigate to="/settings" replace />
  }

  return <Payment />
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/terms" element={<Legal type="terms" />} />
        <Route path="/privacy" element={<Legal type="privacy" />} />

        {/* Auth routes - redirect if already logged in */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Auth mode="login" />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicOnlyRoute>
              <Auth mode="signup" />
            </PublicOnlyRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <PaymentRouter />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </ErrorBoundary>
  )
}
