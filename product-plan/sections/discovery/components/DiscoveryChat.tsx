import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Copy,
  RotateCcw,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Plus,
  Trash2,
  Sparkles,
  Clock,
  Database,
  Globe,
  User,
  Layers,
  Check,
  PanelLeftClose,
  PanelLeft,
  ExternalLink,
} from 'lucide-react'
import type {
  DiscoveryProps,
  ChatMessage,
  Citation,
  SavedSession,
  AvailableSource,
  QuerySources,
} from '../types'

// =============================================================================
// Sub-components
// =============================================================================

interface SessionsSidebarProps {
  savedSessions: SavedSession[]
  currentSessionId: string
  isCollapsed: boolean
  onToggleCollapse: () => void
  onLoadSession?: (sessionId: string) => void
  onDeleteSession?: (sessionId: string) => void
  onNewSession?: () => void
}

function SessionsSidebar({
  savedSessions,
  currentSessionId,
  isCollapsed,
  onToggleCollapse,
  onLoadSession,
  onDeleteSession,
  onNewSession,
}: SessionsSidebarProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (isCollapsed) {
    return (
      <div className="w-12 border-r border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center py-3 gap-2">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors"
          title="Expand sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
        <div className="w-8 h-px bg-slate-200 dark:bg-slate-700" />
        <button
          onClick={onNewSession}
          className="p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 transition-colors"
          title="New chat"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <aside className="w-72 border-r border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col shrink-0">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">Discovery</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors"
        >
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>

      {/* New chat button */}
      <div className="p-3">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-2">
          Saved Sessions
        </div>
        {savedSessions.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <p className="text-xs text-slate-400 dark:text-slate-500">No saved sessions yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {savedSessions.map(session => (
              <div
                key={session.id}
                className={`group relative rounded-lg transition-colors ${
                  session.id === currentSessionId
                    ? 'bg-indigo-50 dark:bg-indigo-900/20'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <button
                  onClick={() => onLoadSession?.(session.id)}
                  className="w-full text-left p-3"
                >
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate pr-6">
                    {session.title}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {session.preview}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                    <Clock className="w-3 h-3" />
                    {formatDate(session.lastMessageAt)}
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    {session.messageCount} messages
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSession?.(session.id)
                  }}
                  className="absolute top-3 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

interface SourceSelectorHeaderProps {
  sources: QuerySources
  availableSources: AvailableSource[]
  isSaved: boolean
  onSourcesChange?: (sources: QuerySources) => void
  onSaveSession?: () => void
}

function SourceSelectorHeader({
  sources,
  availableSources,
  isSaved,
  onSourcesChange,
  onSaveSession,
}: SourceSelectorHeaderProps) {
  const [showPicker, setShowPicker] = useState(false)

  const getSourceLabel = () => {
    switch (sources.type) {
      case 'all': return 'All Sources'
      case 'owned': return 'My Timelines'
      case 'public': return 'Public Only'
      case 'specific': return `${sources.timelineIds.length} Selected`
    }
  }

  const getSourceIcon = () => {
    switch (sources.type) {
      case 'all': return Layers
      case 'owned': return User
      case 'public': return Globe
      case 'specific': return Database
    }
  }

  const SourceIcon = getSourceIcon()

  const ownedSources = availableSources.filter(s => s.isOwned)
  const publicSources = availableSources.filter(s => !s.isOwned && s.isPublic)

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900">
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <SourceIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span>{getSourceLabel()}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {showPicker && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowPicker(false)} />
            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Query Sources
                </div>
              </div>

              {/* Quick select */}
              <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { type: 'all' as const, label: 'All', icon: Layers },
                    { type: 'owned' as const, label: 'Mine', icon: User },
                    { type: 'public' as const, label: 'Public', icon: Globe },
                  ].map(({ type, label, icon: Icon }) => (
                    <button
                      key={type}
                      onClick={() => {
                        onSourcesChange?.({ type })
                        setShowPicker(false)
                      }}
                      className={`px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                        sources.type === type
                          ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-800'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific timelines */}
              <div className="p-2 max-h-64 overflow-y-auto">
                {ownedSources.length > 0 && (
                  <div className="mb-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1">
                      My Timelines
                    </div>
                    {ownedSources.map(source => (
                      <label
                        key={source.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            sources.type === 'all' ||
                            sources.type === 'owned' ||
                            (sources.type === 'specific' && sources.timelineIds.includes(source.id))
                          }
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

                {publicSources.length > 0 && (
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 py-1">
                      Public Timelines
                    </div>
                    {publicSources.map(source => (
                      <label
                        key={source.id}
                        className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={
                            sources.type === 'all' ||
                            sources.type === 'public' ||
                            (sources.type === 'specific' && sources.timelineIds.includes(source.id))
                          }
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
            </div>
          </>
        )}
      </div>

      <button
        onClick={onSaveSession}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          isSaved
            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        {isSaved ? (
          <>
            <BookmarkCheck className="w-4 h-4" />
            Saved
          </>
        ) : (
          <>
            <Bookmark className="w-4 h-4" />
            Save Chat
          </>
        )}
      </button>
    </div>
  )
}

interface CitationBadgeProps {
  citation: Citation
  onViewEntry?: (entryId: string) => void
}

function CitationBadge({ citation, onViewEntry }: CitationBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <span className="relative inline-block">
      <button
        onClick={() => onViewEntry?.(citation.entryId)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors cursor-pointer align-super"
      >
        {citation.index}
      </button>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 dark:bg-slate-950 text-white rounded-lg shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="text-xs font-semibold text-indigo-300 mb-1">
            {citation.entryDate}
          </div>
          <div className="text-sm font-medium mb-1.5">{citation.entryTitle}</div>
          <div className="text-xs text-slate-400 line-clamp-2">{citation.snippet}</div>
          <div className="flex items-center gap-1 mt-2 text-[10px] text-indigo-400">
            <ExternalLink className="w-3 h-3" />
            Click to view entry
          </div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-900 dark:bg-slate-950" />
        </div>
      )}
    </span>
  )
}

interface ChatMessageBubbleProps {
  message: ChatMessage
  isLast: boolean
  onCopyResponse?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onSaveEntries?: (messageId: string, entryIds: string[]) => void
  onViewEntry?: (entryId: string) => void
}

function ChatMessageBubble({
  message,
  isLast,
  onCopyResponse,
  onRegenerate,
  onSaveEntries,
  onViewEntry,
}: ChatMessageBubbleProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopyResponse?.(message.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderContentWithCitations = (content: string, citations?: Citation[]) => {
    if (!citations || citations.length === 0) {
      return <p className="whitespace-pre-wrap">{content}</p>
    }

    // Parse markdown-like content with citation placeholders
    const parts = content.split(/(\[\d+\]|\*\*[^*]+\*\*|\n\n|\n)/g)

    return (
      <div className="space-y-3">
        {parts.map((part, i) => {
          // Citation reference like [1], [2]
          const citationMatch = part.match(/^\[(\d+)\]$/)
          if (citationMatch) {
            const index = parseInt(citationMatch[1])
            const citation = citations.find(c => c.index === index)
            if (citation) {
              return <CitationBadge key={i} citation={citation} onViewEntry={onViewEntry} />
            }
          }

          // Bold text
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
          }

          // Paragraph break
          if (part === '\n\n') {
            return <br key={i} />
          }

          // Line break
          if (part === '\n') {
            return <br key={i} />
          }

          // Regular text
          return <span key={i}>{part}</span>
        })}
      </div>
    )
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="max-w-2xl">
          <div className="bg-indigo-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
            <p className="text-sm">{message.content}</p>
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 text-right font-mono">
            {new Date(message.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </div>
        </div>
      </div>
    )
  }

  // Assistant message
  const entryIds = message.citations?.map(c => c.entryId) || []

  return (
    <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start gap-3 max-w-3xl">
        {/* AI Avatar */}
        <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Message content */}
          <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-md text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {renderContentWithCitations(message.content, message.citations)}
          </div>

          {/* Citations list */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.citations.map(citation => (
                <button
                  key={citation.id}
                  onClick={() => onViewEntry?.(citation.entryId)}
                  className="inline-flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                >
                  <span className="inline-flex items-center justify-center w-4 h-4 text-[9px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded">
                    {citation.index}
                  </span>
                  <span className="truncate max-w-[200px]">{citation.entryTitle}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-2 flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>

            {entryIds.length > 0 && (
              <button
                onClick={() => onSaveEntries?.(message.id, entryIds)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" />
                Save Entries
              </button>
            )}

            {isLast && (
              <button
                onClick={() => onRegenerate?.(message.id)}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Regenerate
              </button>
            )}

            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono ml-2">
              {new Date(message.timestamp).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ChatInputProps {
  onSendMessage?: (content: string) => void
}

function ChatInput({ onSendMessage }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (value.trim()) {
      onSendMessage?.(value.trim())
      setValue('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  return (
    <div className="border-t border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about your timeline data..."
            rows={1}
            className="w-full resize-none rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 pr-12 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
          <button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="absolute right-2 bottom-2 p-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 text-center">
          Responses are based on your selected timeline sources. Press Enter to send, Shift+Enter for new line.
        </p>
      </div>
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function DiscoveryChat({
  savedSessions,
  currentSession,
  availableSources,
  onSendMessage,
  onRegenerate,
  onCopyResponse,
  onSaveEntries,
  onViewEntry,
  onSourcesChange,
  onSaveSession,
  onLoadSession,
  onDeleteSession,
  onNewSession,
}: DiscoveryProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession.messages])

  const lastAssistantMessageIndex = currentSession.messages
    .map((m, i) => ({ role: m.role, index: i }))
    .filter(m => m.role === 'assistant')
    .pop()?.index ?? -1

  return (
    <div className="h-full flex bg-white dark:bg-slate-900">
      {/* Sessions sidebar */}
      <SessionsSidebar
        savedSessions={savedSessions}
        currentSessionId={currentSession.id}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onLoadSession={onLoadSession}
        onDeleteSession={onDeleteSession}
        onNewSession={onNewSession}
      />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Source selector header */}
        <SourceSelectorHeader
          sources={currentSession.sources}
          availableSources={availableSources}
          isSaved={currentSession.isSaved}
          onSourcesChange={onSourcesChange}
          onSaveSession={onSaveSession}
        />

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          {currentSession.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Discover your timeline
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md mb-8">
                Ask questions about your timeline data in natural language. I'll search through your entries and provide insights with references.
              </p>
              <div className="grid gap-2 w-full max-w-md">
                {[
                  'What were the major breakthroughs in the 1940s?',
                  'Compare the events from different decades',
                  'Who were the key people mentioned?',
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => onSendMessage?.(suggestion)}
                    className="text-left px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-6 max-w-4xl mx-auto">
              {currentSession.messages.map((message, index) => (
                <ChatMessageBubble
                  key={message.id}
                  message={message}
                  isLast={index === lastAssistantMessageIndex}
                  onCopyResponse={onCopyResponse}
                  onRegenerate={onRegenerate}
                  onSaveEntries={onSaveEntries}
                  onViewEntry={onViewEntry}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <ChatInput onSendMessage={onSendMessage} />
      </main>
    </div>
  )
}
