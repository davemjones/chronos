'use client'

import { useState } from 'react'
import {
  Globe,
  Lock,
  Users,
  Share2,
  Copy,
  Link2,
  Mail,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Clock,
  Eye,
  GitBranch,
  MoreHorizontal,
  Trash2,
  ExternalLink,
  Search,
  UserPlus,
  Shield,
} from 'lucide-react'
import type {
  CollaborationProps,
  SharedTimeline,
  SharePermission,
  InviteLink,
  Visibility,
  PermissionLevel,
} from '@/types'

// =============================================================================
// Sub-components
// =============================================================================

interface VisibilityToggleProps {
  visibility: Visibility
  onToggle?: (visibility: Visibility) => void
}

function VisibilityToggle({ visibility, onToggle }: VisibilityToggleProps) {
  const isPublic = visibility === 'public'

  return (
    <button
      onClick={() => onToggle?.(isPublic ? 'private' : 'public')}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
        isPublic
          ? 'bg-emerald-500'
          : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white shadow-sm transition-transform ${
          isPublic ? 'translate-x-6' : 'translate-x-1'
        }`}
      >
        {isPublic ? (
          <Globe className="w-2.5 h-2.5 text-emerald-500" />
        ) : (
          <Lock className="w-2.5 h-2.5 text-slate-400" />
        )}
      </span>
    </button>
  )
}

interface PermissionBadgeProps {
  permission: PermissionLevel
  size?: 'sm' | 'md'
}

function PermissionBadge({ permission, size = 'sm' }: PermissionBadgeProps) {
  const styles = {
    view: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-blue-200 dark:ring-blue-800',
    clone: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 ring-amber-200 dark:ring-amber-800',
    both: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 ring-emerald-200 dark:ring-emerald-800',
  }

  const icons = {
    view: Eye,
    clone: GitBranch,
    both: Shield,
  }

  const labels = {
    view: 'View',
    clone: 'Clone',
    both: 'Full',
  }

  const Icon = icons[permission]
  const sizeClasses = size === 'sm' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'

  return (
    <span className={`inline-flex items-center gap-1 rounded ring-1 font-medium ${styles[permission]} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {labels[permission]}
    </span>
  )
}

interface UserAvatarProps {
  name: string
  avatar: string | null
  size?: 'sm' | 'md' | 'lg'
}

function UserAvatar({ name, avatar, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  }

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white dark:ring-slate-800`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center font-semibold text-white ring-2 ring-white dark:ring-slate-800`}
    >
      {initials}
    </div>
  )
}

interface ShareModalProps {
  timeline: SharedTimeline
  permissions: SharePermission[]
  inviteLinks: InviteLink[]
  onClose: () => void
  onGrantAccess?: (timelineId: string, email: string, permission: PermissionLevel) => void
  onRevokeAccess?: (permissionId: string) => void
  onChangePermission?: (permissionId: string, permission: PermissionLevel) => void
  onCreateInviteLink?: (timelineId: string, permission: PermissionLevel) => void
  onRevokeInviteLink?: (linkId: string) => void
  onCopyInviteLink?: (linkId: string) => void
}

