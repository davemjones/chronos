# Test Instructions: Collaboration

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

The Collaboration section manages timeline visibility and sharing permissions. Test visibility toggles, permission grants, invite links, and the permissions dashboard.

---

## User Flow Tests

### Flow 1: Toggle Timeline Visibility

**Scenario:** User makes a private timeline public

#### Success Path

**Setup:**
- User has timelines with mixed visibility

**Steps:**
1. User navigates to `/collaboration`
2. User sees list of their timelines with visibility toggles
3. User clicks toggle on a private timeline
4. Toggle switches to "Public"

**Expected Results:**
- [ ] Each timeline shows current visibility (Public/Private)
- [ ] Toggle is clearly labeled
- [ ] Clicking toggle calls `onToggleVisibility`
- [ ] UI updates to reflect new visibility
- [ ] Timeline is now accessible to public

#### Making Public Timeline Private

**Steps:**
1. User clicks toggle on a public timeline
2. Toggle switches to "Private"

**Expected Results:**
- [ ] Confirmation if timeline has existing shares
- [ ] Public access revoked
- [ ] Existing share permissions preserved

---

### Flow 2: Share by Email

**Scenario:** User invites someone via email

#### Success Path

**Steps:**
1. User clicks "Share" on a timeline
2. Share modal opens with "Invite by Email" tab
3. User enters email: "colleague@example.com"
4. User selects permission: "View Only"
5. User clicks "Send Invite"

**Expected Results:**
- [ ] Email input validates format
- [ ] Permission dropdown shows: View, Clone, Both
- [ ] Success message: "Invite sent to colleague@example.com"
- [ ] New permission appears in share list
- [ ] Share count increments

#### Failure Path: Invalid Email

**Steps:**
1. User enters "invalid-email"
2. User clicks "Send Invite"

**Expected Results:**
- [ ] Validation error: "Please enter a valid email"
- [ ] Invite not sent
- [ ] Focus remains on email input

#### Failure Path: Already Shared

**Steps:**
1. User enters email of existing collaborator

**Expected Results:**
- [ ] Message: "This user already has access"
- [ ] Option to change their permission level

---

### Flow 3: Create Invite Link

**Scenario:** User generates a shareable link

#### Success Path

**Steps:**
1. User clicks "Share" on a timeline
2. User switches to "Invite Link" tab
3. User selects permission: "Clone"
4. User optionally sets expiration: "7 days"
5. User optionally sets usage limit: "10 uses"
6. User clicks "Create Link"

**Expected Results:**
- [ ] Link generated and displayed
- [ ] "Copy" button available
- [ ] Link appears in active links list
- [ ] Shows permission level, expiration, usage

#### Copy Link to Clipboard

**Steps:**
1. User clicks "Copy" button

**Expected Results:**
- [ ] Link copied to clipboard
- [ ] Feedback: button shows "Copied!" or checkmark
- [ ] Link URL is correct format

---

### Flow 4: Revoke Invite Link

**Scenario:** User deactivates a shareable link

#### Success Path

**Setup:**
- Active invite links exist

**Steps:**
1. User views invite links for timeline
2. User clicks "Revoke" on a link
3. User confirms action

**Expected Results:**
- [ ] Confirmation: "This link will no longer work"
- [ ] Link status changes to "Revoked"
- [ ] Link no longer works for new users
- [ ] Existing users who used link retain access

---

### Flow 5: View Permissions Dashboard

**Scenario:** User reviews all sharing relationships

#### Success Path

**Steps:**
1. User navigates to Permissions Dashboard view
2. User sees all sharing relationships

**Expected Results:**
- [ ] Shows total permissions count
- [ ] Shows total collaborators count
- [ ] Lists all permissions with timeline name
- [ ] Shows user name, email, permission level
- [ ] Shows how access was granted (email/link)
- [ ] Shows date granted

---

### Flow 6: Change Permission Level

**Scenario:** User upgrades a collaborator's access

#### Success Path

**Setup:**
- Collaborator has "View" permission

**Steps:**
1. User finds permission in dashboard
2. User clicks permission dropdown
3. User selects "Both" (View + Clone)
4. Permission updates

**Expected Results:**
- [ ] Dropdown shows current permission selected
- [ ] Changing dropdown calls `onChangePermission`
- [ ] Success feedback on update
- [ ] Collaborator now has new permission level

---

### Flow 7: Revoke User Access

**Scenario:** User removes a collaborator's access

#### Success Path

**Steps:**
1. User finds permission in dashboard
2. User clicks "Revoke" button
3. User confirms action

**Expected Results:**
- [ ] Confirmation: "Remove access for [User Name]?"
- [ ] Permission removed from list
- [ ] User can no longer access timeline
- [ ] Success message confirms removal

---

