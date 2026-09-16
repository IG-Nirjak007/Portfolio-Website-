import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './style.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ToolsSection from './components/ToolsSection';
import ExperienceSection from './components/ExperienceSection';
import ProjectsSection from './components/ProjectsSection';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { getProjects, getExperiences, getSocialLinks, getResumeUrl } from './services/api';

export const LOCAL_PROJECTS = [
    {
        id: 'child-safe-browsing',
        title: 'Child Safe Browsing & Monitoring System',
        description: 'A browser-based real-time content moderation system using text/image analysis, TF-IDF, Logistic Regression, CNN image classification, and a JWT-authenticated parent dashboard.',
        technologies: 'JavaScript, Python, Flask, TensorFlow, Chrome Extension',
        link: 'https://github.com/IG-Nirjak007/ChildSafe-BrowingExtension-AI',
        category: 'Machine Learning / Web Safety'
    },
    {
        id: 'pawtrace-ai',
        title: 'PawTrace AI Canine Disease System',
        description: 'Deep learning computer vision system to automate canine health issue detection and disease identification from image data.',
        technologies: 'Python, Deep Learning, CNN, Computer Vision',
        link: 'https://github.com/IG-Nirjak007/Python_extra_class',
        category: 'Computer Vision / AI'
    },
    {
        id: 'portfolio-website',
        title: 'Full-Stack Portfolio Website',
        description: 'Personal portfolio application featuring dynamic Supabase data fetching, local fallbacks, theme toggling, and a Spring Boot backend.',
        technologies: 'React, Vite, Java, Spring Boot, Supabase, PostgreSQL',
        link: 'https://github.com/IG-Nirjak007/Portfolio-Website-',
        category: 'Full-Stack Web App'
    },
    {
        id: 'qa-opencart-testing',
        title: 'OpenCart QA & Automated Testing',
        description: 'Formal software quality assurance project performing automated and manual testing on the OpenCart platform.',
        technologies: 'TypeScript, Quality Assurance, Automated Testing',
        link: 'https://github.com/IG-Nirjak007/QA-automation-testing',
        category: 'Software Testing / QA'
    },
    {
        id: 'simple-todo-list',
        title: 'Full-Stack To-Do List Application',
        description: 'Web application built with a Java Spring Boot REST API backend using SQLite3 via JPA and a clean React user interface.',
        technologies: 'React, Java, Spring Boot, REST API, SQLite3',
        link: 'https://github.com/IG-Nirjak007/Simple-To-Do-List',
        category: 'Full-Stack Development'
    },
    {
        id: 'mern-ecommerce',
        title: 'MERN Stack E-Commerce Platform',
        description: 'Responsive e-commerce web application featuring product listings, end-to-end database schema design, and payment integration.',
        technologies: 'MongoDB, Express, React, Node.js (MERN)',
        link: 'https://github.com/IG-Nirjak007/Web_Project',
        category: 'E-Commerce'
    }
];

export const LOCAL_EXPERIENCES = [
    {
        id: 'intern-infodev',
        role: 'Software Engineering Intern',
        company: 'Info Developers Pvt. Ltd.',
        location: 'Sanepa, Lalitpur',
        start_date: 'August 3, 2026',
        end_date: 'Present',
        description: 'Contributing to full-stack software development, Java/Spring Boot backend API implementations, and enterprise web applications.'
    },
    {
        id: 'education-nccs',
        role: 'B.Sc. in Computer Science & Information Technology',
        company: 'National College of Computer Studies (NCCS), TU',
        location: 'Kathmandu, Nepal',
        start_date: '2022',
        end_date: 'Present',
        description: 'Studying full-stack development, machine learning, software engineering, and software quality assurance.'
    },
    {
        id: 'education-nist',
        role: '+2 Science',
        company: 'National Institute of Science and Technology (NIST), NEB',
        location: 'Kathmandu, Nepal',
        start_date: '2020',
        end_date: '2021',
        description: 'Completed high school education with a focus on science, mathematics, and computer technology fundamentals.'
    }
];

