import React from 'react';
import profileImg from '../assets/profile.jpg';

export default function Hero() {
    return (
        <section id="home" className="hero-section">
            <div className="hero-avatar-wrap">
                <img src={profileImg} alt="Nirjak Bhattarai" className="hero-avatar-img" />
            </div>

            <h2 className="hero-greeting">Hi! I’m Nirjak Bhattarai</h2>

            <h1 className="hero-headline">
                A Full Stack Developer passionate about crafting clean, efficient, and modern web experiences.
            </h1>

            <p className="hero-bio">
                I have a strong interest in building engaging and user-friendly web applications, with a keen focus on technologies like React, JavaScript, Python, and Java. I love building machine learning solutions, full-stack systems, and continuously learning to solve practical problems through technology. My goal is to craft seamless, responsive interfaces and robust backend systems while contributing to innovative tech projects.
            </p>

            <div className="hero-actions">
                <a href="#projects" className="btn-pill btn-pill-primary">
                    View My Work <span>→</span>
                </a>
                <a href="#contact" className="btn-pill btn-pill-outline">
                    My Resume <span>⤓</span>
                </a>
            </div>
        </section>
    );
}