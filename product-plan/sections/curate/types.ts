// =============================================================================
// Data Types
// =============================================================================

export interface Tag {
  id: string
  name: string
  color: string
}

export interface TagWithCount extends Tag {
  count: number
}

export interface DateRange {
  start: string
  end: string
}

/** Source selection for querying - supports various combinations */
export type QuerySources =
  | { type: 'all' }
  | { type: 'owned' }
  | { type: 'public' }
  | { type: 'specific'; timelineIds: string[] }
  | { type: 'mixed'; includeOwned: boolean; publicTimelineIds: string[] }

export interface QueryFilters {
  /** Source selection configuration */
  sources: QuerySources
  /** Tags to filter by (AND logic) */
  tags: string[]
  /** Optional date range filter */
  dateRange: DateRange | null
  /** Optional text search */
  textSearch: string | null
}

export interface SavedQuery {
  id: string
  name: string
  description: string
  createdAt: string
  lastUsedAt: string | null
  filters: QueryFilters
}

export interface AvailableSource {
  id: string
  title: string
  owner: string
  isOwned: boolean
  isPublic: boolean
  entryCount: number
}

export interface QueryResultEntry {
  id: string
  title: string
  date: string
  tags: Tag[]
  sourceTimeline: string
  isSelected: boolean
}

export interface CurrentQuery {
  filters: QueryFilters
  results: QueryResultEntry[]
  selectedCount: number
  totalCount: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface CurateProps {
  /** List of saved queries the user can load */
  savedQueries: SavedQuery[]
  /** Available timelines to query from */
  availableSources: AvailableSource[]
  /** Current query state with filters and results */
  currentQuery: CurrentQuery
  /** All available tags for filtering */
  availableTags: TagWithCount[]

  // Query actions
  /** Called when user updates the source selection */
  onSourcesChange?: (sources: QuerySources) => void
  /** Called when user updates tag filters */
  onTagsChange?: (tags: string[]) => void
  /** Called when user updates date range filter */
  onDateRangeChange?: (dateRange: DateRange | null) => void
  /** Called when user updates text search */
  onTextSearchChange?: (text: string | null) => void
  /** Called when user runs the query */
  onRunQuery?: () => void
  /** Called when user clears all filters */
  onClearFilters?: () => void

  // Selection actions
  /** Called when user toggles selection on a single entry */
  onToggleSelect?: (entryId: string) => void
  /** Called when user selects all visible entries */
  onSelectAll?: () => void
  /** Called when user deselects all entries */
  onSelectNone?: () => void

  // Bulk tag actions
  /** Called when user wants to add tags to selected entries */
  onAddTags?: (entryIds: string[], tagNames: string[]) => void
  /** Called when user wants to remove tags from selected entries */
  onRemoveTags?: (entryIds: string[], tagNames: string[]) => void

  // Save actions
  /** Called when user saves current results as a new timeline */
  onSaveAsTimeline?: (entryIds: string[], timelineName: string) => void
  /** Called when user saves the current query configuration */
  onSaveQuery?: (name: string, description: string) => void
  /** Called when user loads a saved query */
  onLoadQuery?: (queryId: string) => void
  /** Called when user deletes a saved query */
  onDeleteQuery?: (queryId: string) => void
}
