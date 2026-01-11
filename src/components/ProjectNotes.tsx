interface ProjectNotesProps {
    notes: string[]
}

export function ProjectNotes({ notes }: ProjectNotesProps) {

    return (
        <div className="project-notes">
            <ul>
                {notes.map((note, idx) => (
                    <li key={`${note}-${idx}`}>{note}</li>
                ))}
            </ul>
        </div>
    )
}