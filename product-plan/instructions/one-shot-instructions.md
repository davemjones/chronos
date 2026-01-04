# Chronos — Complete Implementation Instructions

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

## Test-Driven Development

Each section includes a `tests.md` file with detailed test-writing instructions. These are **framework-agnostic** — adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, RSpec, Minitest, PHPUnit, etc.).

**For each section:**
1. Read `product-plan/sections/[section-id]/tests.md`
2. Write failing tests for key user flows (success and failure paths)
3. Implement the feature to make tests pass
4. Refactor while keeping tests green

The test instructions include:
- Specific UI elements, button labels, and interactions to verify
- Expected success and failure behaviors
- Empty state handling (when no records exist yet)
- Data assertions and state validations

---

## Product Overview

Chronos is a collaborative timeline application that allows users to curate and visualize events across any topic. Users can add, tag, and filter entries while leveraging AI-powered natural language queries to discover hidden relationships and insights across their collected knowledge.

### Planned Sections

1. **Timeline** — The core view for visualizing and managing timeline entries with rich content
2. **Curate** — Query and refine data across sources with flexible filtering and bulk operations
3. **Discovery** — AI-powered natural language queries with citations to entries
4. **Collaboration** — Timeline-based visibility controls and multi-user sharing

### Data Model

**Core Entities:**
- **User** — Person who creates entries, manages timelines, and maintains tags
- **Timeline** — Curated collection of entries with configurable visibility
- **Entry** — Individual event/note with rich content and date
- **Tag** — Label for organizing entries (user-scoped, applied per-timeline)

**Key Relationship:** Entries exist independently and can appear on multiple timelines. Tags are applied per-timeline context, not stored on entries.

### Design System

- **Primary:** `indigo` — buttons, links, active states
- **Secondary:** `amber` — tags, highlights, accents
- **Neutral:** `slate` — backgrounds, borders, text
- **Headings:** Space Grotesk
- **Body:** Inter
- **Mono:** JetBrains Mono

---

