'use client'

import { useState, useCallback } from 'react'
import { CollaborationBrowser, PermissionsDashboard } from '@/components/collaboration'
import {
  collaborationTimelines,
  collaborationPermissions,
  collaborationInviteLinks,
  collaborationCollaborators,
} from '@/data/collaboration-sample-data'
import type {
  SharedTimeline,
  SharePermission,
  InviteLink,
  Collaborator,
  Visibility,
  PermissionLevel,
} from '@/types'

type Tab = 'browser' | 'permissions'

export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('browser')
  const [timelines, setTimelines] = useState<SharedTimeline[]>(collaborationTimelines)
  const [permissions, setPermissions] = useState<SharePermission[]>(collaborationPermissions)
  const [inviteLinks, setInviteLinks] = useState<InviteLink[]>(collaborationInviteLinks)
  const [collaborators] = useState<Collaborator[]>(collaborationCollaborators)

  const handleToggleVisibility = useCallback((timelineId: string, visibility: Visibility) => {
    setTimelines((prev) =>
      prev.map((t) => (t.id === timelineId ? { ...t, visibility } : t))
    )
  }, [])

  const handleGrantAccess = useCallback((timelineId: string, email: string, permission: PermissionLevel) => {
    console.log('Grant access:', { timelineId, email, permission })
  }, [])

  const handleRevokeAccess = useCallback((permissionId: string) => {
    setPermissions((prev) => prev.filter((p) => p.id !== permissionId))
  }, [])

  const handleChangePermission = useCallback((permissionId: string, permission: PermissionLevel) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === permissionId ? { ...p, permission } : p))
    )
  }, [])

  const handleCreateInviteLink = useCallback((timelineId: string, permission: PermissionLevel) => {
    console.log('Create invite link:', { timelineId, permission })
  }, [])

  const handleRevokeInviteLink = useCallback((linkId: string) => {
    setInviteLinks((prev) =>
      prev.map((l) => (l.id === linkId ? { ...l, status: 'revoked' as const } : l))
    )
  }, [])

  const handleCopyInviteLink = useCallback((linkId: string) => {
    const link = inviteLinks.find((l) => l.id === linkId)
    if (link) {
      navigator.clipboard.writeText(`https://chronos.app/invite/${link.token}`).catch(() => {
        console.log('Failed to copy to clipboard')
      })
    }
  }, [inviteLinks])

  const handleCloneTimeline = useCallback((timelineId: string) => {
    console.log('Clone timeline:', timelineId)
  }, [])

  const handleCloneEntries = useCallback((timelineId: string, entryIds: string[]) => {
    console.log('Clone entries:', { timelineId, entryIds })
  }, [])

  const handleViewTimeline = useCallback((timelineId: string) => {
    console.log('View timeline:', timelineId)
  }, [])

  const handleViewCollaborator = useCallback((userId: string) => {
    console.log('View collaborator:', userId)
  }, [])

  const sharedProps = {
    sharedTimelines: timelines,
    sharePermissions: permissions,
    inviteLinks,
    collaborators,
    onToggleVisibility: handleToggleVisibility,
    onGrantAccess: handleGrantAccess,
    onRevokeAccess: handleRevokeAccess,
    onChangePermission: handleChangePermission,
    onCreateInviteLink: handleCreateInviteLink,
    onRevokeInviteLink: handleRevokeInviteLink,
    onCopyInviteLink: handleCopyInviteLink,
    onCloneTimeline: handleCloneTimeline,
    onCloneEntries: handleCloneEntries,
    onViewTimeline: handleViewTimeline,
    onViewCollaborator: handleViewCollaborator,
  }

  return (
    <div className="h-full flex flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 px-6">
        {[
          { id: 'browser' as const, label: 'Timelines' },
          { id: 'permissions' as const, label: 'Permissions' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === id
                ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active view */}
      <div className="flex-1 min-h-0">
        {activeTab === 'browser' ? (
          <CollaborationBrowser {...sharedProps} />
        ) : (
          <PermissionsDashboard {...sharedProps} />
        )}
      </div>
    </div>
  )
}
