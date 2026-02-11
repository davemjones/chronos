// =============================================================================
// Core Types
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
  /** User's personal tag vocabulary */
  tags?: Tag[]
  /** User's favorited timelines */
  favoriteTimelines?: Timeline[]
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

// =============================================================================
// Timeline & Entry Types
// =============================================================================

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

// =============================================================================
// Collaboration Types
// =============================================================================

export type Visibility = 'public' | 'private'

export type PermissionLevel = 'view' | 'clone' | 'both'

export type GrantMethod = 'email' | 'link'

export type LinkStatus = 'active' | 'expired' | 'revoked'

export interface SharedTimeline {
  id: string
  title: string
  description: string
  visibility: Visibility
  entryCount: number
  shareCount: number
  createdAt: string
  updatedAt: string
}

export interface SharePermission {
  id: string
  timelineId: string
  timelineTitle: string
  userId: string
  userName: string
  userEmail: string
  userAvatar: string | null
  permission: PermissionLevel
  grantedAt: string
  grantedVia: GrantMethod
}

export interface InviteLink {
  id: string
  timelineId: string
  timelineTitle: string
  token: string
  permission: PermissionLevel
  status: LinkStatus
  usageCount: number
  usageLimit: number | null
  createdAt: string
  expiresAt: string | null
}

export interface Collaborator {
  id: string
  name: string
  email: string
  avatar: string | null
}

// =============================================================================
// Query Types (for Curate & Discovery)
// =============================================================================

/** Source selection for querying */
export type QuerySources =
  | { type: 'all' }
  | { type: 'owned' }
  | { type: 'public' }
  | { type: 'specific'; timelineIds: string[] }
  | { type: 'mixed'; includeOwned: boolean; publicTimelineIds: string[] }

export interface QueryFilters {
  sources: QuerySources
  tags: string[]
  dateRange: DateRange | null
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

// =============================================================================
// Discovery Types
// =============================================================================

export interface Citation {
  id: string
  index: number
  entryId: string
  entryTitle: string
  entryDate: string
  snippet: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  citations?: Citation[]
}

export interface SavedSession {
  id: string
  title: string
  createdAt: string
  lastMessageAt: string
  messageCount: number
  preview: string
}

// =============================================================================
// Discovery Types
// =============================================================================

export interface CurrentSession {
  id: string
  isSaved: boolean
  sources: QuerySources
  messages: ChatMessage[]
}

// =============================================================================
// Timeline UI Types
// =============================================================================

export type TimelineCategory = 'all' | 'public' | 'favorited' | 'owned'

export type TimelineOrientation = 'horizontal' | 'vertical'

// =============================================================================
// Curate Types
// =============================================================================

export interface TagWithCount extends Tag {
  count: number
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
