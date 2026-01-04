# Discovery

## Overview

Discovery provides a ChatGPT-style AI interface for querying timeline data using natural language. Users can ask questions about their entries, and the AI responds with text and citations linking to specific entries. Sessions can be saved for later recall.

## User Flows

- Enter a natural language prompt to query timeline data
- View AI responses with inline citations to relevant entries
- Select which timelines to query from (own timelines and/or public timelines) via a header selector
- Copy AI responses to clipboard
- Save entries mentioned in a response to a timeline
- Regenerate a response with the same prompt
- Save the current chat session for later
- Browse and load saved sessions from a sidebar
- Delete saved sessions

## Design Decisions

- **Chat interface:** Familiar ChatGPT-style message bubbles
- **Citations with context:** AI responses include numbered citations with snippets
- **Explicit save:** Sessions aren't saved by default — user chooses to save
- **Source control:** Users can narrow AI queries to specific timelines

## Data Used

**Entities:**
- `ChatMessage` — User prompts and AI responses
- `Citation` — Links to specific entries mentioned in responses
- `SavedSession` — Stored conversation threads
- `QuerySources` — Which timelines to query
- `AvailableSource` — Timelines available for selection

## Visual Reference

See `screenshot.png` for the target UI design.

## Components Provided

- `DiscoveryChat` — Main chat interface with sidebar and message area

## Callback Props

| Callback | Description |
|----------|-------------|
| `onSendMessage` | Called when user submits a new prompt |
| `onRegenerate` | Called when user wants to regenerate last response |
| `onCopyResponse` | Called when user copies a response to clipboard |
| `onSaveEntries` | Called when user saves cited entries to a timeline |
| `onViewEntry` | Called when user clicks a citation to view entry |
| `onSourcesChange` | Called when user changes source selection |
| `onSaveSession` | Called when user saves current session |
| `onLoadSession` | Called when user loads a saved session |
| `onDeleteSession` | Called when user deletes a saved session |
| `onNewSession` | Called when user starts a new conversation |
