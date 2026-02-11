'use client'

import { useState } from 'react'
import {
  Search,
  Calendar,
  Tag,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Plus,
  Minus,
  Save,
  Clock,
  Database,
  Globe,
  User,
  Layers,
  Play,
  RotateCcw,
  Bookmark,
  Trash2,
  MoreHorizontal,
} from 'lucide-react'
import type {
  SavedQuery,
  AvailableSource,
  QueryResultEntry,
  TagWithCount,
  QuerySources,
  QueryFilters,
  CurrentQuery,
} from '@/types'

// CurateProps defined locally since it's component-specific
interface CurateProps {
  savedQueries: SavedQuery[]
  availableSources: AvailableSource[]
  currentQuery: CurrentQuery
  availableTags: TagWithCount[]
  onSourcesChange?: (sources: QuerySources) => void
  onTagsChange?: (tags: string[]) => void
  onDateRangeChange?: (dateRange: { start: string; end: string } | null) => void
  onTextSearchChange?: (text: string | null) => void
  onRunQuery?: () => void
  onClearFilters?: () => void
  onToggleSelect?: (entryId: string) => void
  onSelectAll?: () => void
  onSelectNone?: () => void
  onAddTags?: (entryIds: string[], tagNames: string[]) => void
  onRemoveTags?: (entryIds: string[], tagNames: string[]) => void
  onSaveAsTimeline?: (entryIds: string[], timelineName: string) => void
  onSaveQuery?: (name: string, description: string) => void
  onLoadQuery?: (queryId: string) => void
  onDeleteQuery?: (queryId: string) => void
}

// =============================================================================
// Sub-components
// =============================================================================

interface SourceSelectorProps {
  sources: QuerySources
  availableSources: AvailableSource[]
  onSourcesChange?: (sources: QuerySources) => void
}

