import React from 'react';

const TECH_DATA = [
    {
        category: 'Languages',
        icon: '💻',
        tools: ['JavaScript', 'HTML5', 'CSS3', 'Python', 'Java', 'SQL']
    },
    {
        category: 'Frameworks & Libraries',
        icon: '⚡',
        tools: ['React', 'Node.js', 'Express', 'Flask', 'TensorFlow']
    },
    {
        category: 'Database & Backend',
        icon: '🗄️',
        tools: ['MongoDB (MERN)', 'PostgreSQL', 'Spring Boot', 'Supabase']
    },
    {
        category: 'Developer Tools',
        icon: '🛠️',
        tools: ['Git', 'GitHub', 'VS Code', 'Postman']
    }
];

export default function ToolsSection() {
    return (
        <section className="tools-section">
            <h2 className="section-heading">Tools & Technologies I Use</h2>

            <div className="tools-grid">
                {TECH_DATA.map((cat) => (
                    <div key={cat.category} className="tools-category-card">
                        <h3 className="tools-category-title">
                            <span>{cat.icon}</span> {cat.category}
                        </h3>
                        <div className="tools-badges">
                            {cat.tools.map((tool) => (
                                <span key={tool} className="tool-badge">
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="tools-icon-strip">
                <span className="icon-strip-item">JS</span>
                <span className="icon-strip-item">React</span>
                <span className="icon-strip-item">Node.js</span>
                <span className="icon-strip-item">Python</span>
                <span className="icon-strip-item">Java</span>
                <span className="icon-strip-item">Spring Boot</span>
                <span className="icon-strip-item">Flask</span>
                <span className="icon-strip-item">TensorFlow</span>
                <span className="icon-strip-item">PostgreSQL</span>
                <span className="icon-strip-item">Supabase</span>
            </div>
        </section>
    );
}
