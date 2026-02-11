'use client'

import type { TimelineCategory } from '@/types'
import { Globe, Star, User, LayoutGrid } from 'lucide-react'

interface CategoryTabsProps {
  activeCategory: TimelineCategory
  counts?: {
    all: number
    public: number
    favorited: number
    owned: number
  }
  onCategoryChange?: (category: TimelineCategory) => void
}

const categories: { id: TimelineCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <LayoutGrid className="h-4 w-4" /> },
  { id: 'public', label: 'Public', icon: <Globe className="h-4 w-4" /> },
  { id: 'favorited', label: 'Favorites', icon: <Star className="h-4 w-4" /> },
  { id: 'owned', label: 'My Timelines', icon: <User className="h-4 w-4" /> },
]

export function CategoryTabs({
  activeCategory,
  counts,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/50">
      {categories.map((category) => {
        const isActive = activeCategory === category.id
        const count = counts?.[category.id]

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange?.(category.id)}
            className={`relative flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            <span className={isActive ? 'text-indigo-500 dark:text-indigo-400' : ''}>
              {category.icon}
            </span>
            <span className="hidden sm:inline">{category.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                  isActive
                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
