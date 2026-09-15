import React from 'react';

export default function Navbar({ darkMode, onToggleTheme }) {
    return (
        <header className="navbar-wrapper">
            <nav className="navbar" aria-label="Main Navigation">
                <a href="#home" className="nav-logo">
                    Nirjak<span>.</span>
                </a>
                
                <div className="nav-links">
                    <a href="#home" className="nav-link">Home</a>
                    <a href="#about" className="nav-link">About</a>
                    <a href="#projects" className="nav-link">Projects</a>
                    <a href="#experience" className="nav-link">Experience</a>
                    <a href="#contact" className="nav-link">Contact</a>
                </div>

                <button 
                    className="theme-toggle" 
                    type="button" 
                    onClick={onToggleTheme} 
                    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {darkMode ? '☼' : '☾'}
                </button>
            </nav>
        </header>
    );
}