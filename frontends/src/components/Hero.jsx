import React from 'react';

const TECH = ['Spring Boot', 'React', 'Supabase', 'PostgreSQL', 'Java', 'Vite'];

export default function Hero() {
    return (
        <section id="about" className="hero">
            {/* Ambient orbs */}
            <div className="hero-orb hero-orb-1" />
            <div className="hero-orb hero-orb-2" />

            {/* Available badge */}
            <div className="hero-badge">
                <span className="hero-badge-dot" />
                Available for opportunities
            </div>

            <h1 className="hero-title">
                Full-Stack<br /><span className="accent-word">Developer</span>
            </h1>

            <p className="hero-sub">
                Building scalable full-stack applications with Spring Boot, React,
                and Supabase — focused on clean architecture and great user experiences.
            </p>

            <div className="hero-actions">
                <a href="#projects" className="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    View Projects
                </a>
                <a href="#experience" className="btn btn-outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                    </svg>
                    Experience
                </a>
            </div>

            <div className="hero-tech-stack">
                <span className="tech-label">Built with</span>
                <div className="tech-pills">
                    {TECH.map(t => (
                        <span key={t} className="tech-pill">{t}</span>
                    ))}
                </div>
            </div>
        </section>
    );
}