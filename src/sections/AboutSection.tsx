import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!sectionRef.current || !titleRef.current) return

      // Tween that we drive manually based on scroll progress
      const tween = gsap.fromTo(
        titleRef.current,
        { fontSize: '2rem' },
        { fontSize: '4rem', paused: true }
      )

      let maxProgress = 0

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'top top',
        onUpdate: self => {
          // Only ever move the tween forward; never back
          maxProgress = Math.max(maxProgress, self.progress)
          tween.progress(maxProgress)
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="about-section" ref={sectionRef}>
      <h2 ref={titleRef}>About Myself</h2>
    </section>
  )
}