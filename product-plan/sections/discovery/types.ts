// =============================================================================
// Data Types
// =============================================================================

/** Source selection for querying - supports various combinations */
export type QuerySources =
  | { type: 'all' }
  | { type: 'owned' }
  | { type: 'public' }
  | { type: 'specific'; timelineIds: string[] }

export interface AvailableSource {
  id: string
  title: string
  owner: string
  isOwned: boolean
  isPublic: boolean
  entryCount: number
}

export interface Citation {
  id: string
  /** The display index in the response (e.g., [1], [2]) */
  index: number
  entryId: string
  entryTitle: string
  entryDate: string
  /** A snippet of text from the entry that was relevant */
  snippet: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  /** Citations are only present on assistant messages */
  citations?: Citation[]
}

export interface SavedSession {
  id: string
  title: string
  createdAt: string
  lastMessageAt: string
  messageCount: number
  /** Preview text (usually the first user message) */
  preview: string
}

export interface CurrentSession {
  id: string
  isSaved: boolean
  sources: QuerySources
  messages: ChatMessage[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface DiscoveryProps {
  /** List of saved chat sessions */
  savedSessions: SavedSession[]
  /** The current active conversation */
  currentSession: CurrentSession
  /** Available timelines to query from */
  availableSources: AvailableSource[]

  // Message actions
  /** Called when user submits a new prompt */
  onSendMessage?: (content: string) => void
  /** Called when user wants to regenerate the last AI response */
  onRegenerate?: (messageId: string) => void
  /** Called when user copies a response to clipboard */
  onCopyResponse?: (messageId: string) => void
  /** Called when user wants to save entries mentioned in a response */
  onSaveEntries?: (messageId: string, entryIds: string[]) => void
  /** Called when user clicks a citation to view the entry */
  onViewEntry?: (entryId: string) => void

  // Source actions
  /** Called when user changes the source selection */
  onSourcesChange?: (sources: QuerySources) => void

  // Session actions
  /** Called when user saves the current session */
  onSaveSession?: () => void
  /** Called when user loads a saved session */
  onLoadSession?: (sessionId: string) => void
  /** Called when user deletes a saved session */
  onDeleteSession?: (sessionId: string) => void
  /** Called when user starts a new conversation */
  onNewSession?: () => void
}
