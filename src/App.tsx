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
    1. padding nicely left-side in about section
    2. make desctiption for each fact imidiate reveal if scrolling up or just appear faster
    3. mark selected fact in about section
    4. add real images for the facts
*/
