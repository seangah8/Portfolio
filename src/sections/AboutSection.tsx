import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AboutInfo } from '../components/AboutInfo'
import { storageService } from '../services/storage.service'

gsap.registerPlugin(ScrollTrigger)

export function AboutSection() {
  const MOBILE_BREAKPOINT_PX = 600
  const getIsMobile = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches
  }

  const clamp01 = (n: number) => Math.max(0, Math.min(1, n))

  const parseCssColorToRgb = (input: string): { r: number; g: number; b: number } | null => {
    const value = input.trim()
    if (!value) return null

    // hex: #rgb or #rrggbb
    if (value.startsWith('#')) {
      const hex = value.slice(1)
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16)
        const g = parseInt(hex[1] + hex[1], 16)
        const b = parseInt(hex[2] + hex[2], 16)
        return { r, g, b }
      }
      if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        return { r, g, b }
      }
      return null
    }

    // rgb() / rgba()
    const rgbMatch = value.match(
      /^rgba?\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)(?:\s*,\s*([0-9.]+))?\s*\)$/i
    )
    if (rgbMatch) {
      return {
        r: Number(rgbMatch[1]),
        g: Number(rgbMatch[2]),
        b: Number(rgbMatch[3])
      }
    }

    return null
  }

  const mixColors = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, t: number) => {
    const tt = clamp01(t)
    const r = Math.round(a.r + (b.r - a.r) * tt)
    const g = Math.round(a.g + (b.g - a.g) * tt)
    const bl = Math.round(a.b + (b.b - a.b) * tt)
    return `rgb(${r}, ${g}, ${bl})`
  }
  const sectionRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const myselfRef = useRef<HTMLSpanElement | null>(null)
  const [activeFactIndex, setActiveFactIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(getIsMobile)
  const [hasMeShifted, setHasMeShifted] = useState(() => (getIsMobile() ? true : false))

  // Normalize facts coming from storage so AboutInfo always receives
  // { title, description, images: string[] }
  const allFacts = [storageService.getMeFact(), ...storageService.getFunFacts()].map(
    fact => ({
      title: fact.title,
      description: fact.description,
      images: [fact.image1, fact.image2, fact.image3].filter(Boolean)
    })
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`)
    const onChange = () => setIsMobile(mq.matches)

    // Initialize + subscribe
    onChange()
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }

    // Fallback for older browsers
    mq.addListener(onChange)
    return () => mq.removeListener(onChange)
  }, [])

  useEffect(() => {
    // Mobile UX: avoid pinned scrolling interactions; rely on taps/clicks instead.
    if (isMobile) {
      setHasMeShifted(true)
      return
    }

    const ctx = gsap.context(() => {
      if (!sectionRef.current || !titleRef.current) return

      // Tween that we drive manually based on scroll progress
      const titleTween = gsap.fromTo(
        titleRef.current,
        { fontSize: '2rem' },
        { fontSize: '6rem', paused: true }
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

      // Background color tween for the whole page (body) that we drive via scroll
      const rootStyle = getComputedStyle(document.documentElement)
      const background1 =
        rootStyle.getPropertyValue('--background1').trim() || '#2b033f'
      const background2 =
        rootStyle.getPropertyValue('--background2').trim() || '#032d3f'

      const backgroundTween = gsap.fromTo(
        document.body,
        { backgroundColor: background1 },
        { backgroundColor: background2, ease: 'none', paused: true }
      )

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

          // Map the current slot to a background tween progress between 0 and 1.
          // Slot 0 -> background1, last slot -> background2, slots in between get
          // evenly spaced colors in between.
          const totalSteps = Math.max(1, totalSlots - 1)
          const targetProgress = slot / totalSteps

          if (slot === activeSlot) return

          // Animate the background tween only when the active slot changes
          gsap.to(backgroundTween, {
            progress: targetProgress,
            duration: 0.3,
            ease: 'power2.inOut'
          })

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
            setHasMeShifted(true)
            setActiveFactIndex(null)
          } else if (slot > 0) {
            const index = slot - 1
            if (index >= 0 && index < items.length) {
              gsap.to(items[index], {
                x: shift,
                duration: 0.2,
                ease: 'power2.inOut'
              })
              setActiveFactIndex(index)
              setHasMeShifted(false)
            }
          }

          activeSlot = slot
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  useEffect(() => {
    // Mobile-only: when entering the About section, set background to a midpoint
    // between --background1 and --background2.
    if (!isMobile) return
    if (!sectionRef.current) return

    const rootStyle = getComputedStyle(document.documentElement)
    const background1 = rootStyle.getPropertyValue('--background1').trim()
    const background2 = rootStyle.getPropertyValue('--background2').trim()
    const c1 = parseCssColorToRgb(background1)
    const c2 = parseCssColorToRgb(background2)
    const midpoint = c1 && c2 ? mixColors(c1, c2, 0.5) : background1 || '#2b033f'

    const prevBackground = document.body.style.backgroundColor

    const apply = (inView: boolean) => {
      gsap.killTweensOf(document.body)
      gsap.to(document.body, {
        backgroundColor: inView ? midpoint : prevBackground || background1,
        duration: 0.35,
        ease: 'power2.inOut'
      })
    }

    const observer = new IntersectionObserver(
      ([entry]) => apply(!!entry?.isIntersecting),
      { threshold: 0.25 }
    )

    observer.observe(sectionRef.current)
    return () => {
      observer.disconnect()
      // Restore on cleanup (e.g. resize back to desktop)
      apply(false)
    }
  }, [isMobile])

  const showMeFact = hasMeShifted && activeFactIndex === null

  const activeImageIndex =
    showMeFact ? 0 : activeFactIndex !== null ? activeFactIndex + 1 : null

  // Description should only appear once the user has fully entered the section
  // (i.e. at least reached the "ME" slot once) and an image is active.
  const showDescription = activeImageIndex !== null

  return (
    <section className="about-section" ref={sectionRef}>
      <div className="left-side">
        <h2 ref={titleRef}>
          About{' '}
          <span
            ref={myselfRef}
            className={showMeFact ? 'about-section__me about-section__me--active' : 'about-section__me'}
            onClick={() => {
              // Allow quickly returning to the "ME" fact on mobile.
              setActiveFactIndex(null)
              setHasMeShifted(true)
            }}
          >
            ME
          </span>
        </h2>
        <ul>
          {storageService.getFunFacts().map((fact, index) => (
            <li
              key={index}
              className={
                'about-fact' + (activeFactIndex === index ? ' about-fact--active' : '')
              }
            >
              <button
                type="button"
                className="about-fact__button"
                onClick={() => {
                  setActiveFactIndex(index)
                  setHasMeShifted(false)
                }}
              >
                <p>{fact.title}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <AboutInfo
        facts={allFacts}
        activeIndex={activeImageIndex}
        showDescription={showDescription}
        isMobile={isMobile}
      />
    </section>
  )
}