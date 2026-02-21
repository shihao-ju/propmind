'use client'

import { useRef, useEffect, useState, type ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right'

interface FadeInProps {
  children: ReactNode
  delay?: number
  direction?: Direction
  duration?: number
  threshold?: number
  className?: string
}

const directionOffset: Record<Direction, { x: string; y: string }> = {
  up: { x: '0', y: '20px' },
  down: { x: '0', y: '-20px' },
  left: { x: '20px', y: '0' },
  right: { x: '-20px', y: '0' },
}

export default function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  duration = 600,
  threshold = 0.15,
  className = '',
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const offset = directionOffset[direction]

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'translate(0, 0)'
          : `translate(${offset.x}, ${offset.y})`,
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}
