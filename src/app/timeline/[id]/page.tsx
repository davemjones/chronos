'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { TimelineViewer } from '@/components/timeline'
import { sampleTimelines, sampleEntries, sampleCurrentUser } from '@/data/sample-data'
import { notFound } from 'next/navigation'

export default function TimelineDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const timeline = sampleTimelines.find((t) => t.id === id)

  if (!timeline) {
    notFound()
  }

  const isOwned = timeline.owner.id === sampleCurrentUser.id

  return (
    <TimelineViewer
      timeline={timeline}
      entries={sampleEntries}
      isOwned={isOwned}
      onBack={() => router.push('/')}
      onCreateEntry={() => console.log('Create entry')}
      onEditEntry={(entryId) => console.log('Edit entry:', entryId)}
      onDeleteEntry={(entryId) => console.log('Delete entry:', entryId)}
      onUpdateEntryTags={(entryId, tagIds) =>
        console.log('Update entry tags:', entryId, tagIds)
      }
    />
  )
}
