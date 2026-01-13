export const storageService = {
    getMeFact,
    getFunFacts,
    getProjects,
}


function getMeFact() {
    return {
        title: 'fun fact 0',
        image1: '/about_section/heartcode.png',
        image2: '/about_section/full-stack-1.jpg',
        image3: '/about_section/linkedInProfile.png',
        description: `Hi I’m Sean, a full-stack developer who loves building products that feel smooth, intentional, and genuinely useful. I enjoy taking ideas from a rough thought to something real, functional, and enjoyable to interact with.
            
            I care about clean design, clear logic, and creating experiences that make people say “wow, this works really well.” I’m a fast learner, naturally curious, and someone who likes to understand how things work all the way through, not just on the surface.
            
            If you're looking for someone who brings creativity, responsibility, and a builder’s mindset -> that’s me.
        `
    }
}

function getFunFacts() {
    return [
        {
        title: 'IDF - Network administrator',
        image1: '/about_section/idf.png',
        image2: '/about_section/becoming-network-administrator-feb2-1.jpg',
        image3: '/about_section/img792194.png',
        description: `During my service in the IDF, I worked as a Network Administrator for the entire unit. My role focused on maintaining stable computer and network systems and providing remote support for soldiers and staff across the unit. 
        
        I handled daily troubleshooting, configured workstations, resolved connectivity issues, and made sure people could keep working without interruptions.

        The job taught me responsibility, patience, and how to communicate clearly under pressure - qualities that still shape how I work today. `
    },
    {
        title: 'TAU - Physics & Geophysics',
        image1: '/about_section/Tel_Aviv_university_logo.svg.png',
        image2: '/about_section/555.png',
        image3: '/about_section/123.png',
        description: `I spent years studying Physics and Geophysics at Tel Aviv University, diving deep into problem-solving, analytical thinking, and understanding complex systems under pressure. 
        
        The program challenged me to approach problems from first principles, break them down logically, and stay persistent even when the solution wasn't obvious.

        Working through advanced math, data analysis, and scientific modeling strengthened the way I think today - structured, curious, and always looking for the underlying patterns behind how things work.`
    },
    {
        title: 'CA - Full Stack Developer',
        image1: '/about_section/CA_logo.png',
        image2: '/about_section/CA_statemanagment.png',
        image3: '/about_section/CA_certificate.png',
        description: `I completed a full-stack development program at Coding Academy, where I learned how to build complete applications from the ground up. 
        
            The course was very hands-on - every week involved designing a feature, implementing it end-to-end, and understanding how all parts of a real product fit together.

            Working on multiple projects, both solo and in teams, taught me how to structure code, think like a problem-solver, communicate clearly, and move quickly without losing quality. 
            
            It made me comfortable taking an idea, breaking it into steps, and turning it into something that actually works - a mindset I carry with me into every project.`
    },
    {
        title: 'AdoptMe - Hands-On Experience',
        image1: '/about_section/about_info_img4.jpg',
        image2: '/about_section/1743333562202.jpg',
        image3: '/about_section/AM_logo.png',
        description: `I joined the AdoptMe as part of a team building a mobile app for pet adoption. I worked on improving the user experience by developing UI components, refining onboarding flows, and fixing functional issues throughout the app.
            
            It gave me real experience collaborating in a shared codebase, reviewing and discussing implementations, and contributing features that needed to work smoothly on real devices. 
            
            It showed me how to work within a structured workflow - understanding the code conventions, planning around deadlines, and making sure my features integrate cleanly with others.`
    },
    {
        title: 'Other Interests',
        image1: '/about_section/AdobeStock_38208031.png',
        image2: '/about_section/Python-1200x1200.png ',
        image3: '/about_section/0901ee09f3cc9dc8f4608f82f7cf8bd996a28f6f-1200x630.png',
        description: `Outside of full-stack work, I like building things just for fun. In the past I coded small games in Unity using C#, and lately I’ve been exploring Python by playing around with trade-related ideas. 
        
            When I’m not at the computer, you’ll usually find me at the piano, working out, or cooking something - all the things that help me clear my head and keep a good balance in life.`
    },
  ]
}

