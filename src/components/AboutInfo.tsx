import { useEffect, useState } from 'react'

interface AboutInfoItem {
  image: string
  title: string
  description: string
}

interface AboutInfoProps {
  facts: AboutInfoItem[]
  activeIndex: number | null
  showDescription: boolean
}

export function AboutInfo({
  facts,
  activeIndex,
  showDescription
}: AboutInfoProps) {
  const [typedText, setTypedText] = useState('')

  useEffect(() => {
    if (!showDescription || activeIndex === null) {
      setTypedText('')
      return
    }

    const fullText = facts[activeIndex]?.description || ''
    if (!fullText) {
      setTypedText('')
      return
    }

    setTypedText('')
    let index = 0

    const intervalId = window.setInterval(() => {
      index += 1
      setTypedText(fullText.slice(0, index))

      if (index >= fullText.length) {
        window.clearInterval(intervalId)
      }
    }, 15) // 0.03s per character for a smooth typewriter effect

    return () => {
      window.clearInterval(intervalId)
    }
  }, [showDescription, activeIndex, facts])

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
      {showDescription && activeIndex !== null && (
        <div className="description-area">
          <p>{typedText}</p>
        </div>
      )}
    </div>
  )
}