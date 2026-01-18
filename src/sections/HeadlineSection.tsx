

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Typewriter from 'typewriter-effect'

const subtitleText = 'Sean Gah - Full Stack Developer'

type HeadlineSectionProps = {
  onIntroComplete?: () => void
}

export function HeadlineSection({ onIntroComplete }: HeadlineSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const leftBracketRef = useRef<HTMLSpanElement | null>(null)
  const letterSRef = useRef<HTMLSpanElement | null>(null)
  const letterGRef = useRef<HTMLSpanElement | null>(null)
  const rightBracketRef = useRef<HTMLSpanElement | null>(null)
  const slashRef = useRef<HTMLSpanElement | null>(null)
  const typewriterRef = useRef<any | null>(null)
  const typewriterContainerRef = useRef<HTMLSpanElement | null>(null)
  const onIntroCompleteRef = useRef<HeadlineSectionProps['onIntroComplete']>(onIntroComplete)

  useEffect(() => {
    onIntroCompleteRef.current = onIntroComplete
  }, [onIntroComplete])

  useEffect(() => {
    const ctx = gsap.context(() => {

      const lettersFromLeft = [
        letterSRef.current,
        leftBracketRef.current,
      ].filter(Boolean) as HTMLSpanElement[]

      const lettersFromRight = [
        letterGRef.current,
        rightBracketRef.current
      ].filter(Boolean) as HTMLSpanElement[]

      const gapLeftGroup = [
        leftBracketRef.current,
        letterSRef.current,
        letterGRef.current
      ].filter(Boolean) as HTMLSpanElement[]

      const rightGroup = [
        rightBracketRef.current
      ].filter(Boolean) as HTMLSpanElement[]

      const slashEl = slashRef.current
      const logoParts = [
        leftBracketRef.current,
        letterSRef.current,
        letterGRef.current,
        slashRef.current,
        rightBracketRef.current
      ].filter(Boolean) as HTMLSpanElement[]

      if (!lettersFromLeft.length || !lettersFromRight.length || !slashEl) {
        return
      }

      const timeline = gsap.timeline()

      timeline.set(logoParts, {
        opacity: 0,
        x: 0,
        y: 0,
        textShadow: 'none',
        filter: 'none'
      })
      timeline.set(slashEl, { x: -80, y: 280, opacity: 0 })

      timeline.fromTo(
        lettersFromLeft,
        { xPercent: -800, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out'
        },
        0
      )
      timeline.fromTo(
        lettersFromRight,
        { xPercent: 800, opacity: 0 },
        {
          xPercent: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out'
        },
        0
      )

      timeline.addLabel('gapOpen')
      timeline.to(
        gapLeftGroup,
        { x: '-=15', duration: 0.2, ease: 'power1.out' },
        'gapOpen+=0.05'
      )
      timeline.to(
        rightGroup,
        { x: '+=15', duration: 0.2, ease: 'power1.out' },
        'gapOpen+=0.05'
      )

      timeline.fromTo(
        slashEl,
        { x: -40, y: 140, opacity: 0 },
        { x: 15, y: -25, opacity: 1, duration: 0.2, ease: 'power3.out' }
      )
      timeline.to(slashEl, {
        x: 0,
        y: 0,
        duration: 0.2,
        ease: 'back.out(3)'
      })
      timeline.to(
        gapLeftGroup,
        { x: '+=15', duration: 0.2, ease: 'power2.out' },
        '-=0.35'
      )
      timeline.to(
        rightGroup,
        { x: '-=15', duration: 0.2, ease: 'power2.out' },
        '<'
      )

      timeline.to(logoParts, {
        textShadow:
          '0 0 8px rgba(0, 217, 255, 0.8), 0 0 20px rgba(0,217,255,0.6), 0 0 36px rgba(0,217,255,0.4)',
        duration: 0.2
      })

      // Start the typewriter subtitle when the logo animation completes
      timeline.eventCallback('onComplete', () => {
        // Reveal the typewriter container
        if (typewriterContainerRef.current) {
          typewriterContainerRef.current.style.visibility = 'visible'
        }

        // Then kick off the typing animation
        if (typewriterRef.current) {
          typewriterRef.current.typeString(subtitleText).start()
        }

        onIntroCompleteRef.current?.()
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="headline-section" ref={sectionRef}>
      <h1 className="headline-logo" aria-label="<SG/>">
        <span className="headline-letter" ref={leftBracketRef}>
          {'<'}
        </span>
        <span className="headline-letter" ref={letterSRef}>
          S
        </span>
        <span className="headline-letter" ref={letterGRef}>
          G
        </span>
        <span className="headline-letter headline-letter-slash" ref={slashRef}>
          /
        </span>
        <span className="headline-letter" ref={rightBracketRef}>
          {'>'}
        </span>
      </h1>
      <p className="headline-subtitle" aria-label={subtitleText}>
        <span ref={typewriterContainerRef} style={{ visibility: 'hidden' }}>
          <Typewriter
            onInit={typewriter => {
              // Store the instance so GSAP can start it when the logo animation ends
              typewriterRef.current = typewriter
            }}
            options={{
              delay: 50,
              cursor: '|',
              autoStart: false
            }}
          />
        </span>
      </p>
    </section>
  )
}