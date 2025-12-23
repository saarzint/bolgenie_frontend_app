import { useAuth } from '../context/AuthContext'

export function useProfile() {
  const { userProfile, updateProfile, loading } = useAuth()

  return {
    profile: userProfile,
    updateProfile,
    isLoading: loading,
  }
}

export function useIsAdmin() {
  const { user, userProfile } = useAuth()

  // Check both role and specific admin email
  const isAdmin =
    userProfile?.role === 'admin' ||
    user?.email === 'hellolisa.ai1@gmail.com'

  return isAdmin
}

export function useIsPaid() {
  const { userProfile } = useAuth()
  return userProfile?.isPaid ?? false
}

export function useHasCompletedSetup() {
  const { userProfile } = useAuth()
  return !!userProfile?.companyName
}
