import { HeadlineSection } from './sections/HeadlineSection'
import { AboutSection } from './sections/AboutSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { ContactSection } from './sections/ContactSection'
import { NavigationBar } from './components/NavigationBar'
export default function App() {


  return (
    <>
      <NavigationBar />
      <section id="welcome" className="app-section">
        <HeadlineSection />
      </section>
      <section id="about" className="app-section">
        <AboutSection />
      </section>
      <section id="projects" className="app-section">
        <ProjectsSection />
      </section>
      <section id="contact" className="app-section">
        <ContactSection />
      </section>
    </>
  )
}



/*
  TODO:
    1. create navigation bar at the top of the page with the sections
    2. when clicking a section, the page will scroll to the start of the section
    3. add a small toggal arrow button to the navigation bar to close/open the navigation bar
    4. when picking section from the bar, the navigation bar will close
    5. at start, the navigation bar will be open, exiting headline section will close it automatically
*/
