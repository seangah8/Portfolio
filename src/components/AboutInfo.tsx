interface AboutInfoProps {
    image: string;
    title: string;
    description: string;
}

export function AboutInfo({ image, title, description }: AboutInfoProps) {

    return (
        <div className="about-info">
            <img src={image} alt={title} />
        </div>
    )
}