// ─── Portfolio Page ───────────────────────────────────────────────────────────
function PortfolioPage() {
    const [projects, setProjects] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [socialLinks, setSocialLinks] = useState([]);
    const [resumeUrl, setResumeUrl] = useState('');
    const [projectsLoading, setProjectsLoading] = useState(true);
    const [experiencesLoading, setExperiencesLoading] = useState(true);
    const [projectsError, setProjectsError] = useState(null);
    const [experiencesError, setExperiencesError] = useState(null);
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('portfolio-theme') !== 'light');

    const displayedProjects = [...projects];
    LOCAL_PROJECTS.forEach(lp => {
        if (!projects.some(p => p.title === lp.title)) {
            displayedProjects.push(lp);
        }
    });

    const displayedExperiences = [...experiences];
    LOCAL_EXPERIENCES.forEach(le => {
        if (!experiences.some(e => e.role === le.role && e.company === le.company)) {
            displayedExperiences.push(le);
        }
    });

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

        getSocialLinks()
            .then(data => setSocialLinks(data))
            .catch(err => console.error('Failed to load social links:', err));

        getResumeUrl()
            .then(url => setResumeUrl(url))
            .catch(() => {});
    }, []);

    return (
        <>
            <Navbar darkMode={darkMode} onToggleTheme={() => setDarkMode(value => !value)} />
            <main>
                <Hero resumeUrl={resumeUrl} />
                <AboutSection />
                <ToolsSection />
                <ProjectsSection
                    projects={displayedProjects}
                    loading={projectsLoading}
                    error={projectsError}
                />
                <ExperienceSection
                    experiences={displayedExperiences}
                    loading={experiencesLoading}
                    error={experiencesError}
                />
            </main>

            <section id="contact" className="contact-section">
                <h2 className="section-heading">Let&apos;s Connect</h2>
                <p className="contact-text">
                    I&apos;m always open to thoughtful collaborations, interesting engineering challenges, and conversations about modern full-stack web and ML solutions.
                </p>
                <div className="contact-links">
                    <a className="contact-link" href="mailto:nirjakbhattarai1@gmail.com">
                        ✉️ Email Me
                    </a>
                    <a className="contact-link" href="tel:+9779865369292" id="contact-phone">
                        📞 +977 9865369292
                    </a>
                    {socialLinks.length > 0 ? (
                        socialLinks.map(link => (
                            <a key={link.id} className="contact-link" href={link.url} target="_blank" rel="noreferrer">
                                {link.platform} ↗
                            </a>
                        ))
                    ) : (
                        <>
                            <a className="contact-link" href="https://github.com/IG-Nirjak007" target="_blank" rel="noreferrer">
                                GitHub ↗
                            </a>
                            <a className="contact-link" href="https://instagram.com/Nirjak__007" target="_blank" rel="noreferrer">
                                Instagram ↗
                            </a>
                        </>
                    )}
                    {resumeUrl && (
                        <a
                            className="contact-link"
                            href={resumeUrl}
                            download="Nirjak_Resume.pdf"
                            target="_blank"
                            rel="noreferrer"
                            id="contact-resume-download"
                        >
                            ⤓ Download CV
                        </a>
                    )}
                </div>
            </section>

            <footer className="footer">
                <p>
                    © {new Date().getFullYear()} Nirjak Bhattarai<span>.</span> All Rights Reserved.
                </p>
            </footer>
        </>
    );
}

// ─── App with Router ──────────────────────────────────────────────────────────
export default function App() {
    // Sync theme on admin pages too
    useEffect(() => {
        const saved = localStorage.getItem('portfolio-theme');
        document.documentElement.dataset.theme = saved === 'light' ? 'light' : 'dark';
    }, []);

    return (
        <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="/auth/login" element={<AdminLogin />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}