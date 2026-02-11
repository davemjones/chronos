'use client'

interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

interface MainNavProps {
  items: NavigationItem[]
  onNavigate?: (href: string) => void
}

export function MainNav({ items, onNavigate }: MainNavProps) {
  return (
    <nav className="flex items-center gap-1">
      {items.map((item) => (
        <button
          key={item.href}
          onClick={() => onNavigate?.(item.href)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            item.isActive
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
          }`}
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
