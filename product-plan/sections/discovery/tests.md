# Test Instructions: Discovery

These test-writing instructions are **framework-agnostic**. Adapt them to your testing setup (Jest, Vitest, Playwright, Cypress, React Testing Library, RSpec, Minitest, PHPUnit, etc.).

## Overview

The Discovery section provides an AI chat interface for natural language queries about timeline data. Test the chat experience, citation handling, session management, and source selection.

---

## User Flow Tests

### Flow 1: Ask a Question

**Scenario:** User submits a natural language query

#### Success Path

**Setup:**
- User is logged in
- User has timelines with entries

**Steps:**
1. User navigates to `/discovery`
2. User types: "What were the major tech breakthroughs in the 1990s?"
3. User presses Enter or clicks Send

**Expected Results:**
- [ ] Input area at bottom with placeholder "Ask about your timelines..."
- [ ] User message appears in chat as user bubble (right-aligned)
- [ ] Loading indicator shows while AI processes
- [ ] AI response appears as assistant bubble (left-aligned)
- [ ] Response includes relevant text about 1990s tech

#### Failure Path: API Error

**Setup:**
- AI service returns error

**Expected Results:**
- [ ] Error message appears: "Unable to get a response. Please try again."
- [ ] Retry option available
- [ ] User's message preserved

---

### Flow 2: Explore Citations

**Scenario:** User interacts with citations in AI response

#### Success Path

**Setup:**
- AI response includes citations [1], [2], [3]

**Steps:**
1. User sees response with numbered citations
2. User hovers over citation [1]
3. User clicks citation [1]

**Expected Results:**
- [ ] Citations appear as numbered links [1], [2], etc.
- [ ] Hover shows tooltip with entry title and snippet
- [ ] Click calls `onViewEntry` with entry ID
- [ ] Citations section at end shows full list with details

---

### Flow 3: Copy AI Response

**Scenario:** User copies response to clipboard

#### Success Path

**Steps:**
1. User has AI response displayed
2. User clicks "Copy" button on response

**Expected Results:**
- [ ] Copy button visible on AI messages (not user messages)
- [ ] Click copies text to clipboard
- [ ] Success feedback: button changes to checkmark or "Copied!"
- [ ] Citations formatted appropriately in copied text

---

### Flow 4: Regenerate Response

**Scenario:** User requests new response for same prompt

#### Success Path

**Steps:**
1. User has AI response displayed
2. User clicks "Regenerate" button

**Expected Results:**
- [ ] Regenerate button visible on last AI response
- [ ] Loading indicator shows
- [ ] Previous response replaced with new response
- [ ] May include different citations

---

### Flow 5: Save Mentioned Entries

**Scenario:** User saves cited entries to a timeline

#### Success Path

**Steps:**
1. User has AI response with citations
2. User clicks "Save Entries" button
3. User selects which citations to save
4. User chooses target timeline (or creates new)
5. User clicks "Save"

**Expected Results:**
- [ ] Modal shows list of cited entries with checkboxes
- [ ] User can select which to save
- [ ] Timeline selector shows user's timelines
- [ ] Success message: "X entries saved to [Timeline]"

---

### Flow 6: Change Query Sources

**Scenario:** User changes which timelines AI queries

#### Success Path

**Setup:**
- User has owned and public timelines

**Steps:**
1. User clicks source selector in header
2. User changes from "All" to "My Timelines"
3. User asks a new question

**Expected Results:**
- [ ] Source selector shows current selection
- [ ] Options: All, My Timelines, Public, Specific
- [ ] "Specific" allows selecting individual timelines
- [ ] Subsequent queries use new source selection
- [ ] Context indicator shows active sources

---

### Flow 7: Save Chat Session

**Scenario:** User saves current conversation

#### Success Path

**Steps:**
1. User has conversation with multiple messages
2. User clicks "Save" in session controls
3. Session appears in sidebar

**Expected Results:**
- [ ] Save button in header or controls area
- [ ] Session saved with auto-generated title (from first message)
- [ ] Session appears in sidebar with preview
- [ ] Current session now shows "Saved" indicator

---

### Flow 8: Load Saved Session

**Scenario:** User loads a previously saved conversation

#### Success Path

**Setup:**
- Saved sessions exist in sidebar

**Steps:**
1. User clicks on saved session in sidebar
2. Session loads in main area

**Expected Results:**
- [ ] Full conversation history restored
- [ ] All messages display correctly
- [ ] Citations in old responses still clickable
- [ ] Can continue conversation

---

### Flow 9: Start New Session

**Scenario:** User starts fresh conversation

#### Success Path

**Setup:**
- User has active conversation

