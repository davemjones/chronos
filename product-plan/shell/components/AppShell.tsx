'use client'

import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'
import { Clock } from 'lucide-react'

interface NavigationItem {
  label: string
  href: string
  icon?: React.ReactNode
  isActive?: boolean
}

interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: { name: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

export function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  onLogout,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              Chronos
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <MainNav items={navigationItems} onNavigate={onNavigate} />
          </div>

          {/* User Menu */}
          {user && (
            <UserMenu user={user} onLogout={onLogout} />
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:pb-8 lg:px-8">
        {children}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white md:hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-16 items-center justify-around">
          {navigationItems.map((item) => (
            <button
              key={item.href}
              onClick={() => onNavigate?.(item.href)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
                item.isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
