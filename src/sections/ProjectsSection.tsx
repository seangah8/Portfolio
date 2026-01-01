import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { storageService } from '../services/storage.service'

gsap.registerPlugin(ScrollTrigger)

export function ProjectsSection() {

  const sectionRef = useRef<HTMLElement | null>(null)
  const slidesRef = useRef<HTMLDivElement | null>(null)
  const lastSlideIndexRef = useRef(0)

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

  useEffect(() => {
    if (!sectionRef.current || !slidesRef.current) return
    if (slides.length <= 1) return

    const ctx = gsap.context(() => {
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

  console.log('currentProjectTitle', currentProjectTitle)
  console.log('currentProjectImageIndex', currentProjectImageIndex)

  return (
    <section className="projects-section" ref={sectionRef}>
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
    </section>
  )
}