import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)

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

      // Get list items and prepare them for reveal
      const items = gsap.utils.toArray<HTMLElement>('.about-fact')
      let revealTween: gsap.core.Tween | null = null
      let hasRevealed = false

      if (items.length) {
        gsap.set(items, { opacity: 0, y: 20 })
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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about-section" ref={sectionRef}>
      <h2 ref={titleRef}>About Myself</h2>
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