import React from 'react';

function LoadingState() {
    return (
        <div className="state-container">
            <div className="state-spinner" />
            <p className="state-title" style={{ color: '#ffffff' }}>Loading experiences…</p>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="state-container">
            <span className="state-icon">📭</span>
            <p className="state-title" style={{ color: '#ffffff' }}>No experiences yet</p>
            <p className="state-sub" style={{ color: '#cccccc' }}>Add rows to the <code>experience</code> table in Supabase.</p>
        </div>
    );
}

function ErrorState({ message }) {
    return (
        <div className="state-container">
            <span className="state-icon">⚠️</span>
            <p className="state-title state-error" style={{ color: '#ff6b6b' }}>Failed to load experiences</p>
            <p className="state-sub" style={{ color: '#cccccc' }}>{message}</p>
        </div>
    );
}

export default function ExperienceSection({ experiences, loading, error }) {
  return (
    <section id="experience" style={{
      backgroundColor: '#121212', // Matches your deep dark background
      color: '#e0e0e0',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Title matches your serif/elegant typography style */}
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontFamily: 'serif', 
          fontWeight: 'normal',
          marginBottom: '40px',
          color: '#ffffff'
        }}>
          Experience & education
        </h2>

        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} />}
        {!loading && !error && experiences.length === 0 && <EmptyState />}

        {/* Timeline Container */}
        {!loading && !error && experiences.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {experiences.map((item) => (
              <div 
                key={item.id} 
                style={{
                  display: 'grid',
                  gridTemplateColumns: '250px 1fr', // Separates date/meta from main description smoothly
                  gap: '24px',
                  borderBottom: '1px solid #2a2a2a',
                  paddingBottom: '24px'
                }}
              >
                {/* Left Column: Timeline & Dates */}
                <div>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px', 
                    color: '#888888',
                    display: 'block',
                    marginBottom: '4px'
                  }}>
                    {item.start_date || item.startDate} — {item.end_date || item.endDate || 'Present'}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#aaaaaa', display: 'block' }}>
                    {item.location}
                  </span>
                </div>

                {/* Right Column: Role details */}
                <div>
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    margin: '0 0 6px 0', 
                    color: '#ffffff',
                    fontWeight: '500'
                  }}>
                    {item.role}
                  </h3>
                  <h4 style={{ 
                    fontSize: '1rem', 
                    margin: '0 0 12px 0', 
                    color: '#d4af37', // A warm elegant accent color fitting your layout style
                    fontWeight: 'normal'
                  }}>
                    {item.company}
                  </h4>
                  <p style={{ 
                    fontSize: '0.95rem', 
                    lineHeight: '1.6', 
                    color: '#cccccc', 
                    margin: '0' 
                  }}>
                    {item.description}
                  </p>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}