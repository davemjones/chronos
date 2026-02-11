'use client'

import type { Entry, Tag } from '@/types'
import { X, Edit2, Trash2, Calendar, User, ExternalLink, Tag as TagIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface EntryDetailPanelProps {
  entry: Entry
  tags: Tag[]
  isOwned?: boolean
  onClose?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onUpdateTags?: (tagIds: string[]) => void
}

export function EntryDetailPanel({
  entry,
  tags,
  isOwned = false,
  onClose,
  onEdit,
  onDelete,
  onUpdateTags,
}: EntryDetailPanelProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  return (
    <aside className="flex h-full w-full flex-col border-l border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:w-[480px]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <h2
          className="text-lg font-semibold text-slate-900 dark:text-white"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Entry Details
        </h2>
        <div className="flex items-center gap-2">
          {isOwned && (
            <>
              <button
                onClick={onEdit}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                title="Edit entry"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-950 dark:hover:text-red-400"
                title="Delete entry"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            title="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Media */}
        {entry.mediaUrl && (
          <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={entry.mediaUrl}
              alt={entry.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Title */}
          <h1
            className="text-2xl font-bold leading-tight text-slate-900 dark:text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {entry.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <time>{formatDate(entry.date)}</time>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              <span>{entry.creator.name}</span>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <TagIcon className="h-4 w-4" />
                <span>Tags</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${tagColorMap[tag.color] || tagColorMap.slate}`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="mt-6">
            <div
              className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-indigo-600 dark:prose-a:text-indigo-400"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-semibold" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {children}
                    </h3>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      {children}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-indigo-300 bg-indigo-50 py-2 pl-4 italic text-slate-700 dark:border-indigo-700 dark:bg-indigo-950/30 dark:text-slate-300">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {entry.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {entry.isShared && (
        <footer className="border-t border-slate-200 px-6 py-3 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            This entry is shared and may appear on other timelines
          </p>
        </footer>
      )}
    </aside>
  )
}
