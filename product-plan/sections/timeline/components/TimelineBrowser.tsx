'use client'

import { useState, useMemo } from 'react'
import type { Timeline, User, TimelineCategory } from '../types'
import { TimelineCard } from './TimelineCard'
import { CategoryTabs } from './CategoryTabs'
import { Search, SlidersHorizontal } from 'lucide-react'

interface TimelineBrowserProps {
  /** The current user viewing the timelines */
  currentUser: User
  /** List of all timelines */
  timelines: Timeline[]
  /** Called when user selects a timeline to view */
  onSelectTimeline?: (timelineId: string) => void
  /** Called when user favorites/unfavorites a timeline */
  onToggleFavorite?: (timelineId: string) => void
  /** Called when user filters timelines by category */
  onFilterCategory?: (category: TimelineCategory) => void
  /** Called when user searches timelines */
  onSearchTimelines?: (query: string) => void
}

export function TimelineBrowser({
  currentUser,
  timelines,
  onSelectTimeline,
  onToggleFavorite,
  onFilterCategory,
  onSearchTimelines,
}: TimelineBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<TimelineCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Get favorite timeline IDs from current user
  const favoriteTimelineIds = useMemo(() => {
    return new Set(currentUser.favoriteTimelines?.map(t => t.id) || [])
  }, [currentUser.favoriteTimelines])

  // Calculate counts for each category
  const counts = useMemo(() => {
    return {
      all: timelines.length,
      public: timelines.filter(t => t.isPublic).length,
      favorited: timelines.filter(t => favoriteTimelineIds.has(t.id)).length,
      owned: timelines.filter(t => t.isOwned).length,
    }
  }, [timelines, favoriteTimelineIds])

  // Filter timelines based on category and search
  const filteredTimelines = useMemo(() => {
    let filtered = timelines

    // Filter by category
    switch (activeCategory) {
      case 'public':
        filtered = filtered.filter(t => t.isPublic)
        break
      case 'favorited':
        filtered = filtered.filter(t => favoriteTimelineIds.has(t.id))
        break
      case 'owned':
        filtered = filtered.filter(t => t.isOwned)
        break
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        t =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.topTags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [timelines, activeCategory, searchQuery, favoriteTimelineIds])

  const handleCategoryChange = (category: TimelineCategory) => {
    setActiveCategory(category)
    onFilterCategory?.(category)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearchTimelines?.(query)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="mb-6">
            <h1
              className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Timelines
            </h1>
            <p
              className="mt-1 text-slate-600 dark:text-slate-400"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Browse and explore curated collections of historical events
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Category Tabs */}
            <CategoryTabs
              activeCategory={activeCategory}
              counts={counts}
              onCategoryChange={handleCategoryChange}
            />

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search timelines..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:border-indigo-500 sm:w-72"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Timeline Grid */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {filteredTimelines.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTimelines.map((timeline, index) => (
              <div
                key={timeline.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'backwards' }}
              >
                <TimelineCard
                  timeline={timeline}
                  isFavorited={favoriteTimelineIds.has(timeline.id)}
                  onSelect={() => onSelectTimeline?.(timeline.id)}
                  onToggleFavorite={() => onToggleFavorite?.(timeline.id)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800">
              <SlidersHorizontal className="h-8 w-8 text-slate-400" />
            </div>
            <h3
              className="mt-4 text-lg font-semibold text-slate-900 dark:text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              No timelines found
            </h3>
            <p
              className="mt-1 text-slate-600 dark:text-slate-400"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'No timelines match the current filter'}
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
