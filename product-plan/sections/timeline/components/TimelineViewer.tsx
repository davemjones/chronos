'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import type {
  Timeline,
  Entry,
  Tag,
  TimelineEntry,
  ResolvedTimelineEntry,
} from '../types'
import { TimelineCanvas } from './TimelineCanvas'
import { TimeRangeSelector } from './TimeRangeSelector'
import { EntryDetailPanel } from './EntryDetailPanel'
import { EntryTooltip } from './EntryTooltip'
import { TagFilter } from './TagFilter'
import { ArrowLeft, Plus, Shuffle } from 'lucide-react'

interface TimelineViewerProps {
  /** The timeline being viewed */
  timeline: Timeline
  /** All entries (canonical data) */
  entries: Entry[]
  /** Whether the current user owns this timeline */
  isOwned?: boolean
  /** Called when user wants to go back to browser */
  onBack?: () => void
  /** Called when user filters entries by tags */
  onFilterByTags?: (tagIds: string[]) => void
  /** Called when user selects an entry to view details */
  onSelectEntry?: (entryId: string) => void
  /** Called when user wants to add a new entry */
  onCreateEntry?: () => void
  /** Called when user wants to edit an entry */
  onEditEntry?: (entryId: string) => void
  /** Called when user wants to delete an entry from the timeline */
  onDeleteEntry?: (entryId: string) => void
  /** Called when user wants to update tags for an entry on this timeline */
  onUpdateEntryTags?: (entryId: string, tagIds: string[]) => void
}

