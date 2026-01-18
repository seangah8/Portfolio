import { useRef, useState } from 'react'

const SECTIONS = [
    { id: 'welcome', label: 'Welcome' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
] as const

export function NavigationBar() {
    const navRef = useRef<HTMLElement | null>(null)
    const [isOpen, setIsOpen] = useState(true)

    function scrollToSection(id: string) {
        const el = document.getElementById(id)
        if (!el) return
        
        const targetTop = el.getBoundingClientRect().top + window.scrollY

        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
    }

    return (
        <nav
            ref={navRef}
            className={`navigation-bar ${isOpen ? 'is-open' : 'is-collapsed'}`}
            aria-label="Primary"
        >
            {SECTIONS.map((section) => (
                <button
                    key={section.id}
                    className="navigation-bar__item"
                    type="button"
                    onClick={() => {
                        scrollToSection(section.id)
                        setIsOpen(false)
                    }}
                    tabIndex={isOpen ? 0 : -1}
                >
                    {section.label}
                </button>
            ))}

            <button
                className="navigation-bar__toggle"
                type="button"
                aria-label={isOpen ? 'Close navigation bar' : 'Open navigation bar'}
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <i className={`fa-solid fa-caret-${isOpen ? 'up' : 'down'}`}></i>
            </button>
        </nav>
    )
}