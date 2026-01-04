# Collaboration

## Overview

Collaboration manages timeline visibility and sharing permissions. Users can make timelines public or private, grant access to specific users with granular permissions (view, clone, or both), and share via direct invites or invite links. A permissions dashboard provides an overview of all sharing relationships.

## User Flows

- Toggle a timeline between public and private visibility
- Grant access to a private timeline by entering email/username
- Generate a shareable invite link for a timeline
- Set permission level per user (view only, clone only, or both)
- Revoke access from a specific user
- Clone an entire timeline from a shared source
- Clone individual entries from a shared timeline
- View all timelines with their current sharing status
- View all users who have access to your timelines (permissions dashboard)

## Design Decisions

- **Two views:** Timeline list for quick visibility changes, dashboard for comprehensive permission management
- **Granular permissions:** View, Clone, or Both — giving owners fine control
- **Multiple sharing methods:** Direct email invites and shareable links
- **Central dashboard:** See all sharing relationships in one place

## Data Used

**Entities:**
- `SharedTimeline` — Timeline with visibility and share count
- `SharePermission` — Individual user access grants
- `InviteLink` — Shareable links with usage tracking
- `Collaborator` — Users who have been granted access

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `CollaborationBrowser` — Timeline list with visibility toggles and share controls
- `PermissionsDashboard` — Central view of all sharing relationships

## Callback Props

| Callback | Description |
|----------|-------------|
| `onToggleVisibility` | Called when user toggles public/private |
| `onGrantAccess` | Called when user grants access by email |
| `onRevokeAccess` | Called when user revokes a permission |
| `onChangePermission` | Called when user changes permission level |
| `onCreateInviteLink` | Called when user creates a shareable link |
| `onRevokeInviteLink` | Called when user deactivates a link |
| `onCopyInviteLink` | Called when user copies link to clipboard |
| `onCloneTimeline` | Called when user clones entire timeline |
| `onCloneEntries` | Called when user clones specific entries |
| `onViewTimeline` | Called when user wants to view a timeline |
| `onViewCollaborator` | Called when user clicks on a collaborator |
