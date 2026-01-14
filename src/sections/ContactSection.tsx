import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ContactSection() {
    const sectionRef = useRef<HTMLElement | null>(null)
    const titleRef = useRef<HTMLHeadingElement | null>(null)
    const rafRef = useRef<number | null>(null)
    const phaseRef = useRef<'idle' | 'animating' | 'done'>('idle')

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!sectionRef.current) return

            const rootStyle = getComputedStyle(document.documentElement)
            const background3 = rootStyle.getPropertyValue('--background3').trim() || '#1b8775'
            const background4 = rootStyle.getPropertyValue('--background4').trim() || '#ffffff'
            const background5 = rootStyle.getPropertyValue('--background5').trim() || '#ffffff'
            const mainText = rootStyle.getPropertyValue('--main').trim() || '#ffffff'

            const setContactMode = (isContact: boolean) => {
                gsap.to(document.body, {
                    backgroundColor: isContact
                        ? phaseRef.current === 'done'
                            ? background5
                            : background4
                        : background3,
                    duration: 0.35,
                    ease: 'power2.inOut',
                })

                if (titleRef.current) {
                    gsap.to(titleRef.current, {
                        color: isContact ? '#000000' : mainText,
                        duration: 0.35,
                        ease: 'power2.inOut',
                    })
                }

                // If we leave the section via scroll (without a mouseleave),
                // fade out the spotlight overlay.
                if (!isContact && sectionRef.current) {
                    sectionRef.current.style.setProperty('--contact-spotlight-opacity', '0')
                }
            }

            ScrollTrigger.create({
                trigger: sectionRef.current,
                // Fire when the section is almost fully in view.
                // With a 100vh section, `top 20%` means ~80% of it is visible.
                start: 'top 20%',
                end: 'bottom top',
                onEnter: () => {
                    setContactMode(true)
                },
                onEnterBack: () => {
                    setContactMode(true)
                },
                onLeaveBack: () => {
                    setContactMode(false)
                },
            })
        }, sectionRef)

        return () => ctx.revert()
    }, [])

    const setTitleShadow = (x: number, y: number) => {
        if (!titleRef.current) return
        titleRef.current.style.setProperty('--contact-shadow-x', `${x.toFixed(1)}px`)
        titleRef.current.style.setProperty('--contact-shadow-y', `${y.toFixed(1)}px`)
    }

    const setSpotlight = (x: number, y: number, opacity: number) => {
        const sectionEl = sectionRef.current
        if (!sectionEl) return
        sectionEl.style.setProperty('--contact-spotlight-x', `${x.toFixed(1)}px`)
        sectionEl.style.setProperty('--contact-spotlight-y', `${y.toFixed(1)}px`)
        sectionEl.style.setProperty('--contact-spotlight-opacity', `${opacity}`)
    }

    const handleMouseMove: React.MouseEventHandler<HTMLElement> = ev => {
        if (phaseRef.current === 'done') return

        const titleEl = titleRef.current
        const sectionEl = sectionRef.current
        if (!titleEl || !sectionEl) return

        // Throttle to animation frames so we don't spam style recalcs.
        if (rafRef.current) window.cancelAnimationFrame(rafRef.current)
        rafRef.current = window.requestAnimationFrame(() => {
            if (!titleRef.current || !sectionRef.current) return

            // Spotlight position (relative to the section)
            const sectionRect = sectionEl.getBoundingClientRect()
            const sx = ev.clientX - sectionRect.left
            const sy = ev.clientY - sectionRect.top
            setSpotlight(sx, sy, 1)

            // Shadow offset (relative to the title)
            const rect = titleEl.getBoundingClientRect()
            const cx = rect.left + rect.width / 2
            const cy = rect.top + rect.height / 2

            const dx = ev.clientX - cx
            const dy = ev.clientY - cy

            // Opposite direction of the mouse:
            // mouse left  -> shadow right (positive x)
            // mouse right -> shadow left  (negative x)
            const max = 100
            const ox = Math.max(-max, Math.min(max, -dx / 12))
            const oy = Math.max(-max, Math.min(max, -dy / 12))
            setTitleShadow(ox, oy)
        })
    }

    const handleMouseLeave: React.MouseEventHandler<HTMLElement> = () => {
        if (rafRef.current) {
            window.cancelAnimationFrame(rafRef.current)
            rafRef.current = null
        }
        setTitleShadow(0, 0)
        if (phaseRef.current !== 'animating') setSpotlight(0, 0, 0)
    }

    const handleTitleClick: React.MouseEventHandler<HTMLHeadingElement> = () => {
        if (phaseRef.current !== 'idle') return

        const sectionEl = sectionRef.current
        const titleEl = titleRef.current
        if (!sectionEl || !titleEl) return

        phaseRef.current = 'animating'

        const rootStyle = getComputedStyle(document.documentElement)
        const background5 = rootStyle.getPropertyValue('--background5').trim() || '#ffffff'

        // Ensure spotlight is visible (even if the user hasn't moved the mouse yet).
        sectionEl.style.setProperty('--contact-spotlight-opacity', '1')

        // Center spotlight on the title at the moment of click.
        const sectionRect = sectionEl.getBoundingClientRect()
        const titleRect = titleEl.getBoundingClientRect()
        const cx = titleRect.left + titleRect.width / 2 - sectionRect.left
        const cy = titleRect.top + titleRect.height / 2 - sectionRect.top
        setSpotlight(cx, cy, 1)

        const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            onComplete: () => {
                phaseRef.current = 'done'
            },
        })

        tl.to(
            titleEl,
            {
                opacity: 0,
                duration: 0.35,
                pointerEvents: 'none',
            },
            0
        )
            .set(titleEl, { display: 'none' })
            .to(
                sectionEl,
                {
                    '--contact-spotlight-size': '8000px',
                    duration: 0.5,
                    ease: 'power2.out',
                } as gsap.TweenVars,
                0
            )
            .to(
                document.body,
                {
                    backgroundColor: background5,
                    duration: 0.35,
                    ease: 'power2.inOut',
                },
                '>'
            )
            .to(
                sectionEl,
                {
                    '--contact-spotlight-opacity': 0,
                    duration: 0.25,
                    ease: 'power2.out',
                } as gsap.TweenVars,
                '>'
            )
    }

    return (
        <section
            className="contact-section"
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <h1 ref={titleRef} onClick={handleTitleClick}>
                Want to make your dream website come true?
            </h1>
        </section>
    )
}