function ShareModal({
  timeline,
  permissions,
  inviteLinks,
  onClose,
  onGrantAccess,
  onRevokeAccess,
  onChangePermission,
  onCreateInviteLink,
  onRevokeInviteLink,
  onCopyInviteLink,
}: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'people' | 'links'>('people')
  const [email, setEmail] = useState('')
  const [selectedPermission, setSelectedPermission] = useState<PermissionLevel>('view')
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)

  const handleCopyLink = (linkId: string) => {
    onCopyInviteLink?.(linkId)
    setCopiedLinkId(linkId)
    setTimeout(() => setCopiedLinkId(null), 2000)
  }

  const handleInvite = () => {
    if (email.trim()) {
      onGrantAccess?.(timeline.id, email.trim(), selectedPermission)
      setEmail('')
    }
  }

  const activeLinks = inviteLinks.filter(l => l.status === 'active')
  const expiredLinks = inviteLinks.filter(l => l.status !== 'active')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Share &ldquo;{timeline.title}&rdquo;
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {timeline.entryCount} entries · {permissions.length} collaborators
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('people')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'people'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Mail className="w-4 h-4 inline-block mr-2" />
            Invite People
          </button>
          <button
            onClick={() => setActiveTab('links')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'links'
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Link2 className="w-4 h-4 inline-block mr-2" />
            Invite Links
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'people' && (
            <div className="space-y-4">
              {/* Invite form */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <select
                  value={selectedPermission}
                  onChange={(e) => setSelectedPermission(e.target.value as PermissionLevel)}
                  className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="view">View</option>
                  <option value="clone">Clone</option>
                  <option value="both">Both</option>
                </select>
                <button
                  onClick={handleInvite}
                  disabled={!email.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed"
                >
                  <UserPlus className="w-4 h-4" />
                </button>
              </div>

              {/* People with access */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  People with access
                </div>
                {permissions.length === 0 ? (
                  <div className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
                    No one has access yet
                  </div>
                ) : (
                  <div className="space-y-1">
                    {permissions.map(perm => (
                      <div
                        key={perm.id}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
                      >
                        <UserAvatar name={perm.userName} avatar={perm.userAvatar} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                            {perm.userName}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {perm.userEmail}
                          </div>
                        </div>
                        <select
                          value={perm.permission}
                          onChange={(e) => onChangePermission?.(perm.id, e.target.value as PermissionLevel)}
                          className="px-2 py-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="view">View</option>
                          <option value="clone">Clone</option>
                          <option value="both">Both</option>
                        </select>
                        <button
                          onClick={() => onRevokeAccess?.(perm.id)}
                          className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-slate-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'links' && (
            <div className="space-y-4">
              {/* Create link */}
              <button
                onClick={() => onCreateInviteLink?.(timeline.id, 'view')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400 transition-colors"
              >
                <Link2 className="w-4 h-4" />
                Create new invite link
              </button>

              {/* Active links */}
              {activeLinks.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Active links
                  </div>
                  {activeLinks.map(link => (
                    <div
                      key={link.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <PermissionBadge permission={link.permission} size="md" />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLink(link.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                          >
                            {copiedLinkId === link.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => onRevokeInviteLink?.(link.id)}
                            className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {link.usageCount}{link.usageLimit ? `/${link.usageLimit}` : ''} uses
                        </span>
                        {link.expiresAt && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Expires {new Date(link.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Expired links */}
              {expiredLinks.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Expired links
                  </div>
                  {expiredLinks.map(link => (
                    <div
                      key={link.id}
                      className="p-3 bg-slate-100/50 dark:bg-slate-800/30 rounded-lg opacity-60"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PermissionBadge permission={link.permission} size="md" />
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {link.usageCount} uses · Expired
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface TimelineCardProps {
  timeline: SharedTimeline
  permissions: SharePermission[]
  onToggleVisibility?: (timelineId: string, visibility: Visibility) => void
  onShare?: () => void
  onView?: () => void
}

function TimelineCard({
  timeline,
  permissions,
  onToggleVisibility,
  onShare,
  onView,
}: TimelineCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md">
      {/* Main row */}
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Expand button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-1 p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {/* Timeline info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                {timeline.title}
              </h3>
              {timeline.visibility === 'public' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  <Globe className="w-3 h-3" />
                  Public
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                  <Lock className="w-3 h-3" />
                  Private
                </span>
              )}
            </div>
            {timeline.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {timeline.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono">{timeline.entryCount} entries</span>
              {timeline.shareCount > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {timeline.shareCount} collaborators
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <VisibilityToggle
              visibility={timeline.visibility}
              onToggle={(vis) => onToggleVisibility?.(timeline.id, vis)}
            />
            <button
              onClick={onShare}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={onView}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded: Show collaborators */}
      {expanded && permissions.length > 0 && (
        <div className="px-4 pb-4 pt-0">
          <div className="pl-9 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Collaborators
            </div>
            <div className="space-y-2">
              {permissions.map(perm => (
                <div
                  key={perm.id}
                  className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
                >
                  <UserAvatar name={perm.userName} avatar={perm.userAvatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {perm.userName}
                    </div>
                  </div>
                  <PermissionBadge permission={perm.permission} />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    via {perm.grantedVia}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {expanded && permissions.length === 0 && (
        <div className="px-4 pb-4 pt-0">
          <div className="pl-9 border-l-2 border-slate-200 dark:border-slate-700 ml-2">
            <p className="text-sm text-slate-400 dark:text-slate-500 italic">
              No collaborators yet
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function CollaborationBrowser({
  sharedTimelines,
  sharePermissions,
  inviteLinks,
  collaborators,
  onToggleVisibility,
  onGrantAccess,
  onRevokeAccess,
  onChangePermission,
  onCreateInviteLink,
  onRevokeInviteLink,
  onCopyInviteLink,
  onViewTimeline,
}: CollaborationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterVisibility, setFilterVisibility] = useState<'all' | Visibility>('all')
  const [shareModalTimeline, setShareModalTimeline] = useState<SharedTimeline | null>(null)

  // Filter timelines
  const filteredTimelines = sharedTimelines.filter(timeline => {
    const matchesSearch = timeline.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      timeline.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesVisibility = filterVisibility === 'all' || timeline.visibility === filterVisibility
    return matchesSearch && matchesVisibility
  })

  // Get permissions for a timeline
  const getTimelinePermissions = (timelineId: string) =>
    sharePermissions.filter(p => p.timelineId === timelineId)

  // Get invite links for a timeline
  const getTimelineLinks = (timelineId: string) =>
    inviteLinks.filter(l => l.timelineId === timelineId)

  // Stats
  const publicCount = sharedTimelines.filter(t => t.visibility === 'public').length
  const privateCount = sharedTimelines.filter(t => t.visibility === 'private').length
  const totalCollaborators = new Set(sharePermissions.map(p => p.userId)).size

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Collaboration
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage sharing and permissions for your timelines
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                {sharedTimelines.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Timelines</div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {publicCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Public</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600 dark:text-slate-400 font-mono">
                {privateCount}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Private</div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {totalCollaborators}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Collaborators</div>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search timelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {[
              { value: 'all' as const, label: 'All' },
              { value: 'public' as const, label: 'Public', icon: Globe },
              { value: 'private' as const, label: 'Private', icon: Lock },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setFilterVisibility(value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  filterVisibility === value
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Timeline list */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredTimelines.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No timelines found</p>
              {searchQuery && (
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Try adjusting your search or filters
                </p>
              )}
            </div>
          ) : (
            filteredTimelines.map((timeline, index) => (
              <div
                key={timeline.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TimelineCard
                  timeline={timeline}
                  permissions={getTimelinePermissions(timeline.id)}
                  onToggleVisibility={onToggleVisibility}
                  onShare={() => setShareModalTimeline(timeline)}
                  onView={() => onViewTimeline?.(timeline.id)}
                />
              </div>
            ))
          )}
        </div>
      </main>

      {/* Share Modal */}
      {shareModalTimeline && (
        <ShareModal
          timeline={shareModalTimeline}
          permissions={getTimelinePermissions(shareModalTimeline.id)}
          inviteLinks={getTimelineLinks(shareModalTimeline.id)}
          onClose={() => setShareModalTimeline(null)}
          onGrantAccess={onGrantAccess}
          onRevokeAccess={onRevokeAccess}
          onChangePermission={onChangePermission}
          onCreateInviteLink={onCreateInviteLink}
          onRevokeInviteLink={onRevokeInviteLink}
          onCopyInviteLink={onCopyInviteLink}
        />
      )}
    </div>
  )
}
