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
            <p className="state-title">No experience entries found</p>
        </div>
    );
}

function ErrorState({ message }) {
    return (
        <div className="state-container">
            <p className="state-title state-error">Failed to load experiences: {message}</p>
        </div>
    );
}

export default function ExperienceSection({ experiences, loading, error }) {
    return (
        <section id="experience" className="experience-section">
            <h2 className="section-heading" style={{ textAlign: 'center' }}>Experience & Education</h2>

            {loading && <LoadingState />}
            {!loading && error && <ErrorState message={error} />}
            {!loading && !error && experiences.length === 0 && <EmptyState />}

            {!loading && !error && experiences.length > 0 && (
                <div className="experience-timeline">
                    {experiences.map((item) => {
                        const startDate = item.start_date || item.startDate || '';
                        const endDate = item.end_date || item.endDate || 'Present';
                        const dateRange = startDate ? `${startDate} — ${endDate}` : endDate;

                        return (
                            <div key={item.id} className="experience-card">
                                <div className="exp-timeline-dot" />
                                <div className="exp-date-location">
                                    {dateRange} {item.location ? `• ${item.location}` : ''}
                                </div>
                                <h3 className="exp-role">{item.role}</h3>
                                <div className="exp-company">{item.company}</div>
                                {item.description && (
                                    <p className="exp-description">{item.description}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}