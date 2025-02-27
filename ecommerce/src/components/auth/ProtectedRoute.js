'use client'

import { useAuthStore } from '@/app/store/useAuthStore'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children, allowedRoles = ['admin', 'customer'] }) {
  const user = useAuthStore((state) => state.user)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=${pathname}`)
    } else if (!allowedRoles.includes(user.role)) {
      router.push('/unauthorized')
    }
  }, [user, router, pathname, allowedRoles])

  if (!user || !allowedRoles.includes(user.role)) {
    return null
  }

  return children
}