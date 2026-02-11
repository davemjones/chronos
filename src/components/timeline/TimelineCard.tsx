'use client'

import type { Timeline } from '@/types'
import { Calendar, Users, Lock, Globe, Star } from 'lucide-react'

interface TimelineCardProps {
  timeline: Timeline
  isFavorited?: boolean
  onSelect?: () => void
  onToggleFavorite?: () => void
}

export function TimelineCard({
  timeline,
  isFavorited = false,
  onSelect,
  onToggleFavorite,
}: TimelineCardProps) {
  const formatDateRange = (start: string | null, end: string | null) => {
    if (!start || !end) return 'No entries yet'
    const startYear = new Date(start).getFullYear()
    const endYear = new Date(end).getFullYear()
    if (startYear === endYear) return `${startYear}`
    return `${startYear} — ${endYear}`
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

  // Cycle through tag colors based on tag name hash
  const getTagColor = (tagName: string, index: number) => {
    const colors = ['indigo', 'amber', 'emerald', 'cyan', 'violet']
    return tagColorMap[colors[index % colors.length]]
  }

  return (
    <article
      onClick={onSelect}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100/50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700 dark:hover:shadow-indigo-900/30 cursor-pointer"
    >
      {/* Thumbnail or Gradient Background */}
      <div className="relative h-32 overflow-hidden">
        {timeline.thumbnailUrl ? (
          <img
            src={timeline.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-950">
            <div className="absolute inset-0 opacity-30">
              <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id={`grid-${timeline.id}`} width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300 dark:text-slate-700" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill={`url(#grid-${timeline.id})`} />
              </svg>
            </div>
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Visibility badge */}
        <div className="absolute left-3 top-3">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${
            timeline.isPublic
              ? 'bg-white/90 text-slate-700 dark:bg-slate-800/90 dark:text-slate-300'
              : 'bg-slate-900/80 text-white dark:bg-slate-700/90'
          }`}>
            {timeline.isPublic ? (
              <>
                <Globe className="h-3 w-3" />
                Public
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" />
                Private
              </>
            )}
          </span>
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite?.()
          }}
          className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur-sm transition-all ${
            isFavorited
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
              : 'bg-white/90 text-slate-400 hover:text-amber-500 dark:bg-slate-800/90 dark:text-slate-500 dark:hover:text-amber-400'
          }`}
        >
          <Star className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Date range overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white">
            <Calendar className="h-3.5 w-3.5" />
            {formatDateRange(timeline.dateRange.start, timeline.dateRange.end)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Title */}
        <h3 className="text-lg font-semibold leading-tight text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {timeline.title}
        </h3>

        {/* Description */}
        <p className="mt-1.5 line-clamp-2 text-sm text-slate-600 dark:text-slate-400" style={{ fontFamily: 'Inter, sans-serif' }}>
          {timeline.description}
        </p>

        {/* Tags */}
        {timeline.topTags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {timeline.topTags.slice(0, 3).map((tag, index) => (
              <span
                key={tag}
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getTagColor(tag, index)}`}
              >
                {tag}
              </span>
            ))}
            {timeline.topTags.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                +{timeline.topTags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-4">
          {/* Owner */}
          <div className="flex items-center gap-2">
            {timeline.owner.avatarUrl ? (
              <img
                src={timeline.owner.avatarUrl}
                alt={timeline.owner.name}
                className="h-6 w-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-900"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-600 ring-2 ring-white dark:bg-indigo-900 dark:text-indigo-300 dark:ring-slate-900">
                {timeline.owner.name.charAt(0)}
              </div>
            )}
            <span className="text-sm text-slate-600 dark:text-slate-400">
              {timeline.isOwned ? 'You' : timeline.owner.name}
            </span>
          </div>

          {/* Entry count */}
          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-500">
            <Users className="h-3.5 w-3.5" />
            <span>{timeline.entryCount} {timeline.entryCount === 1 ? 'entry' : 'entries'}</span>
          </div>
        </div>
      </div>

      {/* Hover indicator line */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-300 group-hover:w-full" />
    </article>
  )
}
