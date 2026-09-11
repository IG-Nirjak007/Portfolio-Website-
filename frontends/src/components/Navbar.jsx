import React, { useState, useEffect } from 'react';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="nav-logo">✦ NIRJAK G</div>
            <div className="nav-links">
                <a href="#about"      className="nav-link">About</a>
                <a href="#experience" className="nav-link">Experience</a>
                <a href="#projects"   className="nav-link">Projects</a>
            </div>
        </nav>
    );
}