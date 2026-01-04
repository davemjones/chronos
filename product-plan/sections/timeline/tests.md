# Test Instructions: Timeline

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

The Timeline section enables users to browse available timelines and explore their entries in an interactive visualization. Test the browsing experience, filtering, timeline viewing, and entry management on owned timelines.

---

## User Flow Tests

### Flow 1: Browse and Select a Timeline

**Scenario:** User browses available timelines and selects one to view

#### Success Path

**Setup:**
- User is logged in
- Multiple timelines exist (public, owned, and favorited)

**Steps:**
1. User navigates to `/` (Timeline section)
2. User sees grid of timeline cards
3. User sees category tabs: "All", "Public", "Favorited", "Owned"
4. User clicks on a timeline card

**Expected Results:**
- [ ] Timeline cards display with title, description, entry count, date range
- [ ] Each card shows top tags and owner avatar
- [ ] Category tabs show counts in parentheses
- [ ] Clicking card navigates to `/timeline/:id`
- [ ] Timeline viewer loads with selected timeline

#### Failure Path: No Timelines Exist

**Setup:**
- User is logged in
- No timelines available

**Expected Results:**
- [ ] Shows empty state message "No timelines found"
- [ ] Shows helpful CTA to create first timeline

---

### Flow 2: Filter Timelines by Category

**Scenario:** User filters timeline list using category tabs

#### Success Path

**Setup:**
- Multiple timelines exist across categories
- At least one timeline is owned, one is public, one is favorited

**Steps:**
1. User is on Timeline browser
2. User clicks "Owned" tab
3. User clicks "Public" tab
4. User clicks "Favorited" tab

**Expected Results:**
- [ ] "Owned" tab shows only user's own timelines
- [ ] "Public" tab shows only public timelines
- [ ] "Favorited" tab shows only favorited timelines
- [ ] Active tab is visually highlighted (indigo background)
- [ ] Counts update to reflect filtered results

---

### Flow 3: Search Timelines

**Scenario:** User searches for specific timelines

#### Success Path

**Setup:**
- Multiple timelines exist with various titles

**Steps:**
1. User types "World War" in search input
2. User sees filtered results

**Expected Results:**
- [ ] Search input has placeholder "Search timelines..."
- [ ] Results filter to match title, description, or tags
- [ ] Filtering happens as user types (debounced)

#### Search with No Results

**Setup:**
- Search term matches nothing

**Steps:**
1. User types "xyznonexistent" in search

**Expected Results:**
- [ ] Shows "No timelines found"
- [ ] Shows message "Try adjusting your search terms"
- [ ] Empty state is helpful, not blank

---

### Flow 4: View Timeline Entries

**Scenario:** User explores entries in the timeline viewer

#### Success Path

**Setup:**
- Timeline has multiple entries across date range
- Some entries have tags applied

**Steps:**
1. User is viewing a timeline
2. User sees entries on the timeline canvas
3. User hovers over an entry
4. User clicks on an entry

**Expected Results:**
- [ ] Timeline canvas renders with date axis
- [ ] Entries appear as nodes on the timeline
- [ ] Hover shows tooltip with entry title and date
- [ ] Click opens entry detail panel on right side
- [ ] Detail panel shows full content, media, tags

---

### Flow 5: Filter Entries by Tags

**Scenario:** User filters timeline entries by tags

#### Success Path

**Setup:**
- Timeline has entries with various tags applied

**Steps:**
1. User is viewing a timeline
2. User clicks tag filter button
3. User selects one or more tags
4. User sees filtered entries

**Expected Results:**
- [ ] Tag filter shows all tags used in this timeline
- [ ] Tags show count of entries with that tag
- [ ] Selecting tags filters visible entries
- [ ] Multiple tag selection uses AND logic
- [ ] "Clear" option removes all tag filters

---

### Flow 6: Create New Entry (Owned Timeline)

**Scenario:** User adds a new entry to their own timeline

#### Success Path

**Setup:**
- User is viewing their own timeline

**Steps:**
1. User clicks "Add Entry" button
2. User fills in title: "Apollo 11 Moon Landing"
3. User selects date: "July 20, 1969"
4. User enters content with description
5. User optionally adds media URL
6. User clicks "Save"

**Expected Results:**
- [ ] "Add Entry" button visible only on owned timelines
- [ ] Form validates required fields (title, date)
- [ ] Success message appears after save
- [ ] New entry appears on timeline canvas
- [ ] Entry is positioned correctly by date

#### Failure Path: Validation Error

**Setup:**
- User attempts to save without required fields

**Steps:**
1. User clicks "Add Entry"
2. User leaves title empty
3. User clicks "Save"

**Expected Results:**
- [ ] Shows validation error: "Title is required"
- [ ] Form is not submitted
- [ ] Focus moves to first invalid field

---

### Flow 7: Edit Entry

**Scenario:** User edits an existing entry on their timeline

#### Success Path

**Setup:**
- User is viewing their own timeline
- Entry exists that user wants to edit

**Steps:**
1. User clicks on an entry
2. User clicks "Edit" button in detail panel
3. User changes the title
4. User clicks "Save"

