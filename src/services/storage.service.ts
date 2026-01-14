export const storageService = {
    getMeFact,
    getFunFacts,
    getProjects,
    getContact,
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
                    note: 'SomeDay is a smart task-management web app inspired by Monday.com 🚀 It helps teams turn messy ideas into clear plans and actually get things done. Built as a full-stack team project with a strong focus on UX and real-world workflows.' 
                },
                { 
                    image: '/projects_section/someday-homepage.png', 
                    note: 'All your projects live in one place - clean, organized, and easy to jump between 📂✨' 
                },
                { 
                    image: '/projects_section/someday-board.png', 
                    note: 'Tasks are laid out clearly, so you instantly know what matters and what’s done 🎯' 
                },
                { 
                    image: '/projects_section/someday-chat.png', 
                    note: 'Each task has its own conversation, keeping discussions exactly where they belong 💬🧠' 
                },
                { 
                    image: '/projects_section/someday-kanban.png', 
                    note: 'Need a visual flow? Switch to Kanban and watch tasks move forward 🔄📊' 
                },
            ]
        },
        {
            title: 'Sheba-Connect',
            url: 'https://sheba-connect.vercel.app/',
            slides: [
                { 
                    image: '/projects_section/sheba-login.png', 
                    note: 'Sheba Connect is a healthcare platform that lets patients book and manage medical appointments online 🏥🔐 Built as a full-stack project, focusing on clarity, security, and patient trust.' 
                },
                { 
                    image: '/projects_section/sheba-welcome.png', 
                    note: 'A warm, welcoming home screen that helps patients feel comfortable from the first moment 👋🩺' 
                },
                { 
                    image: '/projects_section/sheba-doctor.png', 
                    note: 'Pick a doctor easily - favorites and earliest availability included ⭐🕒' 
                },
                { 
                    image: '/projects_section/sheba-time.png', 
                    note: 'Choosing a date and time is simple, fast, and stress-free 🗓️✨' 
                },
                { 
                    image: '/projects_section/sheba-home.png', 
                    note: 'All appointments are clearly organized in one personal dashboard 📋📅' 
                },
                { 
                    image: '/projects_section/sheba-edit.png', 
                    note: 'View details, reschedule, cancel, or join a virtual visit - all in one place 🧾💻' 
                },
            ]
        },
        {
            title: 'Nextep',
            url: 'https://nextepp.vercel.app/#/user',
            slides: [
                { 
                    image: '/projects_section/nextep-login.png', 
                    note: 'Nextep is an AI-powered personal growth app that helps turn big life goals into real, achievable plans 🚀🤖 Built to combine structure, motivation, and smart AI guidance.' 
                },
                { 
                    image: '/projects_section/nextep-start.png', 
                    note: 'It starts by asking one simple thing: what do you actually want to achieve? 🎯' 
                },
                { 
                    image: '/projects_section/nextep-timeline1.png', 
                    note: 'Goals are shown on a circular timeline, so progress always feels visible and real ⏱️📍' 
                },
                { 
                    image: '/projects_section/nextep-mentor1.png', 
                    note: 'Click the center and an AI mentor jumps in to help plan the next move 🤖💡' 
                },
                { 
                    image: '/projects_section/nextep-mentor2.png', 
                    note: 'Based on your answers, the mentor suggests different paths you can choose from 🛤️✨' 
                },
                { 
                    image: '/projects_section/nextep-timeline2.png', 
                    note: 'Pick a path and the timeline fills itself with clear, actionable steps 🧩📈' 
                },
                { 
                    image: '/projects_section/nextep-timeline3.png', 
                    note: 'Each step can be edited, split, or rebuilt - so big goals never feel overwhelming 🛠️💪' 
                },
            ]
        },
    ]
}


function getContact() {

    return (
        [
            {title: 'LinkedIn', icon: 'fa-brands fa-linkedin', color1: '#4d98e3', color2: '#0B66C3', url: 'https://www.linkedin.com/in/sean-gah-712794308/'},
            {title: 'Gmail', icon: 'fa-solid fa-envelope', color1: '#ff776b', color2: '#EA4335', url: 'https://mail.google.com/mail/?view=cm&fs=1&to=seangah8@gmail.com'},
            {title: 'GitHub', icon: 'fa-brands fa-github',   color1: '#3d4a5c', color2: '#151B23', url: 'https://github.com/seangah8'},
        ]
    )
        
}
