# Milestone 5: Collaboration

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-4 (Foundation, Timeline, Curate, Discovery) complete

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Implement the Collaboration section — managing timeline visibility, sharing permissions, and access control.

## Overview

Collaboration handles all aspects of sharing timelines with others. Users can make timelines public or private, grant access to specific users with granular permissions (view, clone, or both), and create shareable invite links. A permissions dashboard provides an overview of all sharing relationships.

**Key Functionality:**
- Toggle timelines between public and private visibility
- Grant access to users by email with specific permission levels
- Generate shareable invite links with optional expiration and usage limits
- View and manage all sharing permissions in a central dashboard
- Revoke access or change permission levels for existing collaborators

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/collaboration/tests.md` for detailed test-writing instructions including:
- Key user flows to test (success and failure paths)
- Specific UI elements, button labels, and interactions to verify
- Expected behaviors and assertions

The test instructions are framework-agnostic — adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

**TDD Workflow:**
1. Read `tests.md` and write failing tests for the key user flows
2. Implement the feature to make tests pass
3. Refactor while keeping tests green

## What to Implement

### Components

Copy the section components from `product-plan/sections/collaboration/components/`:

- `CollaborationBrowser.tsx` — Timeline list with visibility toggles and share controls
- `PermissionsDashboard.tsx` — Central view of all sharing relationships

### Data Layer

The components expect these data shapes:

```typescript
type Visibility = 'public' | 'private'
type PermissionLevel = 'view' | 'clone' | 'both'
type GrantMethod = 'email' | 'link'
type LinkStatus = 'active' | 'expired' | 'revoked'

interface SharedTimeline {
  id: string
  title: string
  description: string
  visibility: Visibility
  entryCount: number
  shareCount: number
  createdAt: string
  updatedAt: string
}

interface SharePermission {
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

interface InviteLink {
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
```

You'll need to:
- Create API endpoints for managing visibility and permissions
- Implement invite link generation and redemption
- Handle permission checks across the application
- Track sharing relationships and access grants

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onToggleVisibility` | Switch timeline between public/private |
| `onGrantAccess` | Grant access to user by email |
| `onRevokeAccess` | Remove a user's access to a timeline |
| `onChangePermission` | Change a user's permission level |
| `onCreateInviteLink` | Generate a new shareable link |
| `onRevokeInviteLink` | Deactivate an invite link |
| `onCopyInviteLink` | Copy link URL to clipboard |
| `onCloneTimeline` | Clone an entire timeline (if permitted) |
| `onCloneEntries` | Clone specific entries (if permitted) |
| `onViewTimeline` | Navigate to view a timeline |
| `onViewCollaborator` | View a collaborator's profile |

### Empty States

Implement empty state UI for when no records exist yet:

- **No timelines:** Show message prompting to create timelines first
- **No shares on timeline:** Show "Not shared with anyone" with invite CTA
- **No invite links:** Show "No invite links created" in links section
- **No permissions in dashboard:** Show empty dashboard with explanation

## Files to Reference

- `product-plan/sections/collaboration/README.md` — Feature overview and design intent
- `product-plan/sections/collaboration/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/collaboration/components/` — React components
- `product-plan/sections/collaboration/types.ts` — TypeScript interfaces
- `product-plan/sections/collaboration/sample-data.json` — Test data
- `product-plan/sections/collaboration/screenshot.png` — Visual reference

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: Make a Timeline Public

1. User opens Collaboration section
2. User sees their timelines with visibility toggles
3. User clicks the toggle on a private timeline
4. **Outcome:** Timeline becomes public, toggle updates, anyone can now view

### Flow 2: Share by Email

1. User clicks "Share" on a timeline
2. User enters collaborator's email address
3. User selects permission level (View / Clone / Both)
4. User clicks "Send Invite"
5. **Outcome:** Access granted, collaborator receives notification, appears in share list

### Flow 3: Create Invite Link

1. User clicks "Share" on a timeline
2. User switches to "Invite Link" tab
3. User selects permission level
4. User optionally sets expiration or usage limit
5. User clicks "Create Link"
6. **Outcome:** Link is generated, user can copy to clipboard

### Flow 4: Manage Permissions

1. User opens Permissions Dashboard
2. User sees all sharing relationships grouped by timeline or user
3. User clicks permission dropdown to change a collaborator's access
4. User clicks "Revoke" to remove access
5. **Outcome:** Permission is updated/removed, access changes immediately

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Timeline list shows visibility status and share count
- [ ] Visibility toggle works (public/private)
- [ ] Share modal with email invite works
- [ ] Share modal with invite links works
- [ ] Permission levels (View/Clone/Both) enforced correctly
- [ ] Permissions dashboard shows all sharing relationships
- [ ] Permission changes and revocations work
- [ ] Invite link generation, copying, and revocation work
- [ ] Empty states display properly when no records exist
- [ ] Matches the visual design (see screenshots)
- [ ] Responsive on mobile
