'use client'

import { useState, useCallback, useMemo } from 'react'
import { CurateBrowser } from '@/components/curate'
import {
  curateSavedQueries,
  curateAvailableSources,
  curateAvailableTags,
} from '@/data/curate-sample-data'
import { sampleTimelines, sampleEntries } from '@/data/sample-data'
import type {
  QuerySources,
  QueryFilters,
  QueryResultEntry,
  CurrentQuery,
  SavedQuery,
  Tag,
} from '@/types'

function executeQuery(filters: QueryFilters): QueryResultEntry[] {
  // Determine which timeline IDs to include
  const sourceTimelineIds: string[] = []
  switch (filters.sources.type) {
    case 'all':
      sourceTimelineIds.push(...sampleTimelines.map((t) => t.id))
      break
    case 'owned':
      sourceTimelineIds.push(...sampleTimelines.filter((t) => t.isOwned).map((t) => t.id))
      break
    case 'public':
      sourceTimelineIds.push(...sampleTimelines.filter((t) => t.isPublic && !t.isOwned).map((t) => t.id))
      break
    case 'specific':
      sourceTimelineIds.push(...filters.sources.timelineIds)
      break
    case 'mixed':
      if (filters.sources.includeOwned) {
        sourceTimelineIds.push(...sampleTimelines.filter((t) => t.isOwned).map((t) => t.id))
      }
      sourceTimelineIds.push(...filters.sources.publicTimelineIds)
      break
  }

  // Collect entries from matching timelines with their tags
  const results: QueryResultEntry[] = []
  const seenEntryIds = new Set<string>()

  for (const timeline of sampleTimelines) {
    if (!sourceTimelineIds.includes(timeline.id)) continue

    for (const te of timeline.timelineEntries) {
      if (seenEntryIds.has(te.entryId)) continue
      const entry = sampleEntries.find((e) => e.id === te.entryId)
      if (!entry) continue

      // Tag filter (AND logic)
      if (filters.tags.length > 0) {
        const entryTagNames = te.tags.map((t) => t.name)
        if (!filters.tags.every((ft) => entryTagNames.includes(ft))) continue
      }

      // Date range filter
      if (filters.dateRange) {
        const entryDate = new Date(entry.date)
        if (filters.dateRange.start && entryDate < new Date(filters.dateRange.start)) continue
        if (filters.dateRange.end && entryDate > new Date(filters.dateRange.end)) continue
      }

      // Text search
      if (filters.textSearch) {
        const query = filters.textSearch.toLowerCase()
        if (
          !entry.title.toLowerCase().includes(query) &&
          !entry.content.toLowerCase().includes(query)
        )
          continue
      }

      seenEntryIds.add(te.entryId)
      results.push({
        id: entry.id,
        title: entry.title,
        date: entry.date,
        tags: te.tags,
        sourceTimeline: timeline.title,
        isSelected: false,
      })
    }
  }

  return results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

const defaultFilters: QueryFilters = {
  sources: { type: 'all' },
  tags: [],
  dateRange: null,
  textSearch: null,
}

export default function CuratePage() {
  const [savedQueries, setSavedQueries] = useState<SavedQuery[]>(curateSavedQueries)
  const [filters, setFilters] = useState<QueryFilters>(defaultFilters)
  const [results, setResults] = useState<QueryResultEntry[]>(() => executeQuery(defaultFilters))

  const currentQuery: CurrentQuery = useMemo(
    () => ({
      filters,
      results,
      selectedCount: results.filter((r) => r.isSelected).length,
      totalCount: results.length,
    }),
    [filters, results]
  )

  const runQuery = useCallback(
    (f?: QueryFilters) => {
      const newResults = executeQuery(f ?? filters)
      setResults(newResults)
    },
    [filters]
  )

  const handleSourcesChange = useCallback(
    (sources: QuerySources) => {
      const newFilters = { ...filters, sources }
      setFilters(newFilters)
      runQuery(newFilters)
    },
    [filters, runQuery]
  )

  const handleTagsChange = useCallback(
    (tags: string[]) => {
      const newFilters = { ...filters, tags }
      setFilters(newFilters)
      runQuery(newFilters)
    },
    [filters, runQuery]
  )

  const handleDateRangeChange = useCallback(
    (dateRange: { start: string; end: string } | null) => {
      const newFilters = { ...filters, dateRange }
      setFilters(newFilters)
      runQuery(newFilters)
    },
    [filters, runQuery]
  )

  const handleTextSearchChange = useCallback(
    (textSearch: string | null) => {
      const newFilters = { ...filters, textSearch }
      setFilters(newFilters)
      runQuery(newFilters)
    },
    [filters, runQuery]
  )

  const handleClearFilters = useCallback(() => {
    setFilters(defaultFilters)
    runQuery(defaultFilters)
  }, [runQuery])

  const handleToggleSelect = useCallback((entryId: string) => {
    setResults((prev) =>
      prev.map((r) => (r.id === entryId ? { ...r, isSelected: !r.isSelected } : r))
    )
  }, [])

  const handleSelectAll = useCallback(() => {
    setResults((prev) => prev.map((r) => ({ ...r, isSelected: true })))
  }, [])

  const handleSelectNone = useCallback(() => {
    setResults((prev) => prev.map((r) => ({ ...r, isSelected: false })))
  }, [])

  const handleAddTags = useCallback((entryIds: string[], tagNames: string[]) => {
    console.log('Add tags', tagNames, 'to entries', entryIds)
  }, [])

  const handleRemoveTags = useCallback((entryIds: string[], tagNames: string[]) => {
    console.log('Remove tags', tagNames, 'from entries', entryIds)
  }, [])

  const handleSaveAsTimeline = useCallback((entryIds: string[], timelineName: string) => {
    console.log('Save as timeline:', timelineName, 'with entries:', entryIds)
  }, [])

  const handleSaveQuery = useCallback(
    (name: string, description: string) => {
      const newQuery: SavedQuery = {
        id: `query-${Date.now()}`,
        name,
        description,
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
        filters,
      }
      setSavedQueries((prev) => [newQuery, ...prev])
    },
    [filters]
  )

  const handleLoadQuery = useCallback(
    (queryId: string) => {
      const query = savedQueries.find((q) => q.id === queryId)
      if (!query) return
      setFilters(query.filters)
      runQuery(query.filters)
      setSavedQueries((prev) =>
        prev.map((q) =>
          q.id === queryId ? { ...q, lastUsedAt: new Date().toISOString() } : q
        )
      )
    },
    [savedQueries, runQuery]
  )

  const handleDeleteQuery = useCallback((queryId: string) => {
    setSavedQueries((prev) => prev.filter((q) => q.id !== queryId))
  }, [])

  return (
    <CurateBrowser
      savedQueries={savedQueries}
      availableSources={curateAvailableSources}
      currentQuery={currentQuery}
      availableTags={curateAvailableTags}
      onSourcesChange={handleSourcesChange}
      onTagsChange={handleTagsChange}
      onDateRangeChange={handleDateRangeChange}
      onTextSearchChange={handleTextSearchChange}
      onRunQuery={() => runQuery()}
      onClearFilters={handleClearFilters}
      onToggleSelect={handleToggleSelect}
      onSelectAll={handleSelectAll}
      onSelectNone={handleSelectNone}
      onAddTags={handleAddTags}
      onRemoveTags={handleRemoveTags}
      onSaveAsTimeline={handleSaveAsTimeline}
      onSaveQuery={handleSaveQuery}
      onLoadQuery={handleLoadQuery}
      onDeleteQuery={handleDeleteQuery}
    />
  )
}