**Expected Results:**
- [ ] Edit button visible only for owned timelines
- [ ] Form pre-fills with existing entry data
- [ ] Changes are saved successfully
- [ ] Entry updates in timeline view
- [ ] Success message confirms save

---

### Flow 8: Delete Entry

**Scenario:** User deletes an entry from their timeline

#### Success Path

**Setup:**
- User is viewing their own timeline with multiple entries

**Steps:**
1. User clicks on an entry
2. User clicks "Delete" button in detail panel
3. User sees confirmation dialog
4. User confirms deletion

**Expected Results:**
- [ ] Confirmation dialog asks "Are you sure?"
- [ ] Entry is removed from timeline
- [ ] Detail panel closes
- [ ] Success message confirms deletion

#### Failure Path: Cancel Deletion

**Steps:**
1. User clicks "Delete"
2. User clicks "Cancel" in confirmation dialog

**Expected Results:**
- [ ] Entry is NOT deleted
- [ ] Dialog closes
- [ ] Entry remains visible

---

## Empty State Tests

### No Entries in Timeline

**Scenario:** Timeline exists but has no entries yet

**Setup:**
- Timeline with `entryCount: 0`

**Expected Results:**
- [ ] Shows empty canvas with message "No entries yet"
- [ ] If owned: Shows "Add your first entry" CTA
- [ ] Timeline title and metadata still visible
- [ ] Not a blank or broken UI

### No Favorited Timelines

**Scenario:** User has no favorited timelines

**Setup:**
- User has not favorited any timelines

**Expected Results:**
- [ ] "Favorited" tab shows count (0)
- [ ] Empty state: "No favorited timelines"
- [ ] Helpful text: "Click the star on any timeline to favorite it"

### No Owned Timelines

**Scenario:** User has not created any timelines

**Setup:**
- User owns zero timelines

**Expected Results:**
- [ ] "Owned" tab shows count (0)
- [ ] Empty state: "No timelines yet"
- [ ] CTA: "Create your first timeline"

---

## Component Interaction Tests

### TimelineCard

**Renders correctly:**
- [ ] Displays timeline title prominently
- [ ] Shows owner name and avatar
- [ ] Shows entry count (e.g., "42 entries")
- [ ] Shows date range (e.g., "1939 - 1945")
- [ ] Shows top tags as badges
- [ ] Shows thumbnail if available

**User interactions:**
- [ ] Clicking card calls `onSelectTimeline` with timeline ID
- [ ] Clicking star icon calls `onToggleFavorite`
- [ ] Star is filled if timeline is favorited
- [ ] Hover shows subtle shadow/scale effect

### CategoryTabs

**Renders correctly:**
- [ ] Shows all four tabs: All, Public, Favorited, Owned
- [ ] Shows count next to each tab name
- [ ] Active tab has indigo background

**User interactions:**
- [ ] Clicking tab calls `onFilterCategory` with category
- [ ] Only one tab can be active at a time

### EntryDetailPanel

**Renders correctly:**
- [ ] Shows entry title as heading
- [ ] Shows formatted date
- [ ] Renders markdown content
- [ ] Shows media if present (image, link, document)
- [ ] Shows applied tags as badges

**User interactions:**
- [ ] Close button closes panel
- [ ] Edit button visible only on owned timelines
- [ ] Delete button visible only on owned timelines

---

## Edge Cases

- [ ] Handles timelines with 1 entry and 1000+ entries
- [ ] Handles very long timeline titles (truncates appropriately)
- [ ] Handles entries with no tags applied
- [ ] Handles entries with long content (scrollable detail panel)
- [ ] Preserves scroll position when filtering
- [ ] Transition: First entry added → empty state disappears
- [ ] Transition: Last entry deleted → empty state appears

---

## Accessibility Checks

- [ ] All buttons have accessible names
- [ ] Timeline cards are keyboard navigable
- [ ] Tag filter dropdown is keyboard accessible
- [ ] Entry detail panel can be closed with Escape
- [ ] Focus is trapped in modals/dialogs
- [ ] Color contrast meets WCAG AA

---

## Sample Test Data

```typescript
// Example timeline for testing
const mockTimeline = {
  id: "timeline-1",
  title: "World War II",
  description: "Major events of the Second World War",
  owner: { id: "user-1", name: "John Doe", avatarUrl: null },
  entryCount: 42,
  dateRange: { start: "1939-09-01", end: "1945-09-02" },
  topTags: ["Military", "Europe", "Pacific"],
  thumbnailUrl: null,
  isPublic: true,
  isOwned: false,
  timelineEntries: []
};

// Example entry for testing
const mockEntry = {
  id: "entry-1",
  title: "D-Day Invasion",
  date: "1944-06-06",
  content: "Allied forces land on the beaches of Normandy...",
  contentType: "text",
  mediaUrl: null,
  creator: { id: "user-1", name: "John Doe" },
  isShared: true
};

// Empty state testing
const mockEmptyTimeline = {
  ...mockTimeline,
  entryCount: 0,
  timelineEntries: []
};
```

---

## Notes for Test Implementation

- Mock API calls for timeline and entry CRUD operations
- Test optimistic UI updates where applicable
- Verify loading states during async operations
- Test zoom functionality with mock gestures/scroll
- Ensure responsive behavior is tested on mobile viewports
