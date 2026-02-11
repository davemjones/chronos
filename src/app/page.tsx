'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { TimelineBrowser } from '@/components/timeline'
import { sampleCurrentUser, sampleTimelines } from '@/data/sample-data'
import type { User, Timeline } from '@/types'

export default function TimelinePage() {
  const router = useRouter()

  // Local state for favorites (would be persisted to backend later)
  const [currentUser, setCurrentUser] = useState<User>(() => ({ ...sampleCurrentUser }))

  const handleSelectTimeline = useCallback(
    (timelineId: string) => {
      router.push(`/timeline/${timelineId}`)
    },
    [router]
  )

  const handleToggleFavorite = useCallback((timelineId: string) => {
    setCurrentUser((prev) => {
      const favIds = new Set(prev.favoriteTimelines?.map((t) => t.id) || [])
      if (favIds.has(timelineId)) {
        return {
          ...prev,
          favoriteTimelines: prev.favoriteTimelines?.filter((t) => t.id !== timelineId) || [],
        }
      } else {
        const timeline = sampleTimelines.find((t) => t.id === timelineId)
        if (!timeline) return prev
        return {
          ...prev,
          favoriteTimelines: [...(prev.favoriteTimelines || []), timeline],
        }
      }
    })
  }, [])

  return (
    <TimelineBrowser
      currentUser={currentUser}
      timelines={sampleTimelines}
      onSelectTimeline={handleSelectTimeline}
      onToggleFavorite={handleToggleFavorite}
    />
  )
}
