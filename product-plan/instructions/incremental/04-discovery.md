# Milestone 4: Discovery

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestones 1-3 (Foundation, Timeline, Curate) complete

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

Implement the Discovery section — an AI-powered chat interface for querying timeline data using natural language.

## Overview

Discovery provides a ChatGPT-style interface where users can ask questions about their timeline data. The AI responds with text answers and citations linking to specific entries. Users can save chat sessions for later reference, copy responses, and save mentioned entries to timelines.

**Key Functionality:**
- Enter natural language prompts to query timeline data
- View AI responses with inline citations to relevant entries
- Select which timelines to query from (own and/or public)
- Copy AI responses to clipboard
- Save entries mentioned in a response to a timeline
- Regenerate responses with the same prompt
- Save and load chat sessions

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/discovery/tests.md` for detailed test-writing instructions including:
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

Copy the section components from `product-plan/sections/discovery/components/`:

- `DiscoveryChat.tsx` — Main chat interface with sidebar and message area

### Data Layer

The components expect these data shapes:

```typescript
type QuerySources =
  | { type: 'all' }
  | { type: 'owned' }
  | { type: 'public' }
  | { type: 'specific'; timelineIds: string[] }

interface Citation {
  id: string
  index: number  // Display index [1], [2], etc.
  entryId: string
  entryTitle: string
  entryDate: string
  snippet: string  // Relevant text from the entry
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  citations?: Citation[]  // Only on assistant messages
}

interface SavedSession {
  id: string
  title: string
  createdAt: string
  lastMessageAt: string
  messageCount: number
  preview: string  // First user message
}

interface CurrentSession {
  id: string
  isSaved: boolean
  sources: QuerySources
  messages: ChatMessage[]
}
```

You'll need to:
- Integrate with an AI service (OpenAI, Anthropic, etc.) for natural language queries
- Implement retrieval-augmented generation (RAG) to search relevant entries
- Generate citations linking to specific entries
- Store and retrieve chat sessions

### Callbacks

Wire up these user actions:

| Callback | Description |
|----------|-------------|
| `onSendMessage` | Submit a new prompt to the AI |
| `onRegenerate` | Regenerate the last AI response |
| `onCopyResponse` | Copy AI response text to clipboard |
| `onSaveEntries` | Save cited entries to a timeline |
| `onViewEntry` | Navigate to view a cited entry |
| `onSourcesChange` | Change which timelines to query |
| `onSaveSession` | Save the current chat session |
| `onLoadSession` | Load a saved session |
| `onDeleteSession` | Delete a saved session |
| `onNewSession` | Start a fresh conversation |

### Empty States

Implement empty state UI for when no records exist yet:

- **New conversation:** Show welcome message with example prompts
- **No saved sessions:** Show message explaining sessions aren't saved by default
- **No citations in response:** Show response without citation section
- **Loading state:** Show typing indicator while AI is generating

## Files to Reference

- `product-plan/sections/discovery/README.md` — Feature overview and design intent
- `product-plan/sections/discovery/tests.md` — Test-writing instructions (use for TDD)
- `product-plan/sections/discovery/components/` — React components
- `product-plan/sections/discovery/types.ts` — TypeScript interfaces
- `product-plan/sections/discovery/sample-data.json` — Test data
- `product-plan/sections/discovery/screenshot.png` — Visual reference

## Expected User Flows

When fully implemented, users should be able to complete these flows:

### Flow 1: Ask a Question

1. User opens Discovery section
2. User (optionally) selects which timelines to query
3. User types a natural language question in the input
4. User presses Enter or clicks Send
5. **Outcome:** AI response appears with citations to relevant entries

### Flow 2: Explore Citations

1. User sees AI response with numbered citations [1], [2], etc.
2. User hovers over a citation to see snippet
3. User clicks a citation
4. **Outcome:** Entry detail view opens showing the full entry

### Flow 3: Save Mentioned Entries

1. User has an AI response with useful citations
2. User clicks "Save Entries" on the response
3. User selects which cited entries to save
4. User chooses or creates a timeline
5. **Outcome:** Selected entries are added to the timeline

### Flow 4: Save and Load Sessions

1. User has a valuable conversation
2. User clicks "Save" in the session controls
3. Session appears in the sidebar
4. Later, user clicks on the saved session in sidebar
5. **Outcome:** Full conversation is restored with all messages

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Chat interface renders user and AI messages
- [ ] Natural language queries return relevant responses
- [ ] Citations link to actual entries in the system
- [ ] Source selector changes which data is queried
- [ ] Copy, regenerate, and save entries actions work
- [ ] Sessions can be saved, loaded, and deleted
- [ ] Empty states display properly (welcome screen, no sessions)
- [ ] Loading state shows while AI is generating
- [ ] Matches the visual design (see screenshots)
- [ ] Responsive on mobile
