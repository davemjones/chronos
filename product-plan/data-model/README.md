# Data Model

## Overview

Chronos uses a flexible data model designed around the concept that entries exist independently and can appear on multiple timelines with different tags applied in each context.

## Entities

### User

A person who creates entries, manages timelines, and maintains their own vocabulary of tags.

**Fields:**
- `id` — Unique identifier
- `name` — Display name
- `avatarUrl` — Profile image URL (optional)
- `tags` — User's personal tag vocabulary

### Timeline

A curated collection of entries owned by a user. Timeline owners control which entries appear on their timeline, including entries created by other users.

**Fields:**
- `id` — Unique identifier
- `title` — Timeline name
- `description` — Brief description
- `owner` — User reference (id, name, avatarUrl)
- `entryCount` — Number of entries on timeline
- `dateRange` — Start and end dates of entries
- `topTags` — Preview of most-used tag names
- `thumbnailUrl` — Preview image (optional)
- `isPublic` — Visibility setting
- `isOwned` — Whether current user owns this timeline
- `timelineEntries` — Entry-tag associations

### Entry

An individual event or note with rich content (text, images, links, documents) and a date. Created by a user and optionally made available for others to include on their timelines.

**Fields:**
- `id` — Unique identifier
- `title` — Entry title
- `date` — Event date
- `content` — Markdown-formatted content
- `contentType` — Type: text, image, link, document
- `mediaUrl` — Associated media URL (optional)
- `creator` — User reference
- `isShared` — Whether available for others to include

**Important:** Tags are NOT stored on entries. They are applied per-timeline context via TimelineEntry.

### TimelineEntry

Links an Entry to a Timeline with the timeline owner's tags applied. This join record enables the same entry to appear on multiple timelines with different tags in each context.

**Fields:**
- `entryId` — Reference to the Entry
- `tags` — Tags applied by the timeline owner

### Tag

A label belonging to a user for organizing entries within their timelines. Tags are user-scoped, meaning each user maintains their own tag vocabulary.

**Fields:**
- `id` — Unique identifier
- `name` — Tag name
- `color` — Display color (indigo, cyan, red, slate, amber, emerald, violet, blue, pink, orange)

## Relationships

```
User
├── has many → Timeline (as owner)
├── has many → Entry (as creator)
└── has many → Tag (personal vocabulary)

Timeline
├── belongs to → User (owner)
└── has many → TimelineEntry
    └── has many → Tag (per-entry tags)

Entry
├── belongs to → User (creator)
└── appears on many → Timeline (via TimelineEntry)

Tag
└── belongs to → User (owner)
```

## Key Behaviors

1. **Entries are never duplicated** — When an entry appears on multiple timelines, only the TimelineEntry association is created, not a copy of the entry data.

2. **Tags are context-specific** — Each timeline owner applies their own tags independently. The same entry can have different tags on different timelines.

3. **Sharing preserves ownership** — When entries are shared to other timelines, the original creator remains the owner of the entry data.

4. **User-scoped tags** — Each user maintains their own tag vocabulary. Tags from different users don't conflict even if they have the same name.

## Database Schema Considerations

When implementing:

- Use a join table for Timeline-Entry relationships with a `tags` JSON field or separate tag associations
- Index entries by date for timeline range queries
- Consider full-text search on entry content for Discovery queries
- Cache entry counts and date ranges on Timeline records
