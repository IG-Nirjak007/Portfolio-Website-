import React, { useEffect, useState } from 'react';
import './style.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import { getProjects, getExperiences } from './services/api';

const LOCAL_PROJECTS = [
    { id: 'career-hub', title: 'Career Hub', description: 'A focused platform for discovering opportunities, building profiles, and connecting ambitious people with meaningful work.', technologies: 'React, Spring Boot, PostgreSQL', link: 'https://github.com/nirjak', category: 'Product design' },
    { id: 'himalayan-trail', title: 'The Himalayan Trail', description: 'A visual trail guide for finding the next unforgettable route through Nepal\'s landscapes.', technologies: 'React, Maps, JavaScript', link: 'https://github.com/nirjak', category: 'Exploration' },
    { id: 'ventis', title: 'Ventis', description: 'An elegant weather and location experience that turns everyday data into a calmer decision.', technologies: 'React, APIs, CSS', link: 'https://github.com/nirjak', category: 'Web experience' }
];

const LOCAL_EXPERIENCES = [
    { id: 'internship', role: 'Software Engineering Intern', company: 'Internship', location: 'Kathmandu, Nepal', start_date: '2025', end_date: 'Present', description: 'Building practical full-stack products with Java, Spring Boot, React, and thoughtful interface design.' },
    { id: 'bachelors', role: 'Bachelor of Science in Computer Science', company: 'Herald College Kathmandu', location: 'Kathmandu, Nepal', start_date: '2022', end_date: '2026', description: 'Studying software engineering, systems, and the craft of turning ideas into useful digital experiences.' }
];

export default function App() {
    const [projects, setProjects]           = useState([]);
    const [experiences, setExperiences]     = useState([]);
    const [projectsLoading, setProjectsLoading]     = useState(true);
    const [experiencesLoading, setExperiencesLoading] = useState(true);
    const [projectsError, setProjectsError]         = useState(null);
    const [experiencesError, setExperiencesError]   = useState(null);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('portfolio-theme') !== 'light');
    const displayedProjects = projects.length > 0 ? projects : LOCAL_PROJECTS;
    const displayedExperiences = experiences.length > 0 ? experiences : LOCAL_EXPERIENCES;

    useEffect(() => {
        document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
        localStorage.setItem('portfolio-theme', darkMode ? 'dark' : 'light');
    }, [darkMode]);

    useEffect(() => {
        getProjects()
            .then(data => setProjects(data))
            .catch(err => setProjectsError(err.message))
            .finally(() => setProjectsLoading(false));

        getExperiences()
            .then(data => setExperiences(data))
            .catch(err => setExperiencesError(err.message))
            .finally(() => setExperiencesLoading(false));
    }, []);

    return (
        <>
            <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode(value => !value)} />
            <main>
                <Hero />
                <ExperienceSection
                    experiences={displayedExperiences}
                    loading={experiencesLoading}
                    error={experiencesError}
                />
                <ProjectsSection
                    projects={displayedProjects}
                    loading={projectsLoading}
                    error={projectsError}
                />
            </main>
            <section id="contact" className="contact-section">
                <div className="contact-inner">
                    <div>
                        <div className="section-eyebrow">Have a good idea?</div>
                        <h2 className="contact-title">Let&apos;s make something worth remembering.</h2>
                    </div>
                    <div className="contact-copy">
                        <p>I&apos;m always open to thoughtful collaborations, interesting problems, and conversations about the web.</p>
                        <div className="social-links">
                            <a className="social-link" href="mailto:nirjak@gmail.com">Email</a>
                            <a className="social-link" href="https://github.com/nirjak" target="_blank" rel="noreferrer">GitHub</a>
                            <a className="social-link" href="https://www.linkedin.com/in/nirjak/" target="_blank" rel="noreferrer">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="footer">
                <p className="footer-text">
                    NIRJAK <span>2026</span>
                </p>
                <small>Built with React + Vite</small>
            </footer>
        </>
    );
}