import React from 'react';

function LoadingState() {
    return (
        <div className="state-container">
            <div className="state-spinner" />
            <p className="state-title">Loading experiences…</p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="state-container">
            <span className="state-icon">📭</span>
            <p className="state-title">No experiences yet</p>
            <p className="state-sub">Add rows to the <code>experience</code> table in Supabase.</p>
        </div>
    );
}

function ErrorState({ message }) {
    return (
        <div className="state-container">
            <span className="state-icon">⚠️</span>
            <p className="state-title state-error">Failed to load experiences</p>
            <p className="state-sub">{message}</p>
        </div>
    );
}

const EMOJI = ['💼', '🚀', '⚡', '🎯', '🔥', '✨'];

export default function ExperienceSection({ experiences, loading, error }) {
    return (
        <section id="experience" className="section experience-section">
            <div className="section-inner">
                <div className="section-header">
                    <div className="section-eyebrow">The path so far</div>
                    <h2 className="section-title">Experience & education</h2>
                    <div className="section-divider" />
                </div>

                {loading && <LoadingState />}
                {!loading && error && <ErrorState message={error} />}
                {!loading && !error && experiences.length === 0 && <EmptyState />}

                {!loading && !error && experiences.length > 0 && (
                    <div className="experience-timeline">
                        {experiences.map((exp, i) => (
                            <div
                                key={exp.id}
                                className="experience-card"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                <div className="exp-timeline-dot">
                                    {EMOJI[i % EMOJI.length]}
                                </div>
                                <div className="exp-body">
                                    <div className="exp-header">
                                        <span className="exp-role">{exp.role}</span>
                                        <span className="exp-company">{exp.company}</span>
                                    </div>
                                    <div className="exp-meta">
                                        {exp.location && (
                                            <span>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                                    <circle cx="12" cy="10" r="3"/>
                                                </svg>
                                                {exp.location}
                                            </span>
                                        )}
                                        {(exp.start_date || exp.startDate) && (
                                            <span>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                                    <line x1="16" y1="2" x2="16" y2="6"/>
                                                    <line x1="8" y1="2" x2="8" y2="6"/>
                                                    <line x1="3" y1="10" x2="21" y2="10"/>
                                                </svg>
                                                {exp.start_date || exp.startDate} – {exp.end_date || exp.endDate || 'Present'}
                                            </span>
                                        )}
                                    </div>
                                    {exp.description && (
                                        <p className="exp-description">{exp.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}