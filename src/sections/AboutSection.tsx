import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const myselfRef = useRef<HTMLSpanElement | null>(null)

  const funFacts = [
    'Fun fact 1',
    'Fun fact 2',
    'Fun fact 3',
    'Fun fact 4',
    'Fun fact 5',
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !titleRef.current) return

      // Tween that we drive manually based on scroll progress
      const titleTween = gsap.fromTo(
        titleRef.current,
        { fontSize: '2rem' },
        { fontSize: '8rem', paused: true }
      )

      // Get list items and prepare them for reveal + pinned animation
      const items = gsap.utils.toArray<HTMLElement>('.about-fact')
      let revealTween: gsap.core.Tween | null = null
      let hasRevealed = false

      if (items.length) {
        gsap.set(items, { opacity: 0, y: 20, x: 0 })
        revealTween = gsap.to(items, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          paused: true
        })
      }

      let maxProgress = 0

      // Ensure the 'Myself' span starts centered (no horizontal offset)
      if (myselfRef.current) {
        gsap.set(myselfRef.current, { x: 0 })
      }

      // ScrollTrigger that drives the title + reveal logic
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'top top',
        onUpdate: self => {
          // Only ever move the tween forward; never back
          maxProgress = Math.max(maxProgress, self.progress)
          titleTween.progress(maxProgress)

          // When we've fully scrolled into the section once,
          // reveal the list from top to bottom, only once.
          if (!hasRevealed && maxProgress >= 0.99 && revealTween) {
            hasRevealed = true
            revealTween.play()
          }
        }
      })

      // Separate ScrollTrigger to "lock" the section in place (pin)
      // after it has filled the viewport, for some extra scroll distance.
      // While pinned, scroll only decides WHICH element is active:
      // - slot 0: 'Myself' word in the title slides right
      // - slots 1..N: list items take turns sliding right.
      const shift = 40
      let activeSlot = -2 // -2 = nothing yet, -1 = none, 0 = Myself, >=1 = item index+1

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=1200', // total pinned scroll; ~200px per slot when you have 5 items
        pin: true,
        anticipatePin: 1,
        onUpdate: self => {
          if (!items.length && !myselfRef.current) return

          const totalSlots = items.length + 1 // 0 = Myself, 1..N = list items
          let slot = Math.floor(self.progress * totalSlots)
          if (slot > totalSlots - 1) slot = totalSlots - 1

          if (slot === activeSlot) return

          // Clear previous active
          if (activeSlot === 0 && myselfRef.current) {
            // Was 'Myself'
            gsap.to(myselfRef.current, {
              x: 0,
              duration: 0.2,
              ease: 'power2.inOut'
            })
          } else if (activeSlot > 0) {
            const prevIndex = activeSlot - 1
            if (prevIndex >= 0 && prevIndex < items.length) {
              gsap.to(items[prevIndex], {
                x: 0,
                duration: 0.2,
                ease: 'power2.inOut'
              })
            }
          }

          // Apply new active
          if (slot === 0 && myselfRef.current) {
            // First slot: shift 'Myself' right
            gsap.to(myselfRef.current, {
              x: shift,
              duration: 0.2,
              ease: 'power2.inOut'
            })
          } else if (slot > 0) {
            const index = slot - 1
            if (index >= 0 && index < items.length) {
              gsap.to(items[index], {
                x: shift,
                duration: 0.2,
                ease: 'power2.inOut'
              })
            }
          }

          activeSlot = slot
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about-section" ref={sectionRef}>
      <h2 ref={titleRef}>
        About{' '}
        <span ref={myselfRef}>
          Myself
        </span>
      </h2>
      <ul>
        {funFacts.map((fact, index) => (
          <li key={index} className="about-fact">
            <h4>{fact}</h4>
          </li>
        ))}
      </ul>
    </section>
  )
}