import { HeadlineSection } from './sections/HeadlineSection'
import { AboutSection } from './sections/AboutSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { ContactSection } from './sections/ContactSection'
export default function App() {


  return (
    <>
      <HeadlineSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </>
  )
}



/*
  TODO:
    1. create a new section for the contact me section
    2. create a title in the middle of the section with a quastion like "want to make your dream website come true?"
    4. make the background color change when entering the section
    4. when clicking the title it will fade
    5. affter fading, 3 color horisontal lines will come from left, right and left again and in each a bouncy animation will show the media logo
    6. hovering each line will show the media name and the link to the media
    7. clicking it will open the media in a new tab
*/
