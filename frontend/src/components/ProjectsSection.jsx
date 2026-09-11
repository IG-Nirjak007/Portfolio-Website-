import React from 'react';

const PROJECT_ICONS = ['🛠️', '🔬', '🌐', '📱', '⚙️', '🎨', '🤖', '📊'];

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
            <span className="state-icon">🗂️</span>
            <p className="state-title">No projects yet</p>
            <p className="state-sub">Add rows to the <code>project</code> table in Supabase.</p>
        </div>
    );
}

function ErrorState({ message }) {
    return (
        <div className="state-container">
            <span className="state-icon">⚠️</span>
            <p className="state-title state-error">Failed to load projects</p>
            <p className="state-sub">{message}</p>
        </div>
    );
}

export default function ProjectsSection({ projects, loading, error }) {
    return (
        <section id="projects" className="section projects-section">
            <div className="section-inner">
                <div className="section-header">
                    <div className="section-eyebrow">Selected work</div>
                    <h2 className="section-title">Things I’ve made</h2>
                    <div className="section-divider" />
                </div>

                {loading && <LoadingState />}
                {!loading && error && <ErrorState message={error} />}
                {!loading && !error && projects.length === 0 && <EmptyState />}

                {!loading && !error && projects.length > 0 && (
                    <div className="projects-grid">
                        {projects.map((proj, i) => {
                            const techList = proj.technologies
                                ? proj.technologies.split(',').map(t => t.trim()).filter(Boolean)
                                : [];
                            const dateLabel = proj.date_label || proj.dateLabel;

                            return (
                                <div
                                    key={proj.id}
                                    className="project-card"
                                    style={{ animationDelay: `${i * 0.08}s` }}
                                >
                                    {proj.image && <img className="project-image" src={proj.image} alt="" />}
                                    <div>
                                        <div className="project-card-top"><span className="project-category">{proj.category || 'Featured project'}</span><a href={proj.link || '#'} target="_blank" rel="noreferrer" aria-label={`Open ${proj.title}`}>↗</a></div>
                                        <h3 className="project-title">{proj.title}</h3>
                                        {dateLabel && (
                                            <div className="project-date">
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                                </svg>
                                                {dateLabel}
                                            </div>
                                        )}
                                    </div>
                                    {proj.description && (
                                        <p className="project-description">{proj.description}</p>
                                    )}
                                    {techList.length > 0 && (
                                        <div className="project-tech">
                                            {techList.map(tag => (
                                                <span key={tag} className="project-tech-tag">{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}