export function TimelineViewer({
  timeline,
  entries,
  isOwned = false,
  onBack,
  onFilterByTags,
  onSelectEntry,
  onCreateEntry,
  onEditEntry,
  onDeleteEntry,
  onUpdateEntryTags,
}: TimelineViewerProps) {
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [hoveredEntryId, setHoveredEntryId] = useState<string | null>(null)
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Resolve timeline entries with full entry data
  const resolvedEntries = useMemo<ResolvedTimelineEntry[]>(() => {
    return timeline.timelineEntries
      .map((te: TimelineEntry) => {
        const entry = entries.find((e) => e.id === te.entryId)
        if (!entry) return null
        return { entry, tags: te.tags }
      })
      .filter((e): e is ResolvedTimelineEntry => e !== null)
      .sort((a, b) => new Date(a.entry.date).getTime() - new Date(b.entry.date).getTime())
  }, [timeline.timelineEntries, entries])

  // Calculate full time range from entries
  const fullTimeRange = useMemo(() => {
    if (resolvedEntries.length === 0) {
      const now = Date.now()
      return { start: now - 365 * 24 * 60 * 60 * 1000, end: now }
    }
    const dates = resolvedEntries.map((re) => new Date(re.entry.date).getTime())
    const min = Math.min(...dates)
    const max = Math.max(...dates)
    // Add 5% padding on each side
    const range = max - min || 365 * 24 * 60 * 60 * 1000 // Default to 1 year if single entry
    return {
      start: min - range * 0.05,
      end: max + range * 0.05,
    }
  }, [resolvedEntries])

  const [selectedTimeRange, setSelectedTimeRange] = useState(fullTimeRange)

  // Update selected range when full range changes
  useEffect(() => {
    setSelectedTimeRange(fullTimeRange)
  }, [fullTimeRange])

  // Get all unique tags from the timeline
  const availableTags = useMemo<Tag[]>(() => {
    const tagMap = new Map<string, Tag>()
    resolvedEntries.forEach((re) => {
      re.tags.forEach((tag) => {
        if (!tagMap.has(tag.id)) {
          tagMap.set(tag.id, tag)
        }
      })
    })
    return Array.from(tagMap.values())
  }, [resolvedEntries])

  // Get hovered entry for tooltip
  const hoveredEntry = useMemo(() => {
    if (!hoveredEntryId) return null
    return resolvedEntries.find((re) => re.entry.id === hoveredEntryId) || null
  }, [hoveredEntryId, resolvedEntries])

  // Get selected entry for panel
  const selectedEntry = useMemo(() => {
    if (!selectedEntryId) return null
    return resolvedEntries.find((re) => re.entry.id === selectedEntryId) || null
  }, [selectedEntryId, resolvedEntries])

  const handleTagToggle = (tagId: string) => {
    const newSelected = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId]
    setSelectedTagIds(newSelected)
    onFilterByTags?.(newSelected)
  }

  const handleClearTags = () => {
    setSelectedTagIds([])
    onFilterByTags?.([])
  }

  const handleSelectEntry = (entryId: string) => {
    setSelectedEntryId(entryId)
    onSelectEntry?.(entryId)
  }

  const handleClosePanel = () => {
    setSelectedEntryId(null)
  }

  const handleRandomEntry = () => {
    if (resolvedEntries.length === 0) return
    const randomIndex = Math.floor(Math.random() * resolvedEntries.length)
    const randomEntry = resolvedEntries[randomIndex]
    handleSelectEntry(randomEntry.entry.id)
  }

  // Track mouse position for tooltip
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY })
  }

  const formatDateRange = (start: string | null, end: string | null) => {
    if (!start || !end) return 'No entries'
    const startYear = new Date(start).getFullYear()
    const endYear = new Date(end).getFullYear()
    if (startYear === endYear) return `${startYear}`
    return `${startYear} — ${endYear}`
  }

  return (
    <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-slate-950 lg:flex-row">
      {/* Main Timeline Area */}
      <div
        ref={containerRef}
        className="flex flex-1 flex-col overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        {/* Header */}
        <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm px-4 py-4 dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: Back button and title */}
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1
                  className="text-xl font-bold text-slate-900 dark:text-white"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {timeline.title}
                </h1>
                <p
                  className="text-sm text-slate-500 dark:text-slate-400"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {timeline.entryCount} events • {formatDateRange(timeline.dateRange.start, timeline.dateRange.end)}
                </p>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3">
              {/* Feeling Lucky button */}
              <button
                onClick={handleRandomEntry}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <Shuffle className="h-4 w-4" />
                Random
              </button>

              {/* Add entry button (if owned) */}
              {isOwned && (
                <button
                  onClick={onCreateEntry}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  <Plus className="h-4 w-4" />
                  Add Entry
                </button>
              )}
            </div>
          </div>

          {/* Tag filter */}
          {availableTags.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <TagFilter
                availableTags={availableTags}
                selectedTagIds={selectedTagIds}
                onTagToggle={handleTagToggle}
                onClearAll={handleClearTags}
              />
            </div>
          )}
        </header>

        {/* Canvas Area */}
        <main className="relative flex-1 overflow-hidden">
          {resolvedEntries.length > 0 ? (
            <TimelineCanvas
              entries={resolvedEntries}
              timeRange={selectedTimeRange}
              selectedTagIds={selectedTagIds}
              hoveredEntryId={hoveredEntryId}
              selectedEntryId={selectedEntryId}
              onHoverEntry={setHoveredEntryId}
              onSelectEntry={handleSelectEntry}
            />
          ) : (
            /* Empty state */
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                <div className="h-8 w-8 rounded-full bg-slate-300 dark:bg-slate-600" />
              </div>
              <h3
                className="mt-4 text-lg font-semibold text-slate-900 dark:text-white"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                No events yet
              </h3>
              <p
                className="mt-1 text-slate-600 dark:text-slate-400"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {isOwned ? 'Add your first event to get started' : 'This timeline has no events'}
              </p>
              {isOwned && (
                <button
                  onClick={onCreateEntry}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  <Plus className="h-4 w-4" />
                  Add Entry
                </button>
              )}
            </div>
          )}

          {/* Hover Tooltip */}
          {hoveredEntry && mousePosition && (
            <div
              className="pointer-events-none fixed z-50"
              style={{
                left: mousePosition.x + 16,
                top: mousePosition.y - 16,
                transform: 'translateY(-100%)',
              }}
            >
              <EntryTooltip entry={hoveredEntry.entry} tags={hoveredEntry.tags} />
            </div>
          )}
        </main>

        {/* Time Range Selector */}
        {resolvedEntries.length > 0 && (
          <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm px-6 py-4 dark:border-slate-800 dark:bg-slate-900/80">
            <TimeRangeSelector
              fullRange={fullTimeRange}
              selectedRange={selectedTimeRange}
              onRangeChange={setSelectedTimeRange}
            />
          </footer>
        )}
      </div>

      {/* Detail Panel */}
      {selectedEntry && (
        <div className="border-t border-slate-200 dark:border-slate-800 lg:border-t-0">
          <EntryDetailPanel
            entry={selectedEntry.entry}
            tags={selectedEntry.tags}
            isOwned={isOwned}
            onClose={handleClosePanel}
            onEdit={() => onEditEntry?.(selectedEntry.entry.id)}
            onDelete={() => onDeleteEntry?.(selectedEntry.entry.id)}
            onUpdateTags={(tagIds) => onUpdateEntryTags?.(selectedEntry.entry.id, tagIds)}
          />
        </div>
      )}
    </div>
  )
}
