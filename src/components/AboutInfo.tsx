interface AboutInfoItem {
  image: string
  title: string
  description: string
}

interface AboutInfoProps {
  facts: AboutInfoItem[]
  activeIndex: number | null
}

export function AboutInfo({ facts, activeIndex }: AboutInfoProps) {
  return (
    <div className="about-info">
      {facts.map((fact, index) => (
        <div
          key={index}
          className={
            'about-info__item' +
            (activeIndex !== null && index <= activeIndex
              ? ' about-info__item--active'
              : '')
          }
        >
          <img src={fact.image} alt={fact.title} />
        </div>
      ))}
    </div>
  )
}