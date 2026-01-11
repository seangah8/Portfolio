import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { storageService } from '../services/storage.service'
import { ProjectNotes, type ProjectNoteItem } from '../components/ProjectNotes'

gsap.registerPlugin(ScrollTrigger)

function formatLocalHHMM(date: Date) {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function ProjectsSection() {

  const sectionRef = useRef<HTMLElement | null>(null)
  const slidesRef = useRef<HTMLDivElement | null>(null)
  const lastSlideIndexRef = useRef(0)
  const lastProjectIndexRef = useRef(0)
  const scrollDirectionRef = useRef<1 | -1>(1)
  const outgoingTitleRef = useRef<HTMLSpanElement | null>(null)
  const incomingTitleRef = useRef<HTMLSpanElement | null>(null)
  const introTitleRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const hasIntroPlayedRef = useRef(false)

  const projects = useMemo(() => storageService.getProjects(), [])

  const slides = useMemo(() => {
    return projects.flatMap((project, projectIndex) =>
      project.slides.filter(Boolean).map((slide, imageIndexInProject) => ({
        src: slide.image,
        projectTitle: project.title,
        projectIndex,
        imageIndexInProject,
        note: slide.note,
      }))
    )
  }, [projects])

  const [currentProjectTitle, setCurrentProjectTitle] = useState(
    slides[0]?.projectTitle ?? ''
  )
  const [currentProjectImageIndex, setCurrentProjectImageIndex] = useState(
    slides[0]?.imageIndexInProject ?? 0
  )

  const initialNote = useMemo<ProjectNoteItem | null>(() => {
    const first = slides[0]
    if (!first) return null
    const key = `${first.projectIndex}:${first.imageIndexInProject}`
    const text = first.note ?? null
    return text ? { key, text, kind: 'note', time: formatLocalHHMM(new Date()) } : null
  }, [projects, slides])

  // Accumulating notes list (does NOT reset when project changes).
  const seenNoteKeysRef = useRef<Set<string>>(new Set())
  const pendingNoteTimeoutsRef = useRef<Map<string, number>>(new Map())
  const [shownNotes, setShownNotes] = useState<ProjectNoteItem[]>(() =>
    initialNote ? [initialNote] : []
  )
  const [activeNoteKey, setActiveNoteKey] = useState<string | null>(() =>
    initialNote ? initialNote.key : null
  )

  useEffect(() => {
    return () => {
      pendingNoteTimeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId))
      pendingNoteTimeoutsRef.current.clear()
    }
  }, [])

  useEffect(() => {
    if (!initialNote) return
    // Ensure the first note is marked as "seen" so we don't add it again.
    const first = slides[0]
    if (!first) return
    seenNoteKeysRef.current.add(initialNote.key)
  }, [initialNote, slides])

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

      const pxPerImage = 400
      // Make each slide "stick" (hold) for pxPerImage scroll, then transition to the next over pxPerImage scroll.
      const holdPxPerSlide = pxPerImage / 2
      const firstSlideHoldPx = 600
      const transitionPxPerSlide = pxPerImage
      const stepPx = holdPxPerSlide + transitionPxPerSlide
      // Total scroll:
      // - slide 0 holds for firstSlideHoldPx
      // - for each step to the next slide: transition + hold of the new slide
      const totalScrollPx =
        firstSlideHoldPx + (slides.length - 1) * transitionPxPerSlide + (slides.length - 1) * holdPxPerSlide

      // Background colors for the whole page (body), stepped per PROJECT.
      // IMPORTANT: we do NOT set the body color on mount; we only change it when
      // the Projects ScrollTrigger becomes active (enter / project-change).
      const rootStyle = getComputedStyle(document.documentElement)
      const background2 = rootStyle.getPropertyValue('--background2').trim() || '#27327e'
      const background3 = rootStyle.getPropertyValue('--background3').trim() || '#36933f'
      const maxProjectIndex = Math.max(0, projects.length - 1)
      const getProjectColor = (projectIndex: number) => {
        const t = maxProjectIndex > 0 ? projectIndex / maxProjectIndex : 0
        return gsap.utils.interpolate(background2, background3, t)
      }
      const setBodyColorForProject = (projectIndex: number, duration = 0.35) => {
        gsap.to(document.body, {
          backgroundColor: getProjectColor(projectIndex),
          duration,
          ease: 'power2.inOut'
        })
      }

      // We drive this tween manually so we can add the initial "hold" distance.
      const slidesTween = gsap.to(slidesRef.current, {
        yPercent: -(slides.length - 1) * 100,
        ease: 'none',
        paused: true
      })

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${totalScrollPx}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onEnter: () => {
          // When Projects becomes active, snap to the starting project color (background2).
          setBodyColorForProject(0, 0)
        },
        onEnterBack: () => {
          // When re-entering Projects from below, align the body to the current project color.
          const idx = Math.max(0, Math.min(maxProjectIndex, lastProjectIndexRef.current))
          setBodyColorForProject(idx, 0)
        },
        onUpdate: self => {
          scrollDirectionRef.current = (self.direction || 1) as 1 | -1

          const maxIndex = slides.length - 1
          if (maxIndex <= 0) return

          // Convert scroll progress -> a "position" that includes holds:
          // - slide 0 holds for firstSlideHoldPx
          // - each next slide holds for holdPxPerSlide
          // - each transition to the next slide takes transitionPxPerSlide
          const scrollPx = self.progress * totalScrollPx

          let position = 0 // 0..maxIndex (can be fractional during transitions)
          if (scrollPx <= firstSlideHoldPx) {
            position = 0
          } else {
            const remaining = scrollPx - firstSlideHoldPx
            const maxSteps = maxIndex // number of transitions available (0->1 ... last-1->last)

            // Each step is: transition (to i+1) + hold (of i+1)
            const step = Math.floor(remaining / stepPx)

            if (step >= maxSteps) {
              // Past the last transition: we're holding on the last slide
              position = maxIndex
            } else {
              const base = Math.max(0, Math.min(maxIndex - 1, step)) // we're transitioning from `base` to `base+1`
              const within = remaining - base * stepPx

              if (within <= transitionPxPerSlide) {
                const t = within / Math.max(0.0001, transitionPxPerSlide)
                position = base + Math.max(0, Math.min(1, t))
              } else {
                // Hold on slide base+1
                position = Math.min(maxIndex, base + 1)
              }
            }
          }

          const clampedMoveProgress = Math.max(0, Math.min(1, position / maxIndex))
          slidesTween.progress(clampedMoveProgress)

          // Update active slide index (changes near the middle of a transition).
          const nextIndex = Math.max(0, Math.min(maxIndex, Math.round(position)))

          if (nextIndex === lastSlideIndexRef.current) return
          lastSlideIndexRef.current = nextIndex

          const nextSlide = slides[nextIndex]
          if (!nextSlide) return

          // Step the background color only when the PROJECT changes (not per-pixel and not per slide).
          // Project 0 => background2, last project => background3.
          const nextProjectIndex = Math.max(0, Math.min(maxProjectIndex, nextSlide.projectIndex))

          if (nextProjectIndex !== lastProjectIndexRef.current) {
            lastProjectIndexRef.current = nextProjectIndex
            setBodyColorForProject(nextProjectIndex, 0.35)
          }

          setCurrentProjectTitle(nextSlide.projectTitle)
          setCurrentProjectImageIndex(nextSlide.imageIndexInProject)

          const noteKey = `${nextSlide.projectIndex}:${nextSlide.imageIndexInProject}`
          setActiveNoteKey(noteKey)
          if (!seenNoteKeysRef.current.has(noteKey)) {
            const note = nextSlide.note ?? null
            if (note) {
              // Mark as seen immediately so fast scroll back/forward doesn't schedule duplicates.
              seenNoteKeysRef.current.add(noteKey)

              const typingKey = `${noteKey}__typing`
              // While "typing" is shown, keep the rolling focus on the typing bubble.
              setActiveNoteKey(typingKey)
              setShownNotes(prev => [...prev, { key: typingKey, text: '', kind: 'typing' }])

              const timeoutId = window.setTimeout(() => {
                const time = formatLocalHHMM(new Date())
                setShownNotes(prev => {
                  const idx = prev.findIndex(n => n.key === typingKey)
                  if (idx === -1) return prev
                  const next = prev.slice()
                  next[idx] = { key: noteKey, text: note, kind: 'note', time }
                  return next
                })
                setActiveNoteKey(prev => (prev === typingKey ? noteKey : prev))
                pendingNoteTimeoutsRef.current.delete(noteKey)
              }, 1000)

              pendingNoteTimeoutsRef.current.set(noteKey, timeoutId)
            }
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

        <div className="projects-main">
          <aside
            className="projects-notes"
            aria-label={`Project notes${currentProjectTitle ? ` - ${currentProjectTitle}` : ''}`}
          >
            <ProjectNotes notes={shownNotes} activeKey={activeNoteKey} />
          </aside>

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
      </div>
    </section>
  )
}