import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { storageService } from '../services/storage.service'

gsap.registerPlugin(ScrollTrigger)

export function ProjectsSection() {

  const sectionRef = useRef<HTMLElement | null>(null)
  const slidesRef = useRef<HTMLDivElement | null>(null)
  const lastSlideIndexRef = useRef(0)
  const scrollDirectionRef = useRef<1 | -1>(1)
  const outgoingTitleRef = useRef<HTMLSpanElement | null>(null)
  const incomingTitleRef = useRef<HTMLSpanElement | null>(null)
  const introTitleRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const hasIntroPlayedRef = useRef(false)

  const slides = useMemo(() => {
    const projects = storageService.getProjects()

    return projects.flatMap(project =>
      project.images.filter(Boolean).map((src, imageIndexInProject) => ({
        src,
        projectTitle: project.title,
        imageIndexInProject
      }))
    )
  }, [])

  const [currentProjectTitle, setCurrentProjectTitle] = useState(
    slides[0]?.projectTitle ?? ''
  )
  const [currentProjectImageIndex, setCurrentProjectImageIndex] = useState(
    slides[0]?.imageIndexInProject ?? 0
  )

  // We render these so we can animate old+new titles together.
  const [shownTitle, setShownTitle] = useState(slides[0]?.projectTitle ?? '')
  const [leavingTitle, setLeavingTitle] = useState<string | null>(null)

  useEffect(() => {
    if (!sectionRef.current || !slidesRef.current) return
    if (slides.length <= 1) return

    const ctx = gsap.context(() => {
      // Initial "enter" state: show intro title, keep content off-screen to the right.
      if (introTitleRef.current) gsap.set(introTitleRef.current, { opacity: 1, x: 0, display: 'flex' })
      // Start fully outside the viewport on the right so it doesn't appear next to the intro.
      if (contentRef.current) gsap.set(contentRef.current, { opacity: 1, x: '120vw' })

      // One-time intro animation when the user first enters this section.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        // Fire when the section reaches the top (same moment it gets pinned),
        // so the intro is centered in the viewport.
        start: 'top top',
        onEnter: () => {
          if (hasIntroPlayedRef.current) return
          hasIntroPlayedRef.current = true

          const introEl = introTitleRef.current
          const contentEl = contentRef.current
          if (!introEl || !contentEl) return

          const tl = gsap.timeline({
            defaults: { ease: 'power2.out' },
            onComplete: () => {
              gsap.set(introEl, { display: 'none' })
            }
          })

          tl.to({}, { duration: 1 }) // hold "Projects" for a second
            // Keep opacity constant (1) while moving elements.
            .to(introEl, { x: '-120vw', duration: 0.6, ease: 'power2.in' }, 1)
            .to(contentEl, { x: 0, duration: 0.7 }, 1.1)
        }
      })

      gsap.to(slidesRef.current, {
        yPercent: -(slides.length - 1) * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${(slides.length - 1) * 400}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          onUpdate: self => {
            scrollDirectionRef.current = (self.direction || 1) as 1 | -1

            const maxIndex = slides.length - 1
            const nextIndex = Math.max(0, Math.min(maxIndex, Math.round(self.progress * maxIndex)))

            if (nextIndex === lastSlideIndexRef.current) return
            lastSlideIndexRef.current = nextIndex

            const nextSlide = slides[nextIndex]
            if (!nextSlide) return

            setCurrentProjectTitle(nextSlide.projectTitle)
            setCurrentProjectImageIndex(nextSlide.imageIndexInProject)
          }
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [slides])

  // When the "current title" changes, prepare an outgoing+incoming pair for animation.
  useEffect(() => {
    if (!currentProjectTitle) return
    if (!shownTitle) {
      setShownTitle(currentProjectTitle)
      return
    }
    if (currentProjectTitle === shownTitle) return

    setLeavingTitle(shownTitle)
    setShownTitle(currentProjectTitle)
  }, [currentProjectTitle, shownTitle])

  // Animate title transitions.
  // Scroll down: new from right, old to left. Scroll up: opposite.
  useEffect(() => {
    if (!leavingTitle) return
    const outgoingEl = outgoingTitleRef.current
    const incomingEl = incomingTitleRef.current
    if (!outgoingEl || !incomingEl) return

    const dir = scrollDirectionRef.current // 1 = down, -1 = up
    const incomingStartX = 100 * dir
    const outgoingEndX = -100 * dir

    const tl = gsap.timeline({
      defaults: { duration: 0.25, ease: 'power2.out' },
      onComplete: () => setLeavingTitle(null)
    })

    gsap.set(incomingEl, { x: incomingStartX, opacity: 0 })
    gsap.set(outgoingEl, { x: 0, opacity: 1 })

    tl.to(outgoingEl, { x: outgoingEndX, opacity: 0 }, 0).to(
      incomingEl,
      { x: 0, opacity: 1 },
      0
    )

    return () => {
      tl.kill()
    }
  }, [leavingTitle, shownTitle])

  return (
    <section className="projects-section" ref={sectionRef}>
      <div className="projects-intro" ref={introTitleRef} aria-hidden="true">
        Projects
      </div>

      <div className="projects-content" ref={contentRef}>
        <div className="projects-title" aria-live="polite">
          {leavingTitle && (
            <span
              className="projects-title__text projects-title__text--outgoing"
              ref={outgoingTitleRef}
            >
              {leavingTitle}
            </span>
          )}
          <span
            className="projects-title__text projects-title__text--incoming"
            ref={incomingTitleRef}
          >
            {shownTitle}
          </span>
        </div>

        <div className="laptop">
          <img className="laptop-frame" src="/projects_section/laptop.png" alt="laptop" />
          <div
            className="laptop-screen"
            aria-label={`Project screenshots${currentProjectTitle ? ` - ${currentProjectTitle}` : ''}`}
            data-project-title={currentProjectTitle}
            data-project-image-index={currentProjectImageIndex}
          >
            <div className="laptop-slides" ref={slidesRef}>
              {slides.map((slide, idx) => (
                <img
                  key={`${slide.src}-${idx}`}
                  src={slide.src}
                  alt={`${slide.projectTitle} - screenshot ${slide.imageIndexInProject + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}