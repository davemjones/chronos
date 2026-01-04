'use client'

import type { Tag } from '../types'
import { X, Filter } from 'lucide-react'

interface TagFilterProps {
  availableTags: Tag[]
  selectedTagIds: string[]
  onTagToggle?: (tagId: string) => void
  onClearAll?: () => void
}

export function TagFilter({
  availableTags,
  selectedTagIds,
  onTagToggle,
  onClearAll,
}: TagFilterProps) {
  const tagColorMap: Record<string, { bg: string; selected: string }> = {
    indigo: {
      bg: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50',
      selected: 'bg-indigo-500 text-white ring-2 ring-indigo-300 dark:ring-indigo-700',
    },
    cyan: {
      bg: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:hover:bg-cyan-900/50',
      selected: 'bg-cyan-500 text-white ring-2 ring-cyan-300 dark:ring-cyan-700',
    },
    red: {
      bg: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50',
      selected: 'bg-red-500 text-white ring-2 ring-red-300 dark:ring-red-700',
    },
    slate: {
      bg: 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600',
      selected: 'bg-slate-600 text-white ring-2 ring-slate-400 dark:ring-slate-500',
    },
    amber: {
      bg: 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50',
      selected: 'bg-amber-500 text-white ring-2 ring-amber-300 dark:ring-amber-700',
    },
    emerald: {
      bg: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:hover:bg-emerald-900/50',
      selected: 'bg-emerald-500 text-white ring-2 ring-emerald-300 dark:ring-emerald-700',
    },
    violet: {
      bg: 'bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:hover:bg-violet-900/50',
      selected: 'bg-violet-500 text-white ring-2 ring-violet-300 dark:ring-violet-700',
    },
    blue: {
      bg: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50',
      selected: 'bg-blue-500 text-white ring-2 ring-blue-300 dark:ring-blue-700',
    },
    pink: {
      bg: 'bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:hover:bg-pink-900/50',
      selected: 'bg-pink-500 text-white ring-2 ring-pink-300 dark:ring-pink-700',
    },
    orange: {
      bg: 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:hover:bg-orange-900/50',
      selected: 'bg-orange-500 text-white ring-2 ring-orange-300 dark:ring-orange-700',
    },
  }

  const hasFilters = selectedTagIds.length > 0

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">Filter</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {availableTags.map((tag) => {
          const isSelected = selectedTagIds.includes(tag.id)
          const colors = tagColorMap[tag.color] || tagColorMap.slate

          return (
            <button
              key={tag.id}
              onClick={() => onTagToggle?.(tag.id)}
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-all ${
                isSelected ? colors.selected : colors.bg
              }`}
            >
              {tag.name}
              {isSelected && <X className="ml-1.5 h-3 w-3" />}
            </button>
          )
        })}

        {hasFilters && (
          <button
            onClick={onClearAll}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
