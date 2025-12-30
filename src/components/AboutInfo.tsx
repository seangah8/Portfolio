import { useEffect, useRef, useState } from 'react'

interface AboutInfoItem {
  /**
   * Prefer providing up to three images per fact via `images`.
   * `image` is kept for backwards compatibility and will be used as a fallback.
   */
  image?: string
  images?: string[]
  title: string
  description: string
}

interface AboutInfoProps {
  facts: AboutInfoItem[]
  activeIndex: number | null
  showDescription: boolean
}

export function AboutInfo({
  facts,
  activeIndex,
  showDescription
}: AboutInfoProps) {
  const [typedText, setTypedText] = useState('')
  const [seenFactIndices, setSeenFactIndices] = useState<Set<number>>(
    () => new Set()
  )

  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value))

  const randBetween = (min: number, max: number) =>
    min + Math.random() * (max - min)

  // Generate 3 random positions; if any two are too close, generate again.
  // Distance is calculated in percentage space (left/top are % within `__images-row`).
  const generate3RandomPlaces = () => {
    // Matches `.about-info__image-wrapper { width: 28% }`
    // and approximate 4:3 aspect ratio (28 * 3/4 = 21).
    const BOX_W = 28
    const BOX_H = 21

    // Keep centers away from edges to reduce clipping.
    const LEFT_MIN = BOX_W / 2 + 2
    const LEFT_MAX = 100 - (BOX_W / 2 + 2)
    const TOP_MIN = BOX_H / 2 + 2
    const TOP_MAX = 100 - (BOX_H / 2 + 2)

    // Increase to force more separation between images.
    const MIN_DISTANCE = 50

    const isTooClose = (
      a: { left: number; top: number },
      b: { left: number; top: number }
    ) => {
      const dx = a.left - b.left
      const dy = a.top - b.top
      return Math.hypot(dx, dy) < MIN_DISTANCE
    }

    let last: Array<{ left: number; top: number; x: number; y: number }> = []
    const MAX_ATTEMPTS = 100

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const places = Array.from({ length: 3 }, () => {
        const left = clamp(randBetween(LEFT_MIN, LEFT_MAX), LEFT_MIN, LEFT_MAX)
        const top = clamp(randBetween(TOP_MIN, TOP_MAX), TOP_MIN, TOP_MAX)
        // Small pixel jitter just for "organic" feel (not part of distance check)
        const x = randBetween(-18, 18)
        const y = randBetween(-18, 18)
        return { left, top, x, y }
      })

      const [a, b, c] = places
      if (
        !isTooClose(a, b) &&
        !isTooClose(a, c) &&
        !isTooClose(b, c)
      ) {
        return places
      }

      last = places
    }

    // Fallback if we couldn't find a perfect layout quickly.
    return last
  }

  // Pre-generate stable random rotations for up to three images per fact.
  // We keep them in a ref so they are created only once on mount and
  // do NOT change when the active fact changes.
  const imageRotationsRef = useRef<number[][] | null>(null)
  if (
    !imageRotationsRef.current ||
    imageRotationsRef.current.length !== facts.length
  ) {
    imageRotationsRef.current = facts.map(() =>
      Array.from({ length: 3 }, () => {
        const sign = Math.random() < 0.5 ? -1 : 1
        const magnitude = 10 + Math.random() * 20 // 10–30 degrees
        return sign * magnitude
      })
    )
  }
  const imageRotations = imageRotationsRef.current

  // Pre-generate stable random positions for up to three images per fact.
  // Like rotations, these are created only once and then kept stable.
  const imagePositionsRef = useRef<
    Array<Array<{ left: number; top: number; x: number; y: number }>> | null
  >(null)
  if (
    !imagePositionsRef.current ||
    imagePositionsRef.current.length !== facts.length
  ) {
    imagePositionsRef.current = facts.map(() => generate3RandomPlaces())
  }
  const imagePositions = imagePositionsRef.current

  // Track which items are leaving when scrolling up, so we can reverse-stagger their exit
  const [leavingIndex, setLeavingIndex] = useState<number | null>(null)
  const prevActiveIndexRef = useRef<number | null>(null)

  useEffect(() => {
    const prev = prevActiveIndexRef.current
    prevActiveIndexRef.current = activeIndex

    if (prev === null || activeIndex === null) {
      setLeavingIndex(null)
      return
    }

    // If scrolling backwards (to a smaller index), mark the previous item as leaving
    if (activeIndex < prev) {
      setLeavingIndex(prev)
      // Clear the leaving state after the animation completes
      const timeoutId = setTimeout(() => setLeavingIndex(null), 700)
      return () => clearTimeout(timeoutId)
    } else {
      setLeavingIndex(null)
    }
  }, [activeIndex])

  useEffect(() => {
    if (!showDescription || activeIndex === null) {
      setTypedText('')
      return
    }

    const fullText = facts[activeIndex]?.description || ''
    if (!fullText) {
      setTypedText('')
      return
    }

    // If the user has already visited this fact before, skip the typewriter
    // animation and show the full description immediately.
    if (seenFactIndices.has(activeIndex)) {
      setTypedText(fullText)
      return
    }

    // Mark as seen the first time we show it, so future visits are instant.
    setSeenFactIndices(prev => {
      const next = new Set(prev)
      next.add(activeIndex)
      return next
    })

    setTypedText('')
    let index = 0

    const intervalId = window.setInterval(() => {
      index += 1
      setTypedText(fullText.slice(0, index))

      if (index >= fullText.length) {
        window.clearInterval(intervalId)
      }
    }, 20) // 0.02s per character for a smooth typewriter effect

    return () => {
      window.clearInterval(intervalId)
    }
    // Intentionally omit `seenFactIndices` from deps:
    // we update it inside this effect, and we don't want that update to re-run
    // the effect and short-circuit the first-time typewriter animation.
  }, [showDescription, activeIndex, facts])

  return (
    <div className="about-info">
      {facts.map((fact, index) => {
        const rotations = imageRotations[index] || []
        const positions = imagePositions[index] || []

        // Prefer the new `images` array, but gracefully fall back to the old `image` field
        const rawImages =
          fact.images && fact.images.length > 0
            ? fact.images
            : fact.image
              ? [fact.image]
              : []

        const images = rawImages.slice(0, 3)

        const isActive = activeIndex !== null && index <= activeIndex
        const isLeaving = leavingIndex !== null && index === leavingIndex

        return (
          <div
            key={index}
            className={
              'about-info__item' +
              (isActive ? ' about-info__item--active' : '') +
              (isLeaving ? ' about-info__item--leaving' : '')
            }
          >
            <div className="about-info__images-row">
              {images.map((imageSrc, imageIndex) => (
                <div
                  key={imageIndex}
                  className="about-info__image-wrapper"
                  style={
                    {
                      '--rotation': `${rotations[imageIndex] || 0}deg`,
                      '--left': `${positions[imageIndex]?.left ?? 50}%`,
                      '--top': `${positions[imageIndex]?.top ?? 50}%`,
                      '--x': `${positions[imageIndex]?.x ?? 0}px`,
                      '--y': `${positions[imageIndex]?.y ?? 0}px`
                    } as React.CSSProperties
                  }
                >
                  <img
                    src={imageSrc}
                    alt={`${fact.title} ${imageIndex + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}
      {showDescription && activeIndex !== null && (
        <div className="description-area">
          <p>{typedText}</p>
        </div>
      )}
    </div>
  )
}