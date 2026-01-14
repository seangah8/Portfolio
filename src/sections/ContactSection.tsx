import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ContactSection() {
    const sectionRef = useRef<HTMLElement | null>(null)
    const titleRef = useRef<HTMLHeadingElement | null>(null)

    useEffect(() => {
        const ctx = gsap.context(() => {
            if (!sectionRef.current) return

            const rootStyle = getComputedStyle(document.documentElement)
            const background3 = rootStyle.getPropertyValue('--background3').trim() || '#1b8775'
            const background4 = rootStyle.getPropertyValue('--background4').trim() || '#ffffff'
            const mainText = rootStyle.getPropertyValue('--main').trim() || '#ffffff'

            const setContactMode = (isContact: boolean) => {
                gsap.to(document.body, {
                    backgroundColor: isContact ? background4 : background3,
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

    return (
        <section className="contact-section" ref={sectionRef}>
            <h1 ref={titleRef}>want to make your dream website come true?</h1>
        </section>
    )
}