// =============================================================================
// Data Types
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
// Component Props
// =============================================================================

export interface CollaborationProps {
  /** User's timelines with visibility and sharing info */
  sharedTimelines: SharedTimeline[]
  /** All share permissions across timelines */
  sharePermissions: SharePermission[]
  /** Active and expired invite links */
  inviteLinks: InviteLink[]
  /** Available collaborators for sharing */
  collaborators: Collaborator[]

  // Visibility actions
  /** Called when user toggles a timeline's visibility */
  onToggleVisibility?: (timelineId: string, visibility: Visibility) => void

  // Permission actions
  /** Called when user grants access to a specific user */
  onGrantAccess?: (timelineId: string, email: string, permission: PermissionLevel) => void
  /** Called when user revokes access from a user */
  onRevokeAccess?: (permissionId: string) => void
  /** Called when user changes a collaborator's permission level */
  onChangePermission?: (permissionId: string, permission: PermissionLevel) => void

  // Invite link actions
  /** Called when user creates a new invite link */
  onCreateInviteLink?: (timelineId: string, permission: PermissionLevel, expiresAt?: string, usageLimit?: number) => void
  /** Called when user revokes an invite link */
  onRevokeInviteLink?: (linkId: string) => void
  /** Called when user copies an invite link to clipboard */
  onCopyInviteLink?: (linkId: string) => void

  // Clone actions
  /** Called when user clones an entire timeline */
  onCloneTimeline?: (timelineId: string) => void
  /** Called when user clones specific entries */
  onCloneEntries?: (timelineId: string, entryIds: string[]) => void

  // Navigation
  /** Called when user wants to view a timeline's details */
  onViewTimeline?: (timelineId: string) => void
  /** Called when user wants to view a collaborator's profile */
  onViewCollaborator?: (userId: string) => void
}
