'use client'

import { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import type { Entry, Tag, ResolvedTimelineEntry } from '../types'

interface TimelineCanvasProps {
  entries: ResolvedTimelineEntry[]
  timeRange: { start: number; end: number }
  selectedTagIds: string[]
  hoveredEntryId: string | null
  selectedEntryId: string | null
  onHoverEntry?: (entryId: string | null) => void
  onSelectEntry?: (entryId: string) => void
}

interface Particle {
  id: string
  entry: Entry
  tags: Tag[]
  x: number
  y: number
  targetX: number
  targetY: number
  vx: number
  vy: number
  radius: number
  color: string
  visible: boolean
}

const tagColorHex: Record<string, string> = {
  indigo: '#6366f1',
  cyan: '#06b6d4',
  red: '#ef4444',
  slate: '#64748b',
  amber: '#f59e0b',
  emerald: '#10b981',
  violet: '#8b5cf6',
  blue: '#3b82f6',
  pink: '#ec4899',
  orange: '#f97316',
}

export function TimelineCanvas({
  entries,
  timeRange,
  selectedTagIds,
  hoveredEntryId,
  selectedEntryId,
  onHoverEntry,
  onSelectEntry,
}: TimelineCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)

  // Convert date to timestamp
  const dateToTimestamp = (dateStr: string) => new Date(dateStr).getTime()

  // Map timestamp to x position
  const timestampToX = useCallback(
    (timestamp: number, width: number) => {
      const range = timeRange.end - timeRange.start
      const normalized = (timestamp - timeRange.start) / range
      return normalized * width * 0.9 + width * 0.05 // 5% padding on each side
    },
    [timeRange]
  )

  // Check if entry matches tag filter
  const entryMatchesFilter = useCallback(
    (re: ResolvedTimelineEntry) => {
      if (selectedTagIds.length === 0) return true
      return re.tags.some((tag) => selectedTagIds.includes(tag.id))
    },
    [selectedTagIds]
  )

  // Initialize particles
  const initParticles = useCallback(() => {
    const { width, height } = dimensions
    if (width === 0 || height === 0) return

    // Group entries by year for y-positioning to avoid overlaps
    const yearGroups = new Map<number, ResolvedTimelineEntry[]>()
    entries.forEach((re) => {
      const year = new Date(re.entry.date).getFullYear()
      const group = yearGroups.get(year) || []
      group.push(re)
      yearGroups.set(year, group)
    })

    particlesRef.current = entries.map((re) => {
      const timestamp = dateToTimestamp(re.entry.date)
      const year = new Date(re.entry.date).getFullYear()
      const yearGroup = yearGroups.get(year) || []
      const indexInGroup = yearGroup.indexOf(re)
      const groupOffset = (indexInGroup - (yearGroup.length - 1) / 2) * 20

      const targetX = timestampToX(timestamp, width)
      const targetY = height / 2 + groupOffset + (Math.random() - 0.5) * 30
      const visible = entryMatchesFilter(re)
      const primaryTag = re.tags[0]
      const color = primaryTag ? tagColorHex[primaryTag.color] || tagColorHex.slate : tagColorHex.slate

      // Start from random position for initial animation
      const startX = Math.random() * width
      const startY = Math.random() * height

      return {
        id: re.entry.id,
        entry: re.entry,
        tags: re.tags,
        x: startX,
        y: startY,
        targetX,
        targetY: visible ? targetY : height + 100, // Off-screen if filtered out
        vx: 0,
        vy: 0,
        radius: visible ? 8 : 6,
        color,
        visible,
      }
    })
  }, [dimensions, entries, timestampToX, entryMatchesFilter])

  // Update particle targets when filter or time range changes
  useEffect(() => {
    const { width, height } = dimensions
    if (width === 0 || height === 0) return

    particlesRef.current.forEach((particle) => {
      const re = entries.find((e) => e.entry.id === particle.id)
      if (!re) return

      const timestamp = dateToTimestamp(re.entry.date)
      const visible = entryMatchesFilter(re)

      particle.targetX = timestampToX(timestamp, width)
      particle.visible = visible

      if (!visible) {
        // Animate off screen
        particle.targetY = height + 100
        particle.radius = 6
      } else {
        // Find y position avoiding overlaps
        const year = new Date(re.entry.date).getFullYear()
        const sameYearParticles = particlesRef.current.filter((p) => {
          const pYear = new Date(p.entry.date).getFullYear()
          return pYear === year && p.visible && p.id !== particle.id
        })
        const offset = sameYearParticles.length * 15
        particle.targetY = height / 2 + (Math.random() - 0.5) * 60 + offset * (Math.random() - 0.5)
        particle.radius = 8
      }
    })
  }, [dimensions, entries, selectedTagIds, timeRange, timestampToX, entryMatchesFilter])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      const { width, height } = dimensions
      if (width === 0 || height === 0) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Draw timeline axis
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.3)'
      ctx.lineWidth = 1
      ctx.moveTo(width * 0.05, height / 2)
      ctx.lineTo(width * 0.95, height / 2)
      ctx.stroke()

      // Draw year markers
      const startYear = new Date(timeRange.start).getFullYear()
      const endYear = new Date(timeRange.end).getFullYear()
      const yearSpan = endYear - startYear
      const yearStep = yearSpan > 100 ? 50 : yearSpan > 50 ? 10 : yearSpan > 20 ? 5 : 1

      ctx.font = '11px Inter, sans-serif'
      ctx.fillStyle = 'rgba(100, 116, 139, 0.6)'
      ctx.textAlign = 'center'

      for (let year = Math.ceil(startYear / yearStep) * yearStep; year <= endYear; year += yearStep) {
        const timestamp = new Date(year, 0, 1).getTime()
        const x = timestampToX(timestamp, width)

        // Draw tick
        ctx.beginPath()
        ctx.moveTo(x, height / 2 - 5)
        ctx.lineTo(x, height / 2 + 5)
        ctx.stroke()

        // Draw year label
        ctx.fillText(year.toString(), x, height / 2 + 20)
      }

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Spring physics for smooth animation
        const dx = particle.targetX - particle.x
        const dy = particle.targetY - particle.y
        const spring = 0.08
        const damping = 0.75

        particle.vx = (particle.vx + dx * spring) * damping
        particle.vy = (particle.vy + dy * spring) * damping
        particle.x += particle.vx
        particle.y += particle.vy

        // Only draw if on screen
        if (particle.y > height + 50) return

        const isHovered = particle.id === hoveredEntryId
        const isSelected = particle.id === selectedEntryId
        const radius = isHovered || isSelected ? particle.radius * 1.5 : particle.radius

        // Glow effect for hovered/selected
        if (isHovered || isSelected) {
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, radius * 2
          )
          gradient.addColorStop(0, particle.color + '60')
          gradient.addColorStop(1, particle.color + '00')
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, radius * 2, 0, Math.PI * 2)
          ctx.fillStyle = gradient
          ctx.fill()
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Ring for selected
        if (isSelected) {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, radius + 4, 0, Math.PI * 2)
          ctx.strokeStyle = particle.color
          ctx.lineWidth = 2
          ctx.stroke()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, hoveredEntryId, selectedEntryId, timeRange, timestampToX])

  // Initialize on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Initialize particles when dimensions are set
  useEffect(() => {
    if (dimensions.width > 0 && dimensions.height > 0) {
      initParticles()
    }
  }, [dimensions.width, dimensions.height, entries, initParticles])

  // Handle mouse move for hover detection
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePos({ x, y })

    // Find closest visible particle within threshold
    let closest: Particle | null = null
    let closestDist = 30 // Hover radius threshold

    particlesRef.current.forEach((particle) => {
      if (!particle.visible) return
      const dist = Math.sqrt((particle.x - x) ** 2 + (particle.y - y) ** 2)
      if (dist < closestDist) {
        closest = particle
        closestDist = dist
      }
    })

    onHoverEntry?.(closest?.id || null)
  }

  const handleMouseLeave = () => {
    setMousePos(null)
    onHoverEntry?.(null)
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find clicked particle
    let clicked: Particle | null = null
    let closestDist = 20

    particlesRef.current.forEach((particle) => {
      if (!particle.visible) return
      const dist = Math.sqrt((particle.x - x) ** 2 + (particle.y - y) ** 2)
      if (dist < closestDist) {
        clicked = particle
        closestDist = dist
      }
    })

    if (clicked) {
      onSelectEntry?.(clicked.id)
    }
  }

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
    </div>
  )
}
