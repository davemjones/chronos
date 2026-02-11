import type { SavedSession, CurrentSession, AvailableSource } from '@/types'

export const discoverySavedSessions: SavedSession[] = [
  {
    id: 'session-001',
    title: 'Computing pioneers research',
    createdAt: '2024-01-15T10:30:00Z',
    lastMessageAt: '2024-01-15T11:45:00Z',
    messageCount: 8,
    preview: 'Who were the key figures in early computing?',
  },
  {
    id: 'session-002',
    title: 'Space race timeline',
    createdAt: '2024-01-12T14:20:00Z',
    lastMessageAt: '2024-01-12T15:10:00Z',
    messageCount: 6,
    preview: 'Compare the US and Soviet space programs',
  },
  {
    id: 'session-003',
    title: 'Internet origins',
    createdAt: '2024-01-10T09:15:00Z',
    lastMessageAt: '2024-01-10T09:45:00Z',
    messageCount: 4,
    preview: 'How did ARPANET become the internet?',
  },
  {
    id: 'session-004',
    title: 'Renaissance connections',
    createdAt: '2024-01-08T16:00:00Z',
    lastMessageAt: '2024-01-08T16:30:00Z',
    messageCount: 3,
    preview: 'What architectural innovations came from the Renaissance?',
  },
]

export const discoveryCurrentSession: CurrentSession = {
  id: 'session-current',
  isSaved: false,
  sources: { type: 'owned' },
  messages: [
    {
      id: 'msg-001',
      role: 'user',
      content: 'What were the most significant computing breakthroughs of the 20th century?',
      timestamp: '2024-01-18T14:30:00Z',
    },
    {
      id: 'msg-002',
      role: 'assistant',
      content:
        "Based on your timeline data, several breakthroughs stand out as transformative:\n\n**1. The Theoretical Foundation (1936)**\nAlan Turing's Universal Machine concept [1] established the mathematical basis for all modern computing. His paper \"On Computable Numbers\" defined what could and couldn't be computed.\n\n**2. The First Electronic Computers (1945)**\nENIAC [2] represented the leap from mechanical to electronic computation, capable of 5,000 additions per second\u2014revolutionary for its time.\n\n**3. The Transistor Revolution (1947)**\nThe invention of the transistor [3] at Bell Labs made computers smaller, faster, and more reliable, eventually enabling personal computing.\n\n**4. The Personal Computer Era (1977)**\nThe Apple II [4] brought computing to homes and small businesses, democratizing access to technology.\n\n**5. The World Wide Web (1989)**\nTim Berners-Lee's proposal [5] transformed the internet from a research tool into a global information platform.\n\nWould you like me to explore any of these in more detail?",
      timestamp: '2024-01-18T14:30:15Z',
      citations: [
        {
          id: 'cite-001',
          index: 1,
          entryId: 'entry-001',
          entryTitle: "Alan Turing's Universal Machine",
          entryDate: '1936-11-12',
          snippet:
            'Alan Turing published On Computable Numbers, introducing the concept of the Turing Machine',
        },
        {
          id: 'cite-002',
          index: 2,
          entryId: 'entry-002',
          entryTitle: 'ENIAC: The First General-Purpose Computer',
          entryDate: '1945-12-10',
          snippet:
            'The Electronic Numerical Integrator and Computer was completed at the University of Pennsylvania',
        },
        {
          id: 'cite-003',
          index: 3,
          entryId: 'entry-003',
          entryTitle: 'The First Transistor',
          entryDate: '1947-12-23',
          snippet:
            'Bell Labs scientists demonstrated the first working transistor',
        },
        {
          id: 'cite-004',
          index: 4,
          entryId: 'entry-007',
          entryTitle: 'Apple II Released',
          entryDate: '1977-06-10',
          snippet:
            'Apple released the Apple II, one of the first successful mass-produced personal computers',
        },
        {
          id: 'cite-005',
          index: 5,
          entryId: 'entry-008',
          entryTitle: 'World Wide Web Invented',
          entryDate: '1989-03-12',
          snippet:
            'Tim Berners-Lee submitted a proposal at CERN titled Information Management: A Proposal',
        },
      ],
    },
    {
      id: 'msg-003',
      role: 'user',
      content: "Tell me more about the transistor's impact",
      timestamp: '2024-01-18T14:32:00Z',
    },
    {
      id: 'msg-004',
      role: 'assistant',
      content:
        "The transistor's invention in 1947 [1] was arguably the most important technological breakthrough of the century. Here's why it mattered so much:\n\n**The Problem with Vacuum Tubes**\nBefore transistors, computers like ENIAC [2] used vacuum tubes\u2014glass bulbs that were large, fragile, generated enormous heat, and failed frequently. ENIAC alone used 18,000 vacuum tubes and required constant maintenance.\n\n**What Transistors Changed**\n- **Size**: A transistor was tiny compared to a vacuum tube\n- **Reliability**: Solid-state devices don't burn out like tubes\n- **Power**: Used far less electricity and generated less heat\n- **Speed**: Could switch on and off much faster\n\n**The Path to Modern Computing**\nThe transistor enabled the integrated circuit, which led to microprocessors. Without it, the smartphone in your pocket would need to be the size of a building.\n\nThe three inventors\u2014Bardeen, Brattain, and Shockley\u2014received the Nobel Prize in Physics in 1956 for this work.",
      timestamp: '2024-01-18T14:32:20Z',
      citations: [
        {
          id: 'cite-006',
          index: 1,
          entryId: 'entry-003',
          entryTitle: 'The First Transistor',
          entryDate: '1947-12-23',
          snippet:
            'This tiny semiconductor device would eventually replace vacuum tubes, making computers smaller, faster, and more reliable',
        },
        {
          id: 'cite-007',
          index: 2,
          entryId: 'entry-002',
          entryTitle: 'ENIAC: The First General-Purpose Computer',
          entryDate: '1945-12-10',
          snippet:
            'Weight: 30 tons, Size: 1,800 square feet, Power: 150 kilowatts',
        },
      ],
    },
  ],
}

export const discoveryAvailableSources: AvailableSource[] = [
  {
    id: 'timeline-001',
    title: 'History of Computing',
    owner: 'Alex Morgan',
    isOwned: true,
    isPublic: false,
    entryCount: 9,
  },
  {
    id: 'timeline-004',
    title: 'Renaissance Art & Architecture',
    owner: 'Alex Morgan',
    isOwned: true,
    isPublic: true,
    entryCount: 1,
  },
  {
    id: 'timeline-005',
    title: 'Empty Research Timeline',
    owner: 'Alex Morgan',
    isOwned: true,
    isPublic: false,
    entryCount: 0,
  },
  {
    id: 'timeline-002',
    title: 'Space Exploration Milestones',
    owner: 'Dr. Sarah Chen',
    isOwned: false,
    isPublic: true,
    entryCount: 4,
  },
  {
    id: 'timeline-003',
    title: 'World War II Key Events',
    owner: 'Prof. James Harrison',
    isOwned: false,
    isPublic: true,
    entryCount: 2,
  },
]
