import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qmxsgacspqmevbtkjtix.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFteHNnYWNzcHFtZXZidGtqdGl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzMjAzNDMsImV4cCI6MjEwMzg5NjM0M30.Zo8KdqdOYUiPcpKNy3AjOG4KflNaUrNc_o3je2zdnTM';
const supabase = createClient(supabaseUrl, supabaseKey);

const PROJECTS = [
    {
        title: 'Child Safe Browsing & Monitoring System',
        description: 'A browser-based real-time content moderation system using text/image analysis, TF-IDF, Logistic Regression, CNN image classification, and a JWT-authenticated parent dashboard.',
        technologies: 'JavaScript, Python, Flask, TensorFlow, Chrome Extension',
        link: 'https://github.com/IG-Nirjak007/ChildSafe-BrowingExtension-AI',
        category: 'Machine Learning / Web Safety'
    },
    {
        title: 'PawTrace AI Canine Disease System',
        description: 'Deep learning computer vision system to automate canine health issue detection and disease identification from image data.',
        technologies: 'Python, Deep Learning, CNN, Computer Vision',
        link: 'https://github.com/IG-Nirjak007/Python_extra_class',
        category: 'Computer Vision / AI'
    },
    {
        title: 'Full-Stack Portfolio Website',
        description: 'Personal portfolio application featuring dynamic Supabase data fetching, local fallbacks, theme toggling, and a Spring Boot backend.',
        technologies: 'React, Vite, Java, Spring Boot, Supabase, PostgreSQL',
        link: 'https://github.com/IG-Nirjak007/Portfolio-Website-',
        category: 'Full-Stack Web App'
    },
    {
        title: 'OpenCart QA & Automated Testing',
        description: 'Formal software quality assurance project performing automated and manual testing on the OpenCart platform.',
        technologies: 'TypeScript, Quality Assurance, Automated Testing',
        link: 'https://github.com/IG-Nirjak007/QA-automation-testing',
        category: 'Software Testing / QA'
    },
    {
        title: 'Full-Stack To-Do List Application',
        description: 'Web application built with a Java Spring Boot REST API backend using SQLite3 via JPA and a clean React user interface.',
        technologies: 'React, Java, Spring Boot, REST API, SQLite3',
        link: 'https://github.com/IG-Nirjak007/Simple-To-Do-List',
        category: 'Full-Stack Development'
    },
    {
        title: 'MERN Stack E-Commerce Platform',
        description: 'Responsive e-commerce web application featuring product listings, end-to-end database schema design, and payment integration.',
        technologies: 'MongoDB, Express, React, Node.js (MERN)',
        link: 'https://github.com/IG-Nirjak007/Web_Project',
        category: 'E-Commerce'
    }
];

const EXPERIENCES = [
    {
        role: 'Software Engineering Intern',
        company: 'Info Developers Pvt. Ltd.',
        location: 'Sanepa, Lalitpur',
        start_date: 'August 3, 2026',
        end_date: 'Present',
        description: 'Contributing to full-stack software development, Java/Spring Boot backend API implementations, and enterprise web applications.'
    },
    {
        role: 'B.Sc. in Computer Science & Information Technology',
        company: 'National College of Computer Studies (NCCS), TU',
        location: 'Kathmandu, Nepal',
        start_date: '2022',
        end_date: 'Present',
        description: 'Studying full-stack development, machine learning, software engineering, and software quality assurance.'
    },

    {
        role: '+2 Science',
        company: 'National Institute of Science and Technology (NIST), NEB',
        location: 'Kathmandu, Nepal',
        start_date: '2020',
        end_date: '2021',
        description: 'Completed high school education with a focus on science, mathematics, and computer technology fundamentals.'
    }
];

async function run() {
    console.log("Deleting all projects...");
    await supabase.from('project').delete().gt('id', 0);
    
    console.log("Inserting new projects...");
    const projRes = await supabase.from('project').insert(PROJECTS);
    console.log(projRes.error ? projRes.error : "Success inserting projects");

    console.log("Deleting all experiences...");
    await supabase.from('experience').delete().gt('id', 0);
    
    console.log("Inserting new experiences...");
    const expRes = await supabase.from('experience').insert(EXPERIENCES);
    console.log(expRes.error ? expRes.error : "Success inserting experiences");

    console.log("Database reset complete.");
}

run();
