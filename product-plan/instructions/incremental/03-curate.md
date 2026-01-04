# Milestone 3: Curate

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) and Milestone 2 (Timeline) complete

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

Implement the Curate section — enabling users to query entries across their data and public timelines, perform bulk operations, and save query configurations.

## Overview

Curate is the power-user tool for managing and organizing entries across multiple sources. Users build queries by selecting source timelines and applying filters (tags, date ranges, text search). Results display in a table where users can select entries for bulk tag operations or save selections as new timelines.

**Key Functionality:**
- Build queries by selecting source timelines (own, public, or specific timelines)
- Filter entries by tags, date range, and text search
- View results in a sortable table with entry details
- Select entries individually or in bulk
- Add or remove tags from selected entries
- Save query results as a new timeline
- Save and reload query configurations for reuse

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/curate/tests.md` for detailed test-writing instructions including:
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

Copy the section components from `product-plan/sections/curate/components/`:

- `CurateBrowser.tsx` — Main curate interface with query builder and results

### Data Layer

The components expect these data shapes:

```typescript
type QuerySources =
  | { type: 'all' }
  | { type: 'owned' }
  | { type: 'public' }
  | { type: 'specific'; timelineIds: string[] }
  | { type: 'mixed'; includeOwned: boolean; publicTimelineIds: string[] }

interface QueryFilters {
  sources: QuerySources
  tags: string[]  // Tag IDs to filter by (AND logic)
  dateRange: DateRange | null
  textSearch: string | null
}

interface QueryResultEntry {
  id: string
  title: string
  date: string
  tags: Tag[]
  sourceTimeline: string
  isSelected: boolean
}

interface SavedQuery {
  id: string
  name: string
  description: string
  createdAt: string
  lastUsedAt: string | null
  filters: QueryFilters
}
```

You'll need to:
- Create API endpoints to execute queries across timelines
- Implement source selection and filter logic
- Handle bulk tag operations on entries
- Support saving queries and results as timelines

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onSourcesChange` | Update which timelines to query from |
| `onTagsChange` | Update tag filter |
| `onDateRangeChange` | Update date range filter |
| `onTextSearchChange` | Update text search filter |
| `onRunQuery` | Execute the current query |
| `onClearFilters` | Reset all filters to defaults |
| `onToggleSelect` | Toggle selection on a single entry |
| `onSelectAll` | Select all visible entries |
| `onSelectNone` | Deselect all entries |
| `onAddTags` | Add tags to selected entries |
| `onRemoveTags` | Remove tags from selected entries |
| `onSaveAsTimeline` | Save selected entries as new timeline |
| `onSaveQuery` | Save current query configuration |
| `onLoadQuery` | Load a saved query |
| `onDeleteQuery` | Delete a saved query |

### Empty States

Implement empty state UI for when no records exist yet:

- **No query results:** Show "No entries match your filters" with suggestions
- **No saved queries:** Show message explaining how to save queries
- **No sources selected:** Prompt user to select at least one source
- **No selections for bulk action:** Disable bulk action buttons with tooltip

## Files to Reference

- `product-plan/sections/curate/README.md` — Feature overview and design intent
- `product-plan/sections/curate/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/curate/components/` — React components
- `product-plan/sections/curate/types.ts` — TypeScript interfaces
- `product-plan/sections/curate/sample-data.json` — Test data
- `product-plan/sections/curate/screenshot.png` — Visual reference

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: Build and Run a Query

1. User opens Curate section
2. User selects source timelines (e.g., "My Timelines" + specific public timelines)
3. User adds tag filters and/or date range
4. User optionally enters text search
5. User clicks "Search" or query runs automatically
6. **Outcome:** Results table shows matching entries with their details

### Flow 2: Bulk Tag Operation

1. User has query results displayed
2. User selects multiple entries using checkboxes
3. User clicks "Add Tags" in the bulk actions toolbar
4. User selects tags to add from dropdown
5. User confirms the action
6. **Outcome:** Selected entries now have the new tags applied

### Flow 3: Save Results as Timeline

1. User has query results with some entries selected
2. User clicks "Save as Timeline"
3. User enters a name for the new timeline
4. User chooses "Selected entries" or "All results"
5. User clicks "Create"
6. **Outcome:** New timeline created with the chosen entries, user can navigate to it

### Flow 4: Save and Load Queries

1. User has configured a useful query
2. User clicks "Save Query"
3. User enters name and optional description
4. User clicks "Save"
5. Later, user returns and loads the saved query from the sidebar
6. **Outcome:** Filters are restored and query runs with same configuration

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Source selector allows choosing owned/public/specific timelines
- [ ] Tag, date range, and text filters work correctly
- [ ] Results table shows matching entries
- [ ] Entry selection works (individual and bulk)
- [ ] Bulk tag add/remove operations work
- [ ] Save as timeline creates new timeline with entries
- [ ] Saved queries can be created, loaded, and deleted
- [ ] Empty states display properly when no records exist
- [ ] Matches the visual design (see screenshots)
- [ ] Responsive on mobile
