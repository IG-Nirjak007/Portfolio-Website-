import React, { useState, useEffect } from 'react';

export default function Navbar({ darkMode, onToggleTheme }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <a href="#about" className="nav-logo">NIRJAK<span>.</span></a>
            <div className="nav-links">
                <a href="#about"      className="nav-link">About</a>
                <a href="#experience" className="nav-link">Experience</a>
                <a href="#projects"   className="nav-link">Projects</a>
                <a href="#contact"    className="nav-link">Contact</a>
            </div>
            <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                {darkMode ? '☼' : '☾'}
            </button>
        </nav>
    );
}