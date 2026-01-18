export function NavigationBar() {
    return (
        <nav className="navigation-bar" aria-label="Primary">
            <button className="navigation-bar__item" type="button">
                Welcome
            </button>
            <button className="navigation-bar__item" type="button">
                About
            </button>
            <button className="navigation-bar__item" type="button">
                Projects
            </button>
            <button className="navigation-bar__item" type="button">
                Contact
            </button>
        </nav>
    )
}