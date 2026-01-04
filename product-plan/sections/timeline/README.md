# Timeline

## Overview

The Timeline section is the core experience for browsing, selecting, and exploring timelines. Users start by browsing available timelines (public, favorited, and their own) displayed as rich preview cards, then drill into an interactive zoomable timeline view where they can explore entries at varying levels of detail and manage their own content.

## User Flows

- Browse timelines across categories (public, favorited, own) with filtering to find specific timelines
- Select a timeline to enter the interactive timeline view
- Toggle between horizontal (desktop default) and vertical (mobile default) orientation
- Zoom in/out on the timeline to reveal progressive detail (tags when zoomed out, individual entries when zoomed in)
- Click on tags at zoomed-out level to zoom into entries with that tag
- Filter timeline entries by tags using a filter UI
- Click an entry to open a side panel with full details
- Add, edit, and delete entries on owned timelines

## Design Decisions

- **Two-stage navigation:** Users first browse/select a timeline, then explore its contents
- **Progressive disclosure:** Zoom level controls how much detail is shown
- **Card-based browsing:** Rich preview cards show key info at a glance
- **Side panel details:** Entry details appear in a side panel to maintain timeline context

## Data Used

**Entities:**
- `Timeline` — The collection being browsed/viewed
- `Entry` — Individual events on the timeline
- `Tag` — Labels for organizing entries
- `User` — Current user and timeline owners

**Key Relationship:** Entries can appear on multiple timelines. Tags are applied per-timeline, not globally to entries.

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `TimelineBrowser` — Grid of timeline cards with category tabs and search
- `TimelineCard` — Preview card for a single timeline
- `CategoryTabs` — Tabs for All/Public/Favorited/Owned filtering
- `TimelineViewer` — Main timeline viewing experience
- `TimelineCanvas` — Zoomable timeline visualization
- `EntryNode` — Single entry rendered on the canvas
- `EntryDetailPanel` — Side panel showing full entry details
- `TagFilter` — Multi-select tag filter
- `TimeRangeSelector` — Navigate to specific date ranges
- `EntryTooltip` — Hover tooltip for entries

## Callback Props

| Callback | Description |
|----------|-------------|
| `onSelectTimeline` | Called when user clicks a timeline card |
| `onToggleFavorite` | Called when user favorites/unfavorites a timeline |
| `onFilterCategory` | Called when user changes category tab |
| `onSearchTimelines` | Called when user types in search |
| `onChangeOrientation` | Called when user toggles horizontal/vertical |
| `onZoom` | Called when user zooms in/out |
| `onFilterByTags` | Called when user changes tag filter |
| `onSelectEntry` | Called when user clicks an entry |
| `onCreateEntry` | Called when user clicks add entry |
| `onEditEntry` | Called when user clicks edit on entry |
| `onDeleteEntry` | Called when user clicks delete on entry |
| `onUpdateEntryTags` | Called when user changes entry's tags |
