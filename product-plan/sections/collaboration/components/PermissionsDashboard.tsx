import { useState, useMemo } from 'react'
import {
  Users,
  Eye,
  GitBranch,
  Shield,
  Search,
  ChevronDown,
  ChevronRight,
  Mail,
  Link2,
  Trash2,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  Clock,
  ExternalLink,
} from 'lucide-react'
import type {
  CollaborationProps,
  SharePermission,
  PermissionLevel,
} from '../types'

// =============================================================================
// Sub-components
// =============================================================================

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

interface GrantMethodBadgeProps {
  method: 'email' | 'link'
}

function GrantMethodBadge({ method }: GrantMethodBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${
      method === 'email'
        ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
        : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400'
    }`}>
      {method === 'email' ? <Mail className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
      {method === 'email' ? 'Email' : 'Link'}
    </span>
  )
}

// =============================================================================
// Main Component
// =============================================================================

interface PermissionsDashboardProps extends CollaborationProps {}

export function PermissionsDashboard({
  sharedTimelines,
  sharePermissions,
  onRevokeAccess,
  onChangePermission,
  onViewTimeline,
  onViewCollaborator,
}: PermissionsDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPermission, setFilterPermission] = useState<'all' | PermissionLevel>('all')
  const [filterTimeline, setFilterTimeline] = useState<string>('all')
  const [groupBy, setGroupBy] = useState<'timeline' | 'user'>('timeline')
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date')

  // Filter permissions
  const filteredPermissions = useMemo(() => {
    return sharePermissions.filter(perm => {
      const matchesSearch =
        perm.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perm.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        perm.timelineTitle.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesPermission = filterPermission === 'all' || perm.permission === filterPermission
      const matchesTimeline = filterTimeline === 'all' || perm.timelineId === filterTimeline
      return matchesSearch && matchesPermission && matchesTimeline
    })
  }, [sharePermissions, searchQuery, filterPermission, filterTimeline])

  // Sort permissions
  const sortedPermissions = useMemo(() => {
    return [...filteredPermissions].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.grantedAt).getTime() - new Date(a.grantedAt).getTime()
      }
      return a.userName.localeCompare(b.userName)
    })
  }, [filteredPermissions, sortBy])

  // Group permissions
  const groupedPermissions = useMemo(() => {
    if (groupBy === 'timeline') {
      const groups: Record<string, SharePermission[]> = {}
      sortedPermissions.forEach(perm => {
        if (!groups[perm.timelineId]) {
          groups[perm.timelineId] = []
        }
        groups[perm.timelineId].push(perm)
      })
      return groups
    } else {
      const groups: Record<string, SharePermission[]> = {}
      sortedPermissions.forEach(perm => {
        if (!groups[perm.userId]) {
          groups[perm.userId] = []
        }
        groups[perm.userId].push(perm)
      })
      return groups
    }
  }, [sortedPermissions, groupBy])

  // Stats
  const uniqueCollaborators = new Set(sharePermissions.map(p => p.userId)).size
  const viewOnlyCount = sharePermissions.filter(p => p.permission === 'view').length
  const cloneCount = sharePermissions.filter(p => p.permission === 'clone').length
  const fullAccessCount = sharePermissions.filter(p => p.permission === 'both').length

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Get timeline title helper
  const getTimelineTitle = (timelineId: string) =>
    sharedTimelines.find(t => t.id === timelineId)?.title || 'Unknown Timeline'

  // Get first permission for a user (for avatar display)
  const getFirstPermForUser = (userId: string) =>
    sharePermissions.find(p => p.userId === userId)

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              Permissions Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              View and manage all sharing relationships
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-mono">
                {sharePermissions.length}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Total Permissions</div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {uniqueCollaborators}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Collaborators</div>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">
                  {viewOnlyCount}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">View</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
                  {cloneCount}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Clone</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {fullAccessCount}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Full</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or timeline..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Timeline filter */}
          <select
            value={filterTimeline}
            onChange={(e) => setFilterTimeline(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Timelines</option>
            {sharedTimelines.filter(t => t.shareCount > 0).map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>

          {/* Permission filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {[
              { value: 'all' as const, label: 'All' },
              { value: 'view' as const, label: 'View', icon: Eye },
              { value: 'clone' as const, label: 'Clone', icon: GitBranch },
              { value: 'both' as const, label: 'Full', icon: Shield },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setFilterPermission(value)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  filterPermission === value
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
              </button>
            ))}
          </div>

          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />

          {/* Group by */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Group by:</span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded">
              <button
                onClick={() => setGroupBy('timeline')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  groupBy === 'timeline'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setGroupBy('user')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  groupBy === 'user'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                User
              </button>
            </div>
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortBy(sortBy === 'date' ? 'name' : 'date')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortBy === 'date' ? 'By Date' : 'By Name'}
          </button>
        </div>
      </header>

      {/* Permissions list */}
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-4">
          {Object.keys(groupedPermissions).length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No permissions found</p>
              {searchQuery && (
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                  Try adjusting your search or filters
                </p>
              )}
            </div>
          ) : (
            Object.entries(groupedPermissions).map(([groupId, perms], groupIndex) => {
              const isTimelineGroup = groupBy === 'timeline'
              const groupTitle = isTimelineGroup
                ? getTimelineTitle(groupId)
                : perms[0].userName
              const groupSubtitle = isTimelineGroup
                ? `${perms.length} collaborator${perms.length !== 1 ? 's' : ''}`
                : perms[0].userEmail

              return (
                <div
                  key={groupId}
                  className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${groupIndex * 50}ms` }}
                >
                  {/* Group header */}
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {!isTimelineGroup && (
                        <UserAvatar
                          name={perms[0].userName}
                          avatar={perms[0].userAvatar}
                          size="md"
                        />
                      )}
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                          {groupTitle}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {groupSubtitle}
                        </p>
                      </div>
                    </div>
                    {isTimelineGroup && (
                      <button
                        onClick={() => onViewTimeline?.(groupId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Timeline
                      </button>
                    )}
                    {!isTimelineGroup && (
                      <button
                        onClick={() => onViewCollaborator?.(groupId)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        View Profile
                      </button>
                    )}
                  </div>

                  {/* Permission rows */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {perms.map(perm => (
                      <div
                        key={perm.id}
                        className="px-4 py-3 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                      >
                        {/* User info (only show if grouped by timeline) */}
                        {isTimelineGroup && (
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <UserAvatar
                              name={perm.userName}
                              avatar={perm.userAvatar}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                                {perm.userName}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {perm.userEmail}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Timeline info (only show if grouped by user) */}
                        {!isTimelineGroup && (
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                              {perm.timelineTitle}
                            </div>
                          </div>
                        )}

                        {/* Permission badge */}
                        <select
                          value={perm.permission}
                          onChange={(e) => onChangePermission?.(perm.id, e.target.value as PermissionLevel)}
                          className="px-2 py-1 bg-transparent border border-slate-200 dark:border-slate-700 rounded text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                          <option value="view">View</option>
                          <option value="clone">Clone</option>
                          <option value="both">Full Access</option>
                        </select>

                        {/* Grant method */}
                        <GrantMethodBadge method={perm.grantedVia} />

                        {/* Date */}
                        <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 w-20">
                          <Clock className="w-3.5 h-3.5" />
                          {formatDate(perm.grantedAt)}
                        </div>

                        {/* Actions */}
                        <button
                          onClick={() => onRevokeAccess?.(perm.id)}
                          className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-slate-400 hover:text-red-500 transition-all"
                          title="Revoke access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}
