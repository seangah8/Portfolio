import { useRef } from 'react'

const SECTIONS = [
    { id: 'welcome', label: 'Welcome' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
] as const

export function NavigationBar() {
    const navRef = useRef<HTMLElement | null>(null)

    function scrollToSection(id: string) {
        const el = document.getElementById(id)
        if (!el) return
        
        const targetTop = el.getBoundingClientRect().top + window.scrollY

        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
    }

    return (
        <nav ref={navRef} className="navigation-bar" aria-label="Primary">
            {SECTIONS.map((section) => (
                <button
                    key={section.id}
                    className="navigation-bar__item"
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                >
                    {section.label}
                </button>
            ))}
        </nav>
    )
}