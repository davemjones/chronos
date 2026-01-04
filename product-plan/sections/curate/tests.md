# Test Instructions: Curate

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

The Curate section enables users to query entries across multiple sources, perform bulk tag operations, and save results as new timelines. Test the query building, filtering, selection, and bulk actions.

---

## User Flow Tests

### Flow 1: Build and Run a Query

**Scenario:** User creates a query to find specific entries

#### Success Path

**Setup:**
- User has owned timelines with entries
- Public timelines exist with entries

**Steps:**
1. User navigates to `/curate`
2. User selects source: "My Timelines"
3. User adds tag filter: "Technology"
4. User sets date range: 1990-01-01 to 2000-12-31
5. User clicks "Search" (or query auto-runs)

**Expected Results:**
- [ ] Source selector shows options: All, My Timelines, Public, Specific
- [ ] Tag selector shows available tags with counts
- [ ] Date range picker accepts valid dates
- [ ] Results table populates with matching entries
- [ ] Results count shown (e.g., "24 entries found")

#### Failure Path: No Results

**Setup:**
- Filters match no entries

**Expected Results:**
- [ ] Shows "No entries match your filters"
- [ ] Suggests "Try adjusting your filters"
- [ ] Shows "Clear filters" option

---

### Flow 2: Select Entries

**Scenario:** User selects entries for bulk operations

#### Success Path

**Setup:**
- Query results showing multiple entries

**Steps:**
1. User clicks checkbox on first entry
2. User clicks checkbox on third entry
3. User clicks "Select All" button
4. User clicks "Select None" button

**Expected Results:**
- [ ] Individual checkbox toggles selection state
- [ ] Selected count updates (e.g., "2 selected")
- [ ] "Select All" selects all visible entries
- [ ] "Select None" clears all selections
- [ ] Selected rows have visual highlight

---

### Flow 3: Bulk Add Tags

**Scenario:** User adds tags to multiple entries at once

#### Success Path

**Setup:**
- Multiple entries selected

**Steps:**
1. User has 5 entries selected
2. User clicks "Add Tags" in bulk actions toolbar
3. User selects tags: "Important", "Review"
4. User clicks "Apply"

**Expected Results:**
- [ ] Bulk action toolbar appears when entries selected
- [ ] Tag selector shows available tags
- [ ] Success message: "Tags added to 5 entries"
- [ ] Table updates to show new tags on entries

#### Failure Path: No Selection

**Setup:**
- No entries selected

**Expected Results:**
- [ ] "Add Tags" button is disabled
- [ ] Tooltip explains "Select entries first"

---

### Flow 4: Bulk Remove Tags

**Scenario:** User removes tags from multiple entries

#### Success Path

**Setup:**
- Multiple entries selected, all have "Draft" tag

**Steps:**
1. User selects entries with "Draft" tag
2. User clicks "Remove Tags"
3. User selects "Draft" tag
4. User clicks "Remove"

**Expected Results:**
- [ ] Only shows tags present on selected entries
- [ ] Success message: "Tags removed from X entries"
- [ ] Table updates to reflect removed tags

---

### Flow 5: Save Results as New Timeline

**Scenario:** User saves query results as a new timeline

#### Success Path

**Setup:**
- Query results with some entries selected

**Steps:**
1. User has query results displayed
2. User selects specific entries (or uses all)
3. User clicks "Save as Timeline"
4. User enters name: "My Research Collection"
5. User chooses "Selected entries only"
6. User clicks "Create"

**Expected Results:**
- [ ] Modal prompts for timeline name
- [ ] Option to save "All results" or "Selected only"
- [ ] Success message: "Timeline created with X entries"
- [ ] Option to navigate to new timeline

---

### Flow 6: Save Query Configuration

**Scenario:** User saves a query for reuse

#### Success Path

**Setup:**
- User has configured a useful query

**Steps:**
1. User has filters configured
2. User clicks "Save Query"
3. User enters name: "Tech Events 1990s"
4. User enters description: "Technology milestones"
5. User clicks "Save"

**Expected Results:**
- [ ] Query appears in saved queries sidebar
- [ ] Shows name and last used date
- [ ] Query configuration is preserved

