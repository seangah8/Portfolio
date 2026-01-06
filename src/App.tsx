import { HeadlineSection } from './sections/HeadlineSection'
import { AboutSection } from './sections/AboutSection'
import { ProjectsSection } from './sections/ProjectsSection'
export default function App() {


  return (
    <>
      <HeadlineSection />
      <AboutSection />
      <ProjectsSection />
    </>
  )
}



/*
  TODO:
    1. when scrolling the monitor shows images of the projects, each coming from the botton and stimulate an inside scroll
    2. add projects title in the middle of the screen at start
    3. after full enter the title shifs left togeter with a monitor/laptop image
    4. for each project there will be a title above the monitor that comes from right and the prev leave from left
    5. make sure the background color chnages while scrolling
    6. add images + projects title
    7. adding notes that appear from the sides in each project while scrolling 
*/