### Flow 8: Filter Permissions Dashboard

**Scenario:** User filters to find specific permissions

#### Success Path

**Setup:**
- Many permissions exist across timelines

**Steps:**
1. User types in search: "John"
2. User filters by timeline: "World War II"
3. User filters by permission: "Clone"

**Expected Results:**
- [ ] Search filters by user name or email
- [ ] Timeline dropdown filters to specific timeline
- [ ] Permission filter narrows by access level
- [ ] Filters can be combined

---

## Empty State Tests

### No Timelines

**Scenario:** User has no timelines to share

**Setup:**
- User owns zero timelines

**Expected Results:**
- [ ] Shows "No timelines to manage"
- [ ] Helpful message: "Create a timeline first"
- [ ] Link to Timeline section

### No Shares on Timeline

**Scenario:** Timeline hasn't been shared with anyone

**Setup:**
- Timeline exists with shareCount: 0

**Expected Results:**
- [ ] Share list empty
- [ ] Message: "Not shared with anyone"
- [ ] Invite options prominently displayed
- [ ] "Share this timeline" CTA

### No Invite Links

**Scenario:** No invite links created for timeline

**Setup:**
- Timeline has no active links

**Expected Results:**
- [ ] Links section shows "No invite links"
- [ ] "Create Link" button available
- [ ] Explanation of how links work

### No Permissions in Dashboard

**Scenario:** User has timelines but no active shares

**Setup:**
- User has timelines, all private, no shares

**Expected Results:**
- [ ] Dashboard shows "No sharing permissions"
- [ ] Stats show 0 permissions, 0 collaborators
- [ ] Helpful guidance on sharing

---

## Component Interaction Tests

### Visibility Toggle

**Renders correctly:**
- [ ] Shows "Public" or "Private" state
- [ ] Toggle switch or button clearly visible

**User interactions:**
- [ ] Click calls `onToggleVisibility`
- [ ] Visual state updates immediately

### Share Modal

**Renders correctly:**
- [ ] Tabs for "Email" and "Link"
- [ ] Form fields for each method
- [ ] Current shares list

**User interactions:**
- [ ] Tab switching works
- [ ] Form validation on submit
- [ ] Close button dismisses modal

### Permission Row

**Renders correctly:**
- [ ] User avatar and name
- [ ] Email address
- [ ] Permission badge (View/Clone/Both)
- [ ] Grant date and method

**User interactions:**
- [ ] Permission dropdown editable
- [ ] Revoke button removes access

### Invite Link Row

**Renders correctly:**
- [ ] Link URL (truncated)
- [ ] Permission level
- [ ] Status (Active/Expired/Revoked)
- [ ] Usage count / limit
- [ ] Expiration date

**User interactions:**
- [ ] Copy button copies URL
- [ ] Revoke button deactivates link

---

## Edge Cases

- [ ] Handles timeline with 100+ collaborators
- [ ] Handles user revoking their own access (error)
- [ ] Handles expired invite link redemption (error)
- [ ] Handles usage limit reached on link
- [ ] Preserves permissions when visibility toggles
- [ ] Handles duplicate invite to same email

---

## Accessibility Checks

- [ ] Toggle has accessible label
- [ ] Modal is properly trapped for focus
- [ ] Permission dropdowns keyboard accessible
- [ ] Revoke actions have confirmation
- [ ] Screen reader announces state changes

---

## Sample Test Data

```typescript
// Example shared timeline
const mockSharedTimeline = {
  id: 'timeline-1',
  title: 'World War II',
  description: 'Major events...',
  visibility: 'private',
  entryCount: 42,
  shareCount: 5,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z'
};

// Example share permission
const mockPermission = {
  id: 'perm-1',
  timelineId: 'timeline-1',
  timelineTitle: 'World War II',
  userId: 'user-2',
  userName: 'Jane Smith',
  userEmail: 'jane@example.com',
  userAvatar: null,
  permission: 'view',
  grantedAt: '2024-01-10T00:00:00Z',
  grantedVia: 'email'
};

// Example invite link
const mockInviteLink = {
  id: 'link-1',
  timelineId: 'timeline-1',
  timelineTitle: 'World War II',
  token: 'abc123xyz',
  permission: 'clone',
  status: 'active',
  usageCount: 3,
  usageLimit: 10,
  createdAt: '2024-01-12T00:00:00Z',
  expiresAt: '2024-01-19T00:00:00Z'
};

// Empty state testing
const mockEmptyPermissions = [];
const mockEmptyInviteLinks = [];
```

---

## Notes for Test Implementation

- Test permission enforcement in other sections (Timeline, Discovery)
- Verify invite link redemption flow
- Test concurrent permission changes
- Mock email sending for invite tests
- Test link expiration with time mocking
