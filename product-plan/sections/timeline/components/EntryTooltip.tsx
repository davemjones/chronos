'use client'

import type { Entry, Tag } from '../types'

interface EntryTooltipProps {
  entry: Entry
  tags: Tag[]
  position?: { x: number; y: number }
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

export function EntryTooltip({ entry, tags }: EntryTooltipProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // Get first line of content, stripped of markdown
  const contentPreview = entry.content
    .split('\n')[0]
    .replace(/[#*>\[\]`_]/g, '')
    .slice(0, 100)

  return (
    <div className="pointer-events-none w-72 animate-in fade-in zoom-in-95 duration-150">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-700 dark:bg-slate-800">
        {/* Date */}
        <time className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
          {formatDate(entry.date)}
        </time>

        {/* Title */}
        <h3
          className="mt-1 font-semibold leading-tight text-slate-900 dark:text-white"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {entry.title}
        </h3>

        {/* Content preview */}
        <p
          className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {contentPreview}...
        </p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  tagColorMap[tag.color] || tagColorMap.slate
                }`}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Click hint */}
        <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
          <span>Click to view details</span>
          <span className="text-slate-300">→</span>
        </div>
      </div>
    </div>
  )
}