function SourceSelector({ sources, availableSources, onSourcesChange }: SourceSelectorProps) {
  const [expanded, setExpanded] = useState(true)
  const [showTimelines, setShowTimelines] = useState(false)

  const ownedSources = availableSources.filter(s => s.isOwned)
  const publicSources = availableSources.filter(s => !s.isOwned && s.isPublic)

  const getSourceLabel = () => {
    switch (sources.type) {
      case 'all': return 'All Sources'
      case 'owned': return 'My Timelines'
      case 'public': return 'Public Only'
      case 'specific': return `${sources.timelineIds.length} Selected`
      case 'mixed': return 'Custom Mix'
    }
  }

  const isSourceSelected = (id: string) => {
    if (sources.type === 'all') return true
    if (sources.type === 'owned') return availableSources.find(s => s.id === id)?.isOwned
    if (sources.type === 'public') return availableSources.find(s => s.id === id)?.isPublic && !availableSources.find(s => s.id === id)?.isOwned
    if (sources.type === 'specific') return sources.timelineIds.includes(id)
    if (sources.type === 'mixed') {
      const source = availableSources.find(s => s.id === id)
      if (source?.isOwned && sources.includeOwned) return true
      return sources.publicTimelineIds.includes(id)
    }
    return false
  }

  return (
    <div className="border-b border-slate-200 dark:border-slate-700/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Sources
          </span>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-1">
          {/* Quick select buttons */}
          <div className="grid grid-cols-2 gap-1 mb-2">
            {[
              { type: 'all' as const, label: 'All', icon: Layers },
              { type: 'owned' as const, label: 'Mine', icon: User },
              { type: 'public' as const, label: 'Public', icon: Globe },
            ].map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => onSourcesChange?.({ type })}
                className={`px-3 py-2 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                  sources.type === type
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
            <button
              onClick={() => setShowTimelines(!showTimelines)}
              className={`px-3 py-2 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                sources.type === 'specific' || sources.type === 'mixed'
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              Pick
            </button>
          </div>

          {/* Timeline list for specific selection */}
          {showTimelines && (
            <div className="mt-2 space-y-2 animate-in slide-in-from-top-2 duration-200">
              {ownedSources.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 mb-1">
                    My Timelines
                  </div>
                  {ownedSources.map(source => (
                    <label
                      key={source.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isSourceSelected(source.id)}
                        onChange={() => {
                          // Toggle specific timeline
                          const currentIds = sources.type === 'specific' ? sources.timelineIds : []
                          const newIds = currentIds.includes(source.id)
                            ? currentIds.filter(id => id !== source.id)
                            : [...currentIds, source.id]
                          onSourcesChange?.({ type: 'specific', timelineIds: newIds })
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 truncate">
                        {source.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        {source.entryCount}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {publicSources.length > 0 && (
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1 mb-1">
                    Public Timelines
                  </div>
                  {publicSources.map(source => (
                    <label
                      key={source.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isSourceSelected(source.id)}
                        onChange={() => {
                          const currentIds = sources.type === 'specific' ? sources.timelineIds : []
                          const newIds = currentIds.includes(source.id)
                            ? currentIds.filter(id => id !== source.id)
                            : [...currentIds, source.id]
                          onSourcesChange?.({ type: 'specific', timelineIds: newIds })
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 truncate">
                        {source.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                        {source.entryCount}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Current selection summary */}
          <div className="mt-2 px-2 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">{getSourceLabel()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

interface SavedQueriesListProps {
  savedQueries: SavedQuery[]
  onLoadQuery?: (queryId: string) => void
  onDeleteQuery?: (queryId: string) => void
}

function SavedQueriesList({ savedQueries, onLoadQuery, onDeleteQuery }: SavedQueriesListProps) {
  const [expanded, setExpanded] = useState(true)

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="border-b border-slate-200 dark:border-slate-700/50">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Saved Queries
          </span>
          <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded">
            {savedQueries.length}
          </span>
        </div>
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-1">
          {savedQueries.length === 0 ? (
            <div className="text-xs text-slate-400 dark:text-slate-500 px-2 py-4 text-center">
              No saved queries yet
            </div>
          ) : (
            savedQueries.map(query => (
              <div
                key={query.id}
                className="group px-2 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => onLoadQuery?.(query.id)}
                    className="flex-1 text-left"
                  >
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {query.name}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {query.description}
                    </div>
                  </button>
                  <button
                    onClick={() => onDeleteQuery?.(query.id)}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                    {formatDate(query.lastUsedAt)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

interface FilterBarProps {
  filters: QueryFilters
  availableTags: TagWithCount[]
  onTagsChange?: (tags: string[]) => void
  onDateRangeChange?: (dateRange: { start: string; end: string } | null) => void
  onTextSearchChange?: (text: string | null) => void
  onRunQuery?: () => void
  onClearFilters?: () => void
  onSaveQuery?: (name: string, description: string) => void
}

function FilterBar({
  filters,
  availableTags,
  onTagsChange,
  onTextSearchChange,
  onRunQuery,
  onClearFilters,
  onSaveQuery,
}: FilterBarProps) {
  const [showTagPicker, setShowTagPicker] = useState(false)
  const [searchValue, setSearchValue] = useState(filters.textSearch || '')

  const selectedTags = filters.tags
  const hasFilters = filters.tags.length > 0 || filters.dateRange || filters.textSearch

  const getTagColor = (color: string) => {
    const colors: Record<string, string> = {
      cyan: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 ring-cyan-200 dark:ring-cyan-800',
      amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ring-amber-200 dark:ring-amber-800',
      emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-800',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-indigo-200 dark:ring-indigo-800',
      pink: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 ring-pink-200 dark:ring-pink-800',
      slate: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 ring-slate-300 dark:ring-slate-600',
      violet: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 ring-violet-200 dark:ring-violet-800',
      blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-blue-200 dark:ring-blue-800',
      red: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 ring-red-200 dark:ring-red-800',
    }
    return colors[color] || colors.slate
  }

  return (
    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 px-4 py-3">
      <div className="flex items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search entries..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onTextSearchChange?.(searchValue || null)
              }
            }}
            onBlur={() => onTextSearchChange?.(searchValue || null)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Tag filter */}
        <div className="relative">
          <button
            onClick={() => setShowTagPicker(!showTagPicker)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedTags.length > 0
                ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Tag className="w-4 h-4" />
            Tags
            {selectedTags.length > 0 && (
              <span className="bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {selectedTags.length}
              </span>
            )}
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {showTagPicker && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowTagPicker(false)}
              />
              <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Filter by tags
                  </div>
                </div>
                <div className="p-2 max-h-64 overflow-y-auto">
                  {availableTags.map(tag => (
                    <label
                      key={tag.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.name)}
                        onChange={() => {
                          const newTags = selectedTags.includes(tag.name)
                            ? selectedTags.filter(t => t !== tag.name)
                            : [...selectedTags, tag.name]
                          onTagsChange?.(newTags)
                        }}
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      <span className={`text-xs px-2 py-0.5 rounded ring-1 ${getTagColor(tag.color)}`}>
                        {tag.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 ml-auto">
                        {tag.count}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Date range - simplified for now */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
          <Calendar className="w-4 h-4" />
          Dates
        </button>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700" />

        {/* Action buttons */}
        <button
          onClick={onRunQuery}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
        >
          <Play className="w-4 h-4" />
          Run Query
        </button>

        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        )}

        <button
          onClick={() => onSaveQuery?.('New Query', 'Saved query')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>

      {/* Active filters display */}
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 dark:text-slate-400">Active:</span>
          <div className="flex flex-wrap gap-1.5">
            {selectedTags.map(tagName => {
              const tag = availableTags.find(t => t.name === tagName)
              return (
                <span
                  key={tagName}
                  className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded ring-1 ${getTagColor(tag?.color || 'slate')}`}
                >
                  {tagName}
                  <button
                    onClick={() => onTagsChange?.(selectedTags.filter(t => t !== tagName))}
                    className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

interface ResultsTableProps {
  results: QueryResultEntry[]
  selectedCount: number
  totalCount: number
  onToggleSelect?: (entryId: string) => void
  onSelectAll?: () => void
  onSelectNone?: () => void
}

function ResultsTable({
  results,
  selectedCount,
  totalCount,
  onToggleSelect,
  onSelectAll,
  onSelectNone,
}: ResultsTableProps) {
  const getTagColor = (color: string) => {
    const colors: Record<string, string> = {
      cyan: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
      amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
      emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
      pink: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
      slate: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
      violet: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
      blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      red: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    }
    return colors[color] || colors.slate
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const allSelected = results.length > 0 && results.every(r => r.isSelected)
  const someSelected = results.some(r => r.isSelected) && !allSelected

  return (
    <div className="flex-1 overflow-auto">
      {/* Table header */}
      <div className="sticky top-0 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 z-10">
        <div className="grid grid-cols-[40px_1fr_120px_1fr_180px] gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => {
                if (el) el.indeterminate = someSelected
              }}
              onChange={() => {
                if (allSelected || someSelected) {
                  onSelectNone?.()
                } else {
                  onSelectAll?.()
                }
              }}
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
            />
          </div>
          <div>Title</div>
          <div>Date</div>
          <div>Tags</div>
          <div>Source</div>
        </div>
      </div>

      {/* Table body */}
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {results.length === 0 ? (
          <div className="px-4 py-16 text-center">
            <Database className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">No results found</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
              Try adjusting your filters or sources
            </p>
          </div>
        ) : (
          results.map((entry, index) => (
            <div
              key={entry.id}
              className={`grid grid-cols-[40px_1fr_120px_1fr_180px] gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                entry.isSelected ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
              }`}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={entry.isSelected}
                  onChange={() => onToggleSelect?.(entry.id)}
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                />
              </div>
              <div className="flex items-center min-w-0">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                  {entry.title}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {formatDate(entry.date)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
                {entry.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag.id}
                    className={`text-[11px] px-1.5 py-0.5 rounded truncate ${getTagColor(tag.color)}`}
                  >
                    {tag.name}
                  </span>
                ))}
                {entry.tags.length > 3 && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    +{entry.tags.length - 3}
                  </span>
                )}
              </div>
              <div className="flex items-center min-w-0">
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {entry.sourceTimeline}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results summary */}
      <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-800/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{totalCount}</span> results
          </span>
          {selectedCount > 0 && (
            <span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{selectedCount}</span> selected
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

interface BulkActionsToolbarProps {
  selectedCount: number
  selectedIds: string[]
  availableTags: TagWithCount[]
  onAddTags?: (entryIds: string[], tagNames: string[]) => void
  onRemoveTags?: (entryIds: string[], tagNames: string[]) => void
  onSaveAsTimeline?: (entryIds: string[], timelineName: string) => void
  onSelectNone?: () => void
}

function BulkActionsToolbar({
  selectedCount,
  selectedIds,
  availableTags,
  onAddTags,
  onRemoveTags,
  onSaveAsTimeline,
  onSelectNone,
}: BulkActionsToolbarProps) {
  const [showAddTags, setShowAddTags] = useState(false)
  const [showRemoveTags, setShowRemoveTags] = useState(false)

  if (selectedCount === 0) return null

  const getTagColor = (color: string) => {
    const colors: Record<string, string> = {
      cyan: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
      amber: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
      emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
      indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
      pink: 'bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
      slate: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
      violet: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
      blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      red: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    }
    return colors[color] || colors.slate
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2 bg-slate-900 dark:bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700">
        <span className="text-sm font-medium mr-2">
          <span className="text-indigo-400">{selectedCount}</span> selected
        </span>

        <div className="w-px h-5 bg-slate-700" />

        {/* Add tags button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowAddTags(!showAddTags)
              setShowRemoveTags(false)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Tags
          </button>

          {showAddTags && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowAddTags(false)} />
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="p-2 max-h-48 overflow-y-auto">
                  {availableTags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        onAddTags?.(selectedIds, [tag.name])
                        setShowAddTags(false)
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-left"
                    >
                      <span className={`text-xs px-2 py-0.5 rounded ${getTagColor(tag.color)}`}>
                        {tag.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Remove tags button */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRemoveTags(!showRemoveTags)
              setShowAddTags(false)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <Minus className="w-4 h-4" />
            Remove Tags
          </button>

          {showRemoveTags && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowRemoveTags(false)} />
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="p-2 max-h-48 overflow-y-auto">
                  {availableTags.map(tag => (
                    <button
                      key={tag.id}
                      onClick={() => {
                        onRemoveTags?.(selectedIds, [tag.name])
                        setShowRemoveTags(false)
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-left"
                    >
                      <span className={`text-xs px-2 py-0.5 rounded ${getTagColor(tag.color)}`}>
                        {tag.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="w-px h-5 bg-slate-700" />

        {/* Save as timeline */}
        <button
          onClick={() => onSaveAsTimeline?.(selectedIds, 'New Timeline')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save as Timeline
        </button>

        <div className="w-px h-5 bg-slate-700" />

        {/* Clear selection */}
        <button
          onClick={onSelectNone}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function CurateBrowser({
  savedQueries,
  availableSources,
  currentQuery,
  availableTags,
  onSourcesChange,
  onTagsChange,
  onDateRangeChange,
  onTextSearchChange,
  onRunQuery,
  onClearFilters,
  onToggleSelect,
  onSelectAll,
  onSelectNone,
  onAddTags,
  onRemoveTags,
  onSaveAsTimeline,
  onSaveQuery,
  onLoadQuery,
  onDeleteQuery,
}: CurateProps) {
  const selectedIds = currentQuery.results
    .filter(r => r.isSelected)
    .map(r => r.id)

  return (
    <div className="h-full flex bg-white dark:bg-slate-900">
      {/* Left sidebar */}
      <aside className="w-72 border-r border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Curate
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Query and refine your data
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SourceSelector
            sources={currentQuery.filters.sources}
            availableSources={availableSources}
            onSourcesChange={onSourcesChange}
          />

          <SavedQueriesList
            savedQueries={savedQueries}
            onLoadQuery={onLoadQuery}
            onDeleteQuery={onDeleteQuery}
          />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        <FilterBar
          filters={currentQuery.filters}
          availableTags={availableTags}
          onTagsChange={onTagsChange}
          onDateRangeChange={onDateRangeChange}
          onTextSearchChange={onTextSearchChange}
          onRunQuery={onRunQuery}
          onClearFilters={onClearFilters}
          onSaveQuery={onSaveQuery}
        />

        <ResultsTable
          results={currentQuery.results}
          selectedCount={currentQuery.selectedCount}
          totalCount={currentQuery.totalCount}
          onToggleSelect={onToggleSelect}
          onSelectAll={onSelectAll}
          onSelectNone={onSelectNone}
        />
      </main>

      {/* Bulk actions toolbar */}
      <BulkActionsToolbar
        selectedCount={currentQuery.selectedCount}
        selectedIds={selectedIds}
        availableTags={availableTags}
        onAddTags={onAddTags}
        onRemoveTags={onRemoveTags}
        onSaveAsTimeline={onSaveAsTimeline}
        onSelectNone={onSelectNone}
      />
    </div>
  )
}
