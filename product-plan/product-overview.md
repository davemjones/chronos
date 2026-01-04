# Chronos — Product Overview

## Summary

Chronos is a collaborative timeline application that allows users to curate and visualize events across any topic. Users can add, tag, and filter entries while leveraging AI-powered natural language queries to discover hidden relationships and insights across their collected knowledge.

### Key Problems Solved

1. **Scattered Knowledge** — Provides a unified timeline view where users can aggregate historical events, personal notes, and mixed media in one place.

2. **Difficulty Finding Patterns** — Natural language AI queries let users ask questions across all their data to surface connections they might otherwise miss.

3. **Rigid Information Silos** — A flexible tagging and filtering system lets users organize and slice data by any dimension they choose.

4. **Collaboration Friction** — Timeline-based visibility allows users to share specific timelines while keeping others private, making collaboration intuitive.

## Planned Sections

1. **Timeline** — The core view for visualizing and managing timeline entries with rich content. Users browse available timelines, then drill into an interactive zoomable canvas to explore entries at varying levels of detail.

2. **Curate** — Query and refine data across sources with flexible filtering, bulk tag operations, and saved queries. Enables users to build collections from multiple timelines.

3. **Discovery** — AI-powered natural language queries to surface hidden patterns and connections. ChatGPT-style interface with citations linking to specific entries.

4. **Collaboration** — Timeline-based visibility controls and multi-user sharing. Manage permissions, create invite links, and control who can view or clone your content.

## Data Model

**Entities:**
- **User** — A person who creates entries, manages timelines, and maintains their own vocabulary of tags
- **Timeline** — A curated collection of entries owned by a user with configurable visibility
- **Entry** — An individual event or note with rich content (text, images, links, documents) and a date
- **Tag** — A label belonging to a user for organizing entries within their timelines

**Key Relationships:**
- User has many Timelines and Entries (as creator)
- Timeline has many Entries (many-to-many)
- Timeline-Entry link has many Tags (each timeline maintains independent tags for an entry)
- Entry data is never duplicated — only the tagging context differs per timeline

## Design System

**Colors:**
- Primary: `indigo` — Used for buttons, links, key accents
- Secondary: `amber` — Used for tags, highlights, secondary elements
- Neutral: `slate` — Used for backgrounds, text, borders

**Typography:**
- Heading: `Space Grotesk` — Used for headings and navigation items
- Body: `Inter` — Used for body text and UI labels
- Mono: `JetBrains Mono` — Used for code and technical content

## Implementation Sequence

Build this product in milestones:

1. **Foundation** — Set up design tokens, data model types, routing structure, and application shell
2. **Timeline** — Core timeline browsing and viewing experience
3. **Curate** — Query building, filtering, and bulk tag operations
4. **Discovery** — AI chat interface with citations and saved sessions
5. **Collaboration** — Visibility controls, permissions, and invite links

Each milestone has a dedicated instruction document in `product-plan/instructions/`.
