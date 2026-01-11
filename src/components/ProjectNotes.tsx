import { useLayoutEffect, useRef, useState } from 'react'

export type ProjectNoteItem = {
    key: string
    text: string
}

interface ProjectNotesProps {
    notes: ProjectNoteItem[]
    activeKey: string | null
}

export function ProjectNotes({ notes, activeKey }: ProjectNotesProps) {
    const viewportRef = useRef<HTMLDivElement | null>(null)
    const ulRef = useRef<HTMLUListElement | null>(null)
    const liRefs = useRef<Map<string, HTMLLIElement>>(new Map())
    const [translateY, setTranslateY] = useState(0)

    useLayoutEffect(() => {
        if (!activeKey) return
        const li = liRefs.current.get(activeKey)
        const viewport = viewportRef.current
        const ul = ulRef.current
        if (!li || !viewport || !ul) return

        const targetOffsetTop = li.offsetTop // unaffected by transforms
        const maxScroll = Math.max(0, ul.scrollHeight - viewport.clientHeight)
        const nextTranslate = -Math.min(targetOffsetTop, maxScroll)
        setTranslateY(nextTranslate)
    }, [activeKey, notes])

    return (
        <div className="project-notes" ref={viewportRef}>
            <ul
                className="project-notes__list"
                ref={ulRef}
                style={{ transform: `translate3d(0, ${translateY}px, 0)` }}
            >
                {notes.map((note) => (
                    <li
                        key={note.key}
                        className={note.key === activeKey ? 'project-notes__item project-notes__item--active' : 'project-notes__item'}
                        ref={(el) => {
                            if (el) liRefs.current.set(note.key, el)
                            else liRefs.current.delete(note.key)
                        }}
                    >
                        {note.text}
                    </li>
                ))}
            </ul>
        </div>
    )
}