'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Clock, Filter, Sparkles, Users } from 'lucide-react'
import { AppShell } from './AppShell'

const NAV_ITEMS = [
  { label: 'Timeline', href: '/', icon: <Clock className="h-5 w-5" /> },
  { label: 'Curate', href: '/curate', icon: <Filter className="h-5 w-5" /> },
  { label: 'Discovery', href: '/discovery', icon: <Sparkles className="h-5 w-5" /> },
  { label: 'Collaboration', href: '/collaboration', icon: <Users className="h-5 w-5" /> },
]

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const navigationItems = NAV_ITEMS.map((item) => ({
    ...item,
    isActive: item.href === '/' ? pathname === '/' : pathname.startsWith(item.href),
  }))

  return (
    <AppShell
      navigationItems={navigationItems}
      user={{ name: 'Demo User' }}
      onNavigate={(href) => router.push(href)}
      onLogout={() => {
        // TODO: Implement real logout
        console.log('Logout clicked')
      }}
    >
      {children}
    </AppShell>
  )
}