function getProjects() {
    return [
        {
            title: 'Someday.com',
            url: 'https://someday-n1ze.onrender.com/',
            slides: [
                { 
                    image: '/projects_section/someday-login.png', 
                    note: 'SomeDay is a smart task-management web app inspired by Monday.com. It helps users organize tasks, plan ahead, and turn “someday” ideas into clear, actionable steps. This project was built as a full-stack team project, where I focused on creating a clean, intuitive user experience backed by a solid and scalable architecture.' 
                },
                { 
                    image: '/projects_section/someday-homepage.png', 
                    note: 'Users can organize multiple projects into clean, structured boards - similar to Monday.com📋 Each board keeps tasks and progress clearly separated, making it easy to manage teams and projects without clutter.' 
                },
                { 
                    image: '/projects_section/someday-board.png', 
                    note: 'Inside each board, tasks are managed in a clear table with priorities, statuses, assignees, and dates 🎯 Everything is visual and easy to scan, so teams can quickly see what’s critical, what’s done, and what needs attention next.' },
                { 
                    image: '/projects_section/someday-chat.png', 
                    note: 'Each task has its own discussion panel, allowing team members to leave updates, reply, and stay in sync 💬 This keeps communication tied directly to the task, instead of getting lost in external chats.' 
                },
                { 
                    image: '/projects_section/someday-kanban.png', 
                    note: 'Boards can also switch to a Kanban view, letting users track tasks visually as they move between statuses 🧩 This makes progress easy to follow at a glance and helps teams stay focused on what’s next.' 
                },
            ]
        },
        {
            title: 'Sheba-Connect',
            url: 'https://sheba-connect.vercel.app/',
            slides: [
                { 
                    image: '/projects_section/sheba-login.png', 
                    note: 'Sheba Connect is a healthcare web platform that lets patients securely access medical services online 🏥 Built as a full-stack project, the app focuses on simple, secure login and a smooth patient experience, making it easy to connect users with healthcare systems without friction.' 
                },
                { 
                    image: '/projects_section/sheba-welcome.png', 
                    note: 'After logging in, a welcoming home page for patients, designed to make first-time users feel comfortable and oriented 🩺 From here, patients can quickly create appointments and choose the medical specialty they need, with a clear and friendly flow.' 
                },
                { 
                    image: '/projects_section/sheba-doctor.png', 
                    note: 'Patients can select a doctor from a curated list, with helpful options like favorites and earliest availability ⭐🕒 This step keeps the booking process simple while giving users control over who they meet and when.' 
                },
                { 
                    image: '/projects_section/sheba-time.png', 
                    note: 'Patients can pick an available date and time through a clear, step-by-step calendar view 🗓️ This makes scheduling appointments fast, intuitive, and stress-free.' 
                },
                { 
                    image: '/projects_section/sheba-home.png', 
                    note: 'At homepage, patients can view and manage all their appointments in one place, including upcoming and past visits 📅 This gives them a clear overview of their medical history and easy access to schedule new appointments when needed.' 
                },
                { 
                    image: '/projects_section/sheba-edit.png', 
                    note: 'Each appointment has a detailed view where patients can see all relevant information and manage changes easily 🧾 From here, they can reschedule, cancel, or join virtual appointments with just a click.' 
                },
            ]
        },
        {
            title: 'Nextep',
            url: 'https://nextepp.vercel.app/#/user',
            slides: [
                { 
                    image: '/projects_section/nextep-login.png', 
                    note: 'Nextep is an AI-powered personal development app designed to help users turn long-term goals into clear, actionable paths 🚀 Built as a full-stack project, it combines a clean, focused interface with smart AI guidance to help users plan, track progress, and stay motivated over time.' 
                },
                { 
                    image: '/projects_section/nextep-start.png', 
                    note: 'Nextep starts by asking users to define their goal - including a clear title, description, and the time they want to give themselves to achieve it 🎯 This helps turn a vague idea into a concrete, time-bound objective from the very first step.' 
                },
                { 
                    image: '/projects_section/nextep-timeline1.png', 
                    note: 'Goals are visualized as a circular timeline, working like a stopwatch that represents the full time span ⏱️ An arrow shows the user’s current progress, and hovering over each step reveals detailed information about that stage, making long-term goals feel structured and trackable.' 
                },
                { 
                    image: '/projects_section/nextep-mentor1.png', 
                    note: 'Clicking the center of the timeline reveals an AI mentor that helps users plan how to achieve a specific step 🤖 It starts by asking a few key questions, such as how much time the user can invest, their current experience level, and other details needed to build a personalized path.' 
                },
                { 
                    image: '/projects_section/nextep-mentor2.png', 
                    note: 'After answering the mentor’s questions, Nextep generates several possible paths the user can choose from 🤖 Each path includes a clear summary and a step-by-step schedule, helping users pick the approach that fits them best and move forward with confidence.' 
                },
                { 
                    image: '/projects_section/nextep-timeline2.png', 
                    note: 'Once a path is selected, the timeline is automatically filled with concrete steps across the full time span 🧩 Users can edit each step, as well as add or remove steps manually, giving them full control over how their plan evolves.' 
                },
                { 
                    image: '/projects_section/nextep-timeline3.png', 
                    note: 'And for each of those steps, the user can create paths manually or with the AI mentor 🤖 This helps keep the journey organized and smooth, allowing big goals to be broken down into smaller, manageable milestones whenever needed.' 
                },
            ]
        },
    ]
}