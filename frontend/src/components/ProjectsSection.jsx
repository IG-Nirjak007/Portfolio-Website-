import React from 'react';

function LoadingState() {
    return (
        <div className="state-container">
            <div className="state-spinner" />
            <p className="state-title">Loading projects…</p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="state-container">
            <p className="state-title">No projects found</p>
        </div>
    );
}

function ErrorState({ message }) {
    return (
        <div className="state-container">
            <p className="state-title state-error">Failed to load projects: {message}</p>
        </div>
    );
}

export default function ProjectsSection({ projects, loading, error }) {
    return (
        <section id="projects" className="projects-section">
            <h2 className="section-heading" style={{ textAlign: 'center' }}>Featured Projects</h2>

            {loading && <LoadingState />}
            {!loading && error && <ErrorState message={error} />}
            {!loading && !error && projects.length === 0 && <EmptyState />}

            {!loading && !error && projects.length > 0 && (
                <div className="projects-grid">
                    {projects.map((proj) => {
                        const techList = proj.technologies
                            ? proj.technologies.split(',').map(t => t.trim()).filter(Boolean)
                            : [];

                        return (
                            <div key={proj.id} className="project-card">
                                <div>
                                    <div className="project-card-header">
                                        <span className="project-category">
                                            {proj.category || 'Featured Work'}
                                        </span>
                                        {proj.link && (
                                            <a
                                                href={proj.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="project-link-icon"
                                                aria-label={`Open ${proj.title}`}
                                                title="View Source / Demo"
                                            >
                                                ↗
                                            </a>
                                        )}
                                    </div>
                                    <h3 className="project-title">{proj.title}</h3>
                                    <p className="project-description">{proj.description}</p>
                                </div>

                                {techList.length > 0 && (
                                    <div className="project-tech-pills">
                                        {techList.map((tag) => (
                                            <span key={tag} className="project-tech-tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}