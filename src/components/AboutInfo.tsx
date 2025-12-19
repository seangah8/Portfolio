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

  // Pre-generate stable random rotations for up to three images per fact.
  // We keep them in a ref so they are created only once on mount and
  // do NOT change when the active fact changes.
  const imageRotationsRef = useRef<number[][] | null>(null)
  if (!imageRotationsRef.current) {
    imageRotationsRef.current = facts.map(() =>
      Array.from({ length: 3 }, () => {
        const sign = Math.random() < 0.5 ? -1 : 1
        const magnitude = 10 + Math.random() * 20 // 10–30 degrees
        return sign * magnitude
      })
    )
  }
  const imageRotations = imageRotationsRef.current

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

    setTypedText('')
    let index = 0

    const intervalId = window.setInterval(() => {
      index += 1
      setTypedText(fullText.slice(0, index))

      if (index >= fullText.length) {
        window.clearInterval(intervalId)
      }
    }, 15) // 0.03s per character for a smooth typewriter effect

    return () => {
      window.clearInterval(intervalId)
    }
  }, [showDescription, activeIndex, facts])

  return (
    <div className="about-info">
      {facts.map((fact, index) => {
        const rotations = imageRotations[index] || []

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
                      '--rotation': `${rotations[imageIndex] || 0}deg`
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