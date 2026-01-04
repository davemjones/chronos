'use client'

import type { Entry, Tag } from '../types'

interface EntryNodeProps {
  entry: Entry
  tags: Tag[]
  isSelected?: boolean
  isOwned?: boolean
  orientation?: 'horizontal' | 'vertical'
  zoomLevel?: number
  onSelect?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function EntryNode({
  entry,
  tags,
  isSelected = false,
  isOwned = false,
  orientation = 'horizontal',
  zoomLevel = 1,
  onSelect,
  onEdit,
  onDelete,
}: EntryNodeProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const tagColorMap: Record<string, string> = {
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300',
    cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    slate: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  }

  // Show more or less detail based on zoom level
  const showFullContent = zoomLevel >= 0.8
  const showTags = zoomLevel >= 0.5
  const showTitle = zoomLevel >= 0.3

  if (orientation === 'vertical') {
    return (
      <div className="relative flex gap-4">
        {/* Timeline line and dot */}
        <div className="flex flex-col items-center">
          <div
            className={`h-4 w-4 rounded-full border-2 transition-all ${
              isSelected
                ? 'border-indigo-500 bg-indigo-500 scale-125'
                : 'border-slate-300 bg-white hover:border-indigo-400 dark:border-slate-600 dark:bg-slate-800'
            }`}
          />
          <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Content */}
        <button
          onClick={onSelect}
          className={`group mb-8 flex-1 rounded-xl border p-4 text-left transition-all ${
            isSelected
              ? 'border-indigo-300 bg-indigo-50 shadow-lg shadow-indigo-100/50 dark:border-indigo-700 dark:bg-indigo-950/50 dark:shadow-indigo-900/30'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
          }`}
        >
          {/* Date */}
          <time className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {formatDate(entry.date)}
          </time>

          {/* Title */}
          {showTitle && (
            <h3
              className={`mt-1 font-semibold leading-tight ${
                isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'
              }`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {entry.title}
            </h3>
          )}

          {/* Content preview */}
          {showFullContent && (
            <p
              className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {entry.content.replace(/[#*>\[\]`_]/g, '').slice(0, 150)}...
            </p>
          )}

          {/* Tags */}
          {showTags && tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tagColorMap[tag.color] || tagColorMap.slate}`}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Creator */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>by {entry.creator.name}</span>
          </div>
        </button>
      </div>
    )
  }

  // Horizontal orientation
  return (
    <div className="relative flex flex-col items-center">
      {/* Content card */}
      <button
        onClick={onSelect}
        className={`group w-64 rounded-xl border p-4 text-left transition-all ${
          isSelected
            ? 'border-indigo-300 bg-indigo-50 shadow-lg shadow-indigo-100/50 dark:border-indigo-700 dark:bg-indigo-950/50 dark:shadow-indigo-900/30'
            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700'
        }`}
      >
        {/* Date */}
        <time className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {formatDate(entry.date)}
        </time>

        {/* Title */}
        {showTitle && (
          <h3
            className={`mt-1 font-semibold leading-tight ${
              isSelected ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-900 dark:text-white'
            }`}
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {entry.title}
          </h3>
        )}

        {/* Content preview */}
        {showFullContent && (
          <p
            className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {entry.content.replace(/[#*>\[\]`_]/g, '').slice(0, 100)}...
          </p>
        )}

        {/* Tags */}
        {showTags && tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${tagColorMap[tag.color] || tagColorMap.slate}`}
              >
                {tag.name}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-xs text-slate-400">+{tags.length - 2}</span>
            )}
          </div>
        )}
      </button>

      {/* Connector line */}
      <div className="h-4 w-0.5 bg-slate-200 dark:bg-slate-700" />

      {/* Dot on timeline */}
      <div
        className={`h-4 w-4 rounded-full border-2 transition-all ${
          isSelected
            ? 'border-indigo-500 bg-indigo-500 scale-125'
            : 'border-slate-300 bg-white hover:border-indigo-400 dark:border-slate-600 dark:bg-slate-800'
        }`}
      />
    </div>
  )
}
