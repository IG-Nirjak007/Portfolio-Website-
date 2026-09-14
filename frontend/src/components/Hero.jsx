import React from 'react';
import profileImg from '../assets/profile.jpg';

const TECH = ['React', 'Java', 'Spring Boot', 'JavaScript', 'SQL'];

export default function Hero() {
    return (
        <section id="about" className="hero">
            <div className="hero-copy">
                <p className="eyebrow">Hello, I’m NIRJAK</p>
                <h1 className="hero-title">I make the web feel <em>human.</em></h1>
                <p className="hero-sub">A developer and curious builder based in Kathmandu. I care about clean code, clear ideas, and digital experiences that leave people better than I found them.</p>

            <div className="hero-actions">
                <a href="#projects" className="btn btn-primary">
                    See my work <span>↗</span>
                </a>
                <a href="mailto:nirjak@gmail.com" className="btn btn-outline">
                    Let’s talk <span>↗</span>
                </a>
            </div>

            <div className="hero-tech-stack">
                <span className="tech-label">I work with</span>
                <div className="tech-pills">
                    {TECH.map(t => (
                        <span key={t} className="tech-pill">{t}</span>
                    ))}
                </div>
            </div>
            </div>

            <div className="hero-art">
                <div className="hero-image-wrap">
                    <img src={profileImg} alt="Nirjak" />
                </div>
                <div className="hero-stamp">WEB<br/>DEV</div>
                <div className="hero-line hero-line-one"></div>
                <div className="hero-line hero-line-two"></div>
            </div>

        </section>
    );
}