# Milestone 1: Foundation

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/types.ts` for interface definitions
- See `product-plan/data-model/README.md` for entity relationships

**Core Entities:**
- `User` — id, name, avatarUrl, tags (personal vocabulary)
- `Timeline` — id, title, description, owner, entryCount, dateRange, visibility, timelineEntries
- `Entry` — id, title, date, content, contentType, mediaUrl, creator, isShared
- `Tag` — id, name, color

### 3. Routing Structure

| Route | Section | Description |
|-------|---------|-------------|
| `/` | Timeline | Default view — timeline browser |
| `/timeline/:id` | Timeline | Single timeline viewer |
| `/curate` | Curate | Query builder and results |
| `/discovery` | Discovery | AI chat interface |
| `/collaboration` | Collaboration | Sharing and permissions |

### 4. Application Shell

Copy the shell components from `product-plan/shell/components/`:

- `AppShell.tsx` — Main layout wrapper
- `MainNav.tsx` — Navigation component
- `UserMenu.tsx` — User avatar and dropdown

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Entity types and relationships
- `product-plan/shell/` — Shell components

## Done When

- [ ] Design tokens configured
- [ ] Data model types defined
- [ ] Database schema matches entities
- [ ] Routes exist for all sections
- [ ] Shell renders with navigation
- [ ] Responsive layout works

---

# Milestone 2: Timeline

## Goal

Implement the core timeline browsing and viewing experience.

## Overview

Users browse available timelines displayed as rich preview cards, then drill into an interactive zoomable timeline view where they can explore entries at varying levels of detail.

**Key Functionality:**
- Browse timelines across categories (public, favorited, owned)
- Select a timeline to enter the interactive viewer
- Zoom in/out to reveal progressive detail
- Filter entries by tags
- View entry details in a side panel
- Add, edit, delete entries on owned timelines

## Components

- `TimelineBrowser.tsx` — Grid of timeline cards with category tabs
- `TimelineCard.tsx` — Preview card for a single timeline
- `TimelineViewer.tsx` — Main timeline viewing experience
- `TimelineCanvas.tsx` — Zoomable timeline visualization
- `EntryNode.tsx` — Single entry on canvas
- `EntryDetailPanel.tsx` — Side panel for entry details
- `TagFilter.tsx` — Filter by tags

## Key Callbacks

| Callback | Description |
|----------|-------------|
| `onSelectTimeline` | Navigate to timeline viewer |
| `onToggleFavorite` | Add/remove from favorites |
| `onSelectEntry` | Open entry detail panel |
| `onCreateEntry` | Create new entry |
| `onEditEntry` | Edit existing entry |
| `onDeleteEntry` | Delete entry |

## Files to Reference

- `product-plan/sections/timeline/README.md`
- `product-plan/sections/timeline/tests.md`
- `product-plan/sections/timeline/components/`
- `product-plan/sections/timeline/types.ts`
- `product-plan/sections/timeline/sample-data.json`

---

# Milestone 3: Curate

## Goal

Implement query building, filtering, and bulk tag operations.

## Overview

Users build queries by selecting source timelines and applying filters. Results display in a table where users can perform bulk operations and save results.

**Key Functionality:**
- Select source timelines (own, public, specific)
- Filter by tags, date range, text search
- Select entries individually or in bulk
- Add/remove tags from selections
- Save results as new timeline
- Save query configurations for reuse

## Components

- `CurateBrowser.tsx` — Main curate interface

## Key Callbacks

| Callback | Description |
|----------|-------------|
| `onSourcesChange` | Update source selection |
| `onRunQuery` | Execute query |
| `onToggleSelect` | Toggle entry selection |
| `onAddTags` | Bulk add tags |
| `onRemoveTags` | Bulk remove tags |
| `onSaveAsTimeline` | Save selection as timeline |
| `onSaveQuery` | Save query configuration |

## Files to Reference

- `product-plan/sections/curate/README.md`
- `product-plan/sections/curate/tests.md`
- `product-plan/sections/curate/components/`
- `product-plan/sections/curate/types.ts`
- `product-plan/sections/curate/sample-data.json`

---

# Milestone 4: Discovery

## Goal

Implement AI-powered natural language queries with citations.

## Overview

ChatGPT-style interface where users ask questions about timeline data. AI responds with text and citations linking to specific entries.

**Key Functionality:**
- Enter natural language prompts
- View responses with inline citations
- Select which timelines to query
- Copy responses, regenerate, save entries
- Save and load chat sessions

## Components

- `DiscoveryChat.tsx` — Main chat interface

## Key Callbacks

| Callback | Description |
|----------|-------------|
| `onSendMessage` | Submit prompt |
| `onRegenerate` | Regenerate response |
| `onCopyResponse` | Copy to clipboard |
| `onSaveEntries` | Save cited entries |
| `onViewEntry` | Navigate to entry |
| `onSaveSession` | Save chat session |
| `onLoadSession` | Load saved session |

## Files to Reference

- `product-plan/sections/discovery/README.md`
- `product-plan/sections/discovery/tests.md`
- `product-plan/sections/discovery/components/`
- `product-plan/sections/discovery/types.ts`
- `product-plan/sections/discovery/sample-data.json`

---

# Milestone 5: Collaboration

## Goal

Implement visibility controls, permissions, and sharing.

## Overview

Users manage timeline visibility (public/private), grant access to specific users with permissions, and create shareable invite links.

**Key Functionality:**
- Toggle visibility (public/private)
- Grant access by email with permission levels
- Create invite links with expiration/limits
- View all permissions in dashboard
- Revoke access or change permissions

## Components

- `CollaborationBrowser.tsx` — Timeline list with sharing controls
- `PermissionsDashboard.tsx` — Central permissions view

## Key Callbacks

| Callback | Description |
|----------|-------------|
| `onToggleVisibility` | Switch public/private |
| `onGrantAccess` | Grant by email |
| `onRevokeAccess` | Remove access |
| `onChangePermission` | Change permission level |
| `onCreateInviteLink` | Generate link |
| `onCopyInviteLink` | Copy link |

## Files to Reference

- `product-plan/sections/collaboration/README.md`
- `product-plan/sections/collaboration/tests.md`
- `product-plan/sections/collaboration/components/`
- `product-plan/sections/collaboration/types.ts`
- `product-plan/sections/collaboration/sample-data.json`

---

# Implementation Complete

When all milestones are done, verify:

- [ ] All sections functional with real data
- [ ] Authentication and authorization working
- [ ] All CRUD operations work correctly
- [ ] Empty states display for new users
- [ ] Error handling and loading states
- [ ] Responsive design on all devices
- [ ] Dark mode support (optional)
- [ ] All tests passing
