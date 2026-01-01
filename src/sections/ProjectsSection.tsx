import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { storageService } from '../services/storage.service'

gsap.registerPlugin(ScrollTrigger)

export function ProjectsSection() {

  const sectionRef = useRef<HTMLElement | null>(null)
  const slidesRef = useRef<HTMLDivElement | null>(null)

  const images = useMemo(() => {
    const projects = storageService.getProjects()
    return projects.flatMap(p => p.images).filter(Boolean)
  }, [])

  useEffect(() => {
    if (!sectionRef.current || !slidesRef.current) return
    if (images.length <= 1) return

    const ctx = gsap.context(() => {
      gsap.to(slidesRef.current, {
        yPercent: -(images.length - 1) * 100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${(images.length - 1) * 400}`,
          pin: true,
          scrub: true,
          anticipatePin: 1
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [images.length])

  return (
    <section className="projects-section" ref={sectionRef}>
      <div className="laptop">
        <img className="laptop-frame" src="/projects_section/laptop.png" alt="laptop" />
        <div className="laptop-screen" aria-label="Project screenshots">
          <div className="laptop-slides" ref={slidesRef}>
            {images.map((src, idx) => (
              <img key={`${src}-${idx}`} src={src} alt={`project screenshot ${idx + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}