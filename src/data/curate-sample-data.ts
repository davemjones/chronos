import type { SavedQuery, AvailableSource, TagWithCount } from '@/types'

export const curateSavedQueries: SavedQuery[] = [
  {
    id: 'query-001',
    name: 'Computing Milestones 1980-2000',
    description: 'Key computing breakthroughs from the PC era to the dot-com boom',
    createdAt: '2024-01-15T10:30:00Z',
    lastUsedAt: '2024-01-18T14:22:00Z',
    filters: {
      sources: { type: 'specific', timelineIds: ['timeline-001'] },
      tags: ['Computing', 'Milestone'],
      dateRange: { start: '1980-01-01', end: '2000-12-31' },
      textSearch: null,
    },
  },
  {
    id: 'query-002',
    name: 'Space & Computing Crossover',
    description: 'Entries from both Space Exploration and History of Computing timelines',
    createdAt: '2024-01-14T09:15:00Z',
    lastUsedAt: '2024-01-17T11:45:00Z',
    filters: {
      sources: { type: 'specific', timelineIds: ['timeline-001', 'timeline-002'] },
      tags: ['Technology'],
      dateRange: null,
      textSearch: null,
    },
  },
  {
    id: 'query-003',
    name: 'All Public Timelines',
    description: 'Browse all entries from public timelines',
    createdAt: '2024-01-12T16:00:00Z',
    lastUsedAt: '2024-01-16T09:30:00Z',
    filters: {
      sources: { type: 'public' },
      tags: [],
      dateRange: null,
      textSearch: null,
    },
  },
  {
    id: 'query-004',
    name: 'My Data + WWII Timeline',
    description: "All my timelines combined with Prof. Harrison's WWII timeline",
    createdAt: '2024-01-10T11:20:00Z',
    lastUsedAt: '2024-01-12T15:10:00Z',
    filters: {
      sources: { type: 'mixed', includeOwned: true, publicTimelineIds: ['timeline-003'] },
      tags: [],
      dateRange: { start: '1939-09-01', end: '1950-12-31' },
      textSearch: null,
    },
  },
  {
    id: 'query-005',
    name: 'All My Timelines',
    description: 'Search across all timelines I own',
    createdAt: '2024-01-08T08:45:00Z',
    lastUsedAt: '2024-01-14T10:00:00Z',
    filters: {
      sources: { type: 'owned' },
      tags: [],
      dateRange: null,
      textSearch: null,
    },
  },
  {
    id: 'query-006',
    name: 'Everything Everywhere',
    description: 'Query all available data - owned and public',
    createdAt: '2024-01-05T14:30:00Z',
    lastUsedAt: '2024-01-18T10:00:00Z',
    filters: {
      sources: { type: 'all' },
      tags: [],
      dateRange: null,
      textSearch: 'Moon',
    },
  },
]

export const curateAvailableSources: AvailableSource[] = [
  { id: 'timeline-001', title: 'History of Computing', owner: 'Alex Morgan', isOwned: true, isPublic: false, entryCount: 9 },
  { id: 'timeline-004', title: 'Renaissance Art & Architecture', owner: 'Alex Morgan', isOwned: true, isPublic: true, entryCount: 1 },
  { id: 'timeline-005', title: 'Empty Research Timeline', owner: 'Alex Morgan', isOwned: true, isPublic: false, entryCount: 0 },
  { id: 'timeline-002', title: 'Space Exploration Milestones', owner: 'Dr. Sarah Chen', isOwned: false, isPublic: true, entryCount: 4 },
  { id: 'timeline-003', title: 'World War II Key Events', owner: 'Prof. James Harrison', isOwned: false, isPublic: true, entryCount: 2 },
]

export const curateAvailableTags: TagWithCount[] = [
  { id: 'tag-am-001', name: 'Computing', color: 'cyan', count: 5 },
  { id: 'tag-am-002', name: 'Invention', color: 'amber', count: 5 },
  { id: 'tag-am-003', name: 'Milestone', color: 'emerald', count: 6 },
  { id: 'tag-am-004', name: 'Internet', color: 'indigo', count: 2 },
  { id: 'tag-am-005', name: 'Art', color: 'pink', count: 1 },
  { id: 'tag-am-006', name: 'Architecture', color: 'slate', count: 1 },
  { id: 'tag-sc-001', name: 'Space', color: 'violet', count: 3 },
  { id: 'tag-sc-002', name: 'NASA', color: 'blue', count: 2 },
  { id: 'tag-sc-003', name: 'Soviet', color: 'red', count: 1 },
  { id: 'tag-sc-004', name: 'Moon', color: 'slate', count: 1 },
  { id: 'tag-sc-005', name: 'Technology', color: 'cyan', count: 2 },
  { id: 'tag-sc-006', name: 'Breakthrough', color: 'amber', count: 3 },
  { id: 'tag-jh-001', name: 'Military', color: 'slate', count: 2 },
  { id: 'tag-jh-003', name: 'Europe', color: 'blue', count: 1 },
  { id: 'tag-jh-005', name: 'Turning Point', color: 'amber', count: 2 },
]
