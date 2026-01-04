# Milestone 2: Timeline

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete

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

Implement the Timeline section — the core experience for browsing, selecting, and exploring timelines with their entries.

## Overview

The Timeline section is the heart of Chronos. Users start by browsing available timelines displayed as rich preview cards (showing title, owner, entry count, date range, and top tags), then drill into an interactive zoomable timeline view where they can explore entries at varying levels of detail.

**Key Functionality:**
- Browse timelines across categories (public, favorited, owned) with filtering
- Select a timeline to enter the interactive timeline viewer
- Zoom in/out to reveal progressive detail (tags when zoomed out, entries when zoomed in)
- Filter timeline entries by tags
- Click entries to view full details in a side panel
- Add, edit, and delete entries on owned timelines

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/timeline/tests.md` for detailed test-writing instructions including:
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

Copy the section components from `product-plan/sections/timeline/components/`:

- `TimelineBrowser.tsx` — Grid of timeline cards with category tabs and search
- `TimelineCard.tsx` — Preview card for a single timeline
- `CategoryTabs.tsx` — Tabs for All/Public/Favorited/Owned filtering
- `TimelineViewer.tsx` — Main timeline viewing experience
- `TimelineCanvas.tsx` — Zoomable timeline visualization
- `EntryNode.tsx` — Single entry on the timeline canvas
- `EntryDetailPanel.tsx` — Side panel showing full entry details
- `TagFilter.tsx` — Filter entries by tags
- `TimeRangeSelector.tsx` — Navigate to specific date ranges
- `EntryTooltip.tsx` — Hover tooltip for entries

### Data Layer

The components expect these data shapes:

```typescript
interface Timeline {
  id: string
  title: string
  description: string
  owner: UserReference
  entryCount: number
  dateRange: { start: string | null; end: string | null }
  topTags: string[]
  thumbnailUrl: string | null
  isPublic: boolean
  isOwned: boolean
  timelineEntries: TimelineEntry[]
}

interface Entry {
  id: string
  title: string
  date: string
  content: string  // Markdown-formatted
  contentType: 'text' | 'image' | 'link' | 'document'
  mediaUrl: string | null
  creator: UserReference
  isShared: boolean
}

interface TimelineEntry {
  entryId: string
  tags: Tag[]  // Tags applied by timeline owner
}
```

You'll need to:
- Create API endpoints to fetch timelines and entries
- Implement timeline browsing with category filtering
- Resolve timeline entries with their applied tags
- Handle entry CRUD operations for owned timelines

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onSelectTimeline` | Navigate to timeline viewer when card is clicked |
| `onToggleFavorite` | Add/remove timeline from user's favorites |
| `onFilterCategory` | Filter timeline list by category |
| `onSearchTimelines` | Filter timeline list by search query |
| `onChangeOrientation` | Toggle between horizontal/vertical layout |
| `onZoom` | Update zoom level on timeline canvas |
| `onFilterByTags` | Filter visible entries by selected tags |
| `onSelectEntry` | Open entry detail panel |
| `onCreateEntry` | Open entry creation form (owned timelines) |
| `onEditEntry` | Open entry edit form (owned timelines) |
| `onDeleteEntry` | Delete entry with confirmation (owned timelines) |
| `onUpdateEntryTags` | Update tags applied to an entry on this timeline |

### Empty States

Implement empty state UI for when no records exist yet:

- **No timelines yet:** Show welcome message and CTA to create first timeline
- **No entries in timeline:** Show empty canvas with prompt to add entries
- **No search results:** Show "No timelines match your search" with clear option
- **No favorited timelines:** Show message explaining how to favorite

## Files to Reference

- `product-plan/sections/timeline/README.md` — Feature overview and design intent
- `product-plan/sections/timeline/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/timeline/components/` — React components
- `product-plan/sections/timeline/types.ts` — TypeScript interfaces
- `product-plan/sections/timeline/sample-data.json` — Test data
- `product-plan/sections/timeline/screenshot.png` — Visual reference

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: Browse and Select a Timeline

1. User lands on Timeline section, sees grid of timeline cards
2. User clicks category tabs (All/Public/Favorited/Owned) to filter
3. User optionally searches for a specific timeline
4. User clicks on a timeline card
5. **Outcome:** Timeline viewer opens showing the selected timeline's entries

### Flow 2: Explore Timeline Entries

1. User is viewing a timeline in the timeline viewer
2. User zooms in/out to see more or less detail
3. User clicks on tags (when zoomed out) to filter entries
4. User clicks an entry to open the detail panel
5. **Outcome:** Entry detail panel shows full content with media

### Flow 3: Add an Entry (Owned Timeline)

1. User is viewing their own timeline
2. User clicks "Add Entry" button
3. User fills in entry details (title, date, content, media)
4. User clicks "Save"
5. **Outcome:** New entry appears on the timeline, success message shown

### Flow 4: Edit/Delete an Entry

1. User clicks on an entry they own
2. User clicks "Edit" or "Delete" in the detail panel
3. For edit: User modifies fields and saves
4. For delete: User confirms deletion
5. **Outcome:** Entry is updated/removed, UI reflects changes

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Timeline browser shows all available timelines
- [ ] Category tabs filter timelines correctly
- [ ] Search filters timelines by title/description
- [ ] Timeline viewer renders entries on interactive canvas
- [ ] Zoom controls work smoothly
- [ ] Tag filtering narrows visible entries
- [ ] Entry detail panel shows full content
- [ ] Entry CRUD works for owned timelines
- [ ] Empty states display properly when no records exist
- [ ] Matches the visual design (see screenshots)
- [ ] Responsive on mobile (vertical orientation default)