---

### Flow 7: Load Saved Query

**Scenario:** User loads a previously saved query

#### Success Path

**Setup:**
- Saved queries exist in sidebar

**Steps:**
1. User clicks on saved query "Tech Events 1990s"
2. Query loads and runs

**Expected Results:**
- [ ] All filters restore to saved values
- [ ] Query automatically executes
- [ ] Results display based on saved filters
- [ ] "Last used" timestamp updates

---

### Flow 8: Delete Saved Query

**Scenario:** User removes a saved query

#### Success Path

**Steps:**
1. User hovers over saved query
2. User clicks delete icon
3. User confirms deletion

**Expected Results:**
- [ ] Confirmation prompt appears
- [ ] Query removed from sidebar
- [ ] Current filters unchanged

---

## Empty State Tests

### No Query Results

**Scenario:** Filters match no entries

**Setup:**
- Restrictive filters that match nothing

**Expected Results:**
- [ ] Shows "No entries match your filters"
- [ ] Helpful message: "Try broadening your search"
- [ ] "Clear filters" button available
- [ ] Not a blank or broken table

### No Saved Queries

**Scenario:** User has no saved queries yet

**Setup:**
- No saved queries exist

**Expected Results:**
- [ ] Sidebar shows "No saved queries"
- [ ] Helpful text: "Save a query to quickly run it again"

### No Sources Selected

**Scenario:** User hasn't selected any sources

**Setup:**
- Source selection is empty

**Expected Results:**
- [ ] Shows prompt to select sources
- [ ] Search button disabled or shows message
- [ ] Clear guidance on next step

---

## Component Interaction Tests

### Source Selector

**Renders correctly:**
- [ ] Shows radio options: All, My Timelines, Public
- [ ] "Specific" option opens timeline picker
- [ ] Selected source is highlighted

**User interactions:**
- [ ] Changing source calls `onSourcesChange`
- [ ] Selecting "Specific" allows multi-select of timelines

### Tag Filter

**Renders correctly:**
- [ ] Shows available tags with counts
- [ ] Tags sorted by count or alphabetically
- [ ] Selected tags highlighted

**User interactions:**
- [ ] Clicking tag toggles filter
- [ ] Multiple tags use AND logic
- [ ] Clear button removes all tag filters

### Results Table

**Renders correctly:**
- [ ] Columns: checkbox, title, date, tags, source
- [ ] Sortable columns (click header)
- [ ] Pagination or infinite scroll for many results

**User interactions:**
- [ ] Row click can select or expand
- [ ] Checkbox toggles selection
- [ ] Header checkbox selects all

---

## Edge Cases

- [ ] Handles queries returning 1000+ results (pagination)
- [ ] Handles entries with no tags
- [ ] Handles very long entry titles (truncate)
- [ ] Preserves selection when filters change
- [ ] Clears selection when sources change significantly
- [ ] Handles date range with start > end (validation error)

---

## Accessibility Checks

- [ ] Table has proper headers and scope
- [ ] Checkboxes have accessible labels
- [ ] Bulk action toolbar is keyboard navigable
- [ ] Filter controls have clear labels
- [ ] Focus management for modals

---

## Sample Test Data

```typescript
// Example query filters
const mockFilters = {
  sources: { type: 'owned' },
  tags: ['tag-1', 'tag-2'],
  dateRange: { start: '1990-01-01', end: '2000-12-31' },
  textSearch: 'technology'
};

// Example query result
const mockResult = {
  id: 'entry-1',
  title: 'World Wide Web Invented',
  date: '1991-08-06',
  tags: [{ id: 'tag-1', name: 'Technology', color: 'blue' }],
  sourceTimeline: 'Tech History',
  isSelected: false
};

// Empty state testing
const mockEmptyResults = [];

const mockNoSavedQueries = [];

// Bulk operation testing
const mockSelectedEntries = ['entry-1', 'entry-2', 'entry-3'];
```

---

## Notes for Test Implementation

- Test filter combinations (tags AND date range AND text)
- Verify selection state persists across filter changes
- Test bulk operations with various selection sizes
- Mock API for save operations (timeline, query)
- Test optimistic updates for tag operations
