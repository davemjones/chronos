# Curate

## Overview

The Curate section enables users to query entries across their own data and public timelines using flexible filters (tags, date ranges, source selection, text search). Results display in a table view where users can select entries to perform bulk tag operations or save as new timelines. Users can also save query configurations for reuse.

## User Flows

- Build a query by selecting source timelines (own data and/or public timelines)
- Filter entries by tags, date range, and/or text search
- View results in a table showing entry title, date, and tags
- Select entries using checkboxes (individual selection or select all/none)
- Refine selection by adjusting filters while maintaining manual selections
- Add or remove tags from selected entries in bulk
- Save all query results or just selected entries as a new timeline
- Save query configurations for later reuse

## Design Decisions

- **Multi-source queries:** Users can query across their own timelines, public timelines, or specific selections
- **Bulk operations:** Efficient tag management for many entries at once
- **Saved queries:** Frequently used query configurations can be saved and reloaded
- **Selection persistence:** Manual selections are preserved when filters change

## Data Used

**Entities:**
- `QueryFilters` — Source selection, tags, date range, text search
- `QueryResultEntry` — Entry data with selection state
- `SavedQuery` — Stored query configurations
- `AvailableSource` — Timelines available for querying
- `Tag` — Available tags for filtering

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `CurateBrowser` — Main curate interface with query builder and results table

## Callback Props

| Callback | Description |
|----------|-------------|
| `onSourcesChange` | Called when user updates source selection |
| `onTagsChange` | Called when user updates tag filters |
| `onDateRangeChange` | Called when user updates date range |
| `onTextSearchChange` | Called when user updates text search |
| `onRunQuery` | Called when user runs the query |
| `onClearFilters` | Called when user clears all filters |
| `onToggleSelect` | Called when user toggles single entry selection |
| `onSelectAll` | Called when user selects all entries |
| `onSelectNone` | Called when user deselects all entries |
| `onAddTags` | Called when user bulk adds tags |
| `onRemoveTags` | Called when user bulk removes tags |
| `onSaveAsTimeline` | Called when user saves selection as timeline |
| `onSaveQuery` | Called when user saves query configuration |
| `onLoadQuery` | Called when user loads a saved query |
| `onDeleteQuery` | Called when user deletes a saved query |
