import React, { useEffect, useState } from 'react';
import './style.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import { getProjects, getExperiences } from './services/api';

export default function App() {
    const [projects, setProjects]           = useState([]);
    const [experiences, setExperiences]     = useState([]);
    const [projectsLoading, setProjectsLoading]     = useState(true);
    const [experiencesLoading, setExperiencesLoading] = useState(true);
    const [projectsError, setProjectsError]         = useState(null);
    const [experiencesError, setExperiencesError]   = useState(null);

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
            <Navbar />
            <main>
                <Hero />
                <ExperienceSection
                    experiences={experiences}
                    loading={experiencesLoading}
                    error={experiencesError}
                />
                <ProjectsSection
                    projects={projects}
                    loading={projectsLoading}
                    error={projectsError}
                />
            </main>
            <footer className="footer">
                <p className="footer-text">
                    Built with <span>React + Vite</span> &nbsp;·&nbsp;
                    Data from <span>Supabase</span> &nbsp;·&nbsp;
                    API via <span>Spring Boot</span>
                </p>
            </footer>
        </>
    );
}