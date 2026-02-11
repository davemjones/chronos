'use client'

import { useRef, useState, useCallback, useEffect } from 'react'

interface TimeRangeSelectorProps {
  /** Full range of available dates */
  fullRange: { start: number; end: number }
  /** Currently selected range */
  selectedRange: { start: number; end: number }
  /** Called when range changes */
  onRangeChange?: (range: { start: number; end: number }) => void
}

export function TimeRangeSelector({
  fullRange,
  selectedRange,
  onRangeChange,
}: TimeRangeSelectorProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState<'start' | 'end' | 'range' | null>(null)
  const [dragStart, setDragStart] = useState<{ x: number; startVal: number; endVal: number }>({ x: 0, startVal: 0, endVal: 0 })

  const formatYear = (timestamp: number) => {
    return new Date(timestamp).getFullYear().toString()
  }

  const timestampToPercent = (timestamp: number) => {
    const range = fullRange.end - fullRange.start
    return ((timestamp - fullRange.start) / range) * 100
  }

  const percentToTimestamp = (percent: number) => {
    const range = fullRange.end - fullRange.start
    return fullRange.start + (percent / 100) * range
  }

  const handleMouseDown = (e: React.MouseEvent, type: 'start' | 'end' | 'range') => {
    e.preventDefault()
    setDragging(type)
    setDragStart({
      x: e.clientX,
      startVal: selectedRange.start,
      endVal: selectedRange.end,
    })
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !trackRef.current) return

      const rect = trackRef.current.getBoundingClientRect()
      const deltaX = e.clientX - dragStart.x
      const deltaPercent = (deltaX / rect.width) * 100
      const deltaTime = (deltaPercent / 100) * (fullRange.end - fullRange.start)

      let newStart = selectedRange.start
      let newEnd = selectedRange.end

      if (dragging === 'start') {
        newStart = Math.max(fullRange.start, Math.min(dragStart.startVal + deltaTime, selectedRange.end - 86400000)) // Min 1 day
      } else if (dragging === 'end') {
        newEnd = Math.min(fullRange.end, Math.max(dragStart.endVal + deltaTime, selectedRange.start + 86400000))
      } else if (dragging === 'range') {
        const rangeSize = dragStart.endVal - dragStart.startVal
        newStart = dragStart.startVal + deltaTime
        newEnd = dragStart.endVal + deltaTime

        // Clamp to full range
        if (newStart < fullRange.start) {
          newStart = fullRange.start
          newEnd = fullRange.start + rangeSize
        }
        if (newEnd > fullRange.end) {
          newEnd = fullRange.end
          newStart = fullRange.end - rangeSize
        }
      }

      onRangeChange?.({ start: newStart, end: newEnd })
    },
    [dragging, dragStart, fullRange, selectedRange, onRangeChange]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(null)
  }, [])

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [dragging, handleMouseMove, handleMouseUp])

  const startPercent = timestampToPercent(selectedRange.start)
  const endPercent = timestampToPercent(selectedRange.end)

  // Generate era markers
  const startYear = new Date(fullRange.start).getFullYear()
  const endYear = new Date(fullRange.end).getFullYear()
  const yearSpan = endYear - startYear
  const markerStep = yearSpan > 500 ? 100 : yearSpan > 100 ? 50 : yearSpan > 50 ? 10 : 5
  const markers: number[] = []
  for (let year = Math.ceil(startYear / markerStep) * markerStep; year <= endYear; year += markerStep) {
    markers.push(new Date(year, 0, 1).getTime())
  }

  return (
    <div className="relative">
      {/* Era labels */}
      <div className="mb-2 flex justify-between px-1 text-xs text-slate-400">
        <span>{formatYear(fullRange.start)}</span>
        <span>{formatYear(fullRange.end)}</span>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-12 rounded-lg bg-slate-100 dark:bg-slate-800"
      >
        {/* Year markers */}
        {markers.map((timestamp) => {
          const percent = timestampToPercent(timestamp)
          return (
            <div
              key={timestamp}
              className="absolute top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700"
              style={{ left: `${percent}%` }}
            >
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-slate-400">
                {formatYear(timestamp)}
              </span>
            </div>
          )
        })}

        {/* Selected range highlight */}
        <div
          className={`absolute top-1 bottom-1 rounded-md bg-indigo-500/20 transition-colors ${
            dragging === 'range' ? 'bg-indigo-500/30' : ''
          }`}
          style={{
            left: `${startPercent}%`,
            width: `${endPercent - startPercent}%`,
          }}
          onMouseDown={(e) => handleMouseDown(e, 'range')}
        >
          {/* Inner gradient */}
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-indigo-500/10 via-indigo-500/5 to-indigo-500/10" />
        </div>

        {/* Start handle */}
        <div
          className={`absolute top-0 bottom-0 w-4 cursor-ew-resize ${
            dragging === 'start' ? 'z-20' : 'z-10'
          }`}
          style={{ left: `calc(${startPercent}% - 8px)` }}
          onMouseDown={(e) => handleMouseDown(e, 'start')}
        >
          <div
            className={`mx-auto h-full w-1 rounded-full transition-all ${
              dragging === 'start'
                ? 'w-1.5 bg-indigo-600'
                : 'bg-indigo-500 hover:w-1.5 hover:bg-indigo-600'
            }`}
          />
          {/* Handle grip */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-indigo-500 px-1.5 py-2">
            <div className="flex gap-0.5">
              <div className="h-3 w-0.5 rounded-full bg-white/50" />
              <div className="h-3 w-0.5 rounded-full bg-white/50" />
            </div>
          </div>
        </div>

        {/* End handle */}
        <div
          className={`absolute top-0 bottom-0 w-4 cursor-ew-resize ${
            dragging === 'end' ? 'z-20' : 'z-10'
          }`}
          style={{ left: `calc(${endPercent}% - 8px)` }}
          onMouseDown={(e) => handleMouseDown(e, 'end')}
        >
          <div
            className={`mx-auto h-full w-1 rounded-full transition-all ${
              dragging === 'end'
                ? 'w-1.5 bg-indigo-600'
                : 'bg-indigo-500 hover:w-1.5 hover:bg-indigo-600'
            }`}
          />
          {/* Handle grip */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded bg-indigo-500 px-1.5 py-2">
            <div className="flex gap-0.5">
              <div className="h-3 w-0.5 rounded-full bg-white/50" />
              <div className="h-3 w-0.5 rounded-full bg-white/50" />
            </div>
          </div>
        </div>
      </div>

      {/* Selected range label */}
      <div className="mt-2 flex justify-center">
        <span
          className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {formatYear(selectedRange.start)} — {formatYear(selectedRange.end)}
        </span>
      </div>
    </div>
  )
}