**Steps:**
1. User clicks "New Chat" button
2. Conversation area clears

**Expected Results:**
- [ ] Prompt to save if current session unsaved
- [ ] Chat area clears to welcome state
- [ ] New session ID assigned
- [ ] Ready for new conversation

---

### Flow 10: Delete Saved Session

**Scenario:** User removes a saved session

#### Success Path

**Steps:**
1. User hovers over saved session in sidebar
2. User clicks delete icon
3. User confirms deletion

**Expected Results:**
- [ ] Confirmation: "Delete this session?"
- [ ] Session removed from sidebar
- [ ] If viewing deleted session, redirects to new session

---

## Empty State Tests

### New Conversation (Welcome State)

**Scenario:** User starts fresh with no messages

**Setup:**
- New session, no messages yet

**Expected Results:**
- [ ] Welcome message or heading
- [ ] Example prompts shown (clickable suggestions)
- [ ] Clear input area ready for first message
- [ ] Source selector accessible

### No Saved Sessions

**Scenario:** User has no saved conversations

**Setup:**
- No saved sessions exist

**Expected Results:**
- [ ] Sidebar shows "No saved sessions"
- [ ] Helpful text: "Sessions aren't saved automatically"
- [ ] Explains how to save sessions

### Response Without Citations

**Scenario:** AI response doesn't reference specific entries

**Setup:**
- Query is general or no matching entries

**Expected Results:**
- [ ] Response renders without citations section
- [ ] No broken UI from missing citations
- [ ] Response still useful/informative

---

## Component Interaction Tests

### Chat Message (User)

**Renders correctly:**
- [ ] Right-aligned bubble
- [ ] Shows message text
- [ ] Shows timestamp

### Chat Message (Assistant)

**Renders correctly:**
- [ ] Left-aligned bubble
- [ ] Shows AI avatar/icon
- [ ] Renders markdown formatting
- [ ] Citations displayed as clickable links

**User interactions:**
- [ ] Copy button copies text
- [ ] Regenerate visible on last response
- [ ] Save Entries visible if citations present

### Source Selector

**Renders correctly:**
- [ ] Shows current source selection
- [ ] Dropdown or modal for options

**User interactions:**
- [ ] Changing source calls `onSourcesChange`
- [ ] "Specific" opens timeline picker

### Session Sidebar

**Renders correctly:**
- [ ] Lists saved sessions
- [ ] Shows title and preview
- [ ] Shows last message date

**User interactions:**
- [ ] Click loads session
- [ ] Delete icon removes session
- [ ] New Chat button starts fresh

---

## Edge Cases

- [ ] Handles very long AI responses (scrollable)
- [ ] Handles responses with 10+ citations
- [ ] Handles rapid message sending (debounce/queue)
- [ ] Preserves conversation on page refresh (if session saved)
- [ ] Handles session with deleted source timelines
- [ ] Handles AI timeout gracefully

---

## Accessibility Checks

- [ ] Chat messages have proper ARIA roles
- [ ] Input has accessible label
- [ ] Citations are keyboard navigable
- [ ] Loading state announced to screen readers
- [ ] Sidebar navigation keyboard accessible

---

## Sample Test Data

```typescript
// Example chat message (user)
const mockUserMessage = {
  id: 'msg-1',
  role: 'user',
  content: 'What were the major tech breakthroughs in the 1990s?',
  timestamp: '2024-01-15T10:30:00Z'
};

// Example chat message (assistant)
const mockAssistantMessage = {
  id: 'msg-2',
  role: 'assistant',
  content: 'The 1990s saw several major technological breakthroughs. The World Wide Web was invented by Tim Berners-Lee [1]. ...',
  timestamp: '2024-01-15T10:30:15Z',
  citations: [
    {
      id: 'cite-1',
      index: 1,
      entryId: 'entry-www',
      entryTitle: 'World Wide Web Invented',
      entryDate: '1991-08-06',
      snippet: 'Tim Berners-Lee publishes the first website...'
    }
  ]
};

// Example saved session
const mockSavedSession = {
  id: 'session-1',
  title: 'Tech History Questions',
  createdAt: '2024-01-15T10:00:00Z',
  lastMessageAt: '2024-01-15T10:35:00Z',
  messageCount: 6,
  preview: 'What were the major tech breakthroughs...'
};

// Empty state testing
const mockEmptySession = {
  id: 'new-session',
  isSaved: false,
  sources: { type: 'all' },
  messages: []
};
```

---

## Notes for Test Implementation

- Mock AI service responses with realistic delays
- Test streaming responses if implemented
- Verify citation links navigate correctly
- Test session persistence across page loads
- Test with various response lengths and citation counts
