// =============================================================================
// Data Types
// =============================================================================

export interface Tag {
  id: string
  name: string
  color: 'indigo' | 'cyan' | 'red' | 'slate' | 'amber' | 'emerald' | 'violet' | 'blue' | 'pink' | 'orange'
}

export interface User {
  id: string
  name: string
  avatarUrl: string | null
  /** User's personal tag vocabulary - only present when viewing full user data */
  tags?: Tag[],
  favoriteTimelines?:Timeline[] 
}

export interface UserReference {
  id: string
  name: string
  avatarUrl?: string | null
}

export interface DateRange {
  start: string | null
  end: string | null
}

/**
 * Entry represents an individual event or note.
 * Entries exist independently and can appear on multiple timelines.
 * Tags are NOT stored on entries - they are applied per-timeline context.
 */
export interface Entry {
  id: string
  title: string
  date: string
  /** Markdown-formatted content supporting rich text, images, links, and documents */
  content: string
  contentType: 'text' | 'image' | 'link' | 'document'
  mediaUrl: string | null
  creator: UserReference
  /** Whether this entry is available for other users to include in their timelines */
  isShared: boolean
}

/**
 * TimelineEntry links an Entry to a Timeline with the timeline owner's tags applied.
 * This is the join record that enables the same entry to appear on multiple timelines
 * with different tags in each context.
 */
export interface TimelineEntry {
  entryId: string
  /** Tags applied by the timeline owner - from their personal tag vocabulary */
  tags: Tag[]
}

export interface Timeline {
  id: string
  title: string
  description: string
  owner: UserReference
  entryCount: number
  dateRange: DateRange
  /** Preview of most-used tag names for display on timeline cards */
  topTags: string[]
  thumbnailUrl: string | null
  isPublic: boolean
  isOwned: boolean
  /** Entries on this timeline with the owner's tags applied to each */
  timelineEntries: TimelineEntry[]
}

/**
 * Resolved entry with tags applied for a specific timeline context.
 * Use this when displaying entries within a timeline view.
 */
export interface ResolvedTimelineEntry {
  entry: Entry
  /** Tags applied by the timeline owner */
  tags: Tag[]
}

export type TimelineCategory = 'all' | 'public' | 'favorited' | 'owned'

export type TimelineOrientation = 'horizontal' | 'vertical'

// =============================================================================
// Component Props
// =============================================================================

export interface TimelineProps {
  /** The current user viewing the timelines */
  currentUser: User
  /** All users (for resolving owner/creator references) */
  users: User[]
  /** All entries (canonical data - tags are applied per-timeline context) */
  entries: Entry[]
  /** List of timelines to display in the selection view */
  timelines: Timeline[]

  // Timeline selection callbacks
  /** Called when user selects a timeline to view */
  onSelectTimeline?: (timelineId: string) => void
  /** Called when user favorites/unfavorites a timeline */
  onToggleFavorite?: (timelineId: string) => void
  /** Called when user filters timelines by category */
  onFilterCategory?: (category: TimelineCategory) => void
  /** Called when user searches timelines */
  onSearchTimelines?: (query: string) => void

  // Timeline view callbacks
  /** Called when user changes timeline orientation */
  onChangeOrientation?: (orientation: TimelineOrientation) => void
  /** Called when user changes zoom level */
  onZoom?: (level: number) => void
  /** Called when user filters entries by tags */
  onFilterByTags?: (tagIds: string[]) => void

  // Entry callbacks
  /** Called when user selects an entry to view details */
  onSelectEntry?: (entryId: string) => void
  /** Called when user wants to add a new entry to the timeline */
  onCreateEntry?: () => void
  /** Called when user wants to edit an entry */
  onEditEntry?: (entryId: string) => void
  /** Called when user wants to delete an entry from the timeline */
  onDeleteEntry?: (entryId: string) => void
  /** Called when user wants to update tags for an entry on this timeline */
  onUpdateEntryTags?: (entryId: string, tagIds: string[]) => void
}

// =============================================================================
// Utility Types
// =============================================================================

/**
 * Helper function type for resolving timeline entries with full entry data
 */
export type ResolveTimelineEntries = (
  timeline: Timeline,
  entries: Entry[]
) => ResolvedTimelineEntry[]
