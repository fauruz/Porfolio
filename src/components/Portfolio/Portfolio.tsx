import React from 'react';
import './Portfolio.css';

const Portfolio: React.FC = () => {
  const projects = [
    {
      id: 1,
      title: 'E-commerce Website',
      description: 'A modern e-commerce platform built with React and Node.js',
      image: 'https://via.placeholder.com/300x200/333/666?text=Project+1',
      tech: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      title: 'Portfolio Website',
      description: 'A responsive portfolio website showcasing creative work',
      image: 'https://via.placeholder.com/300x200/333/666?text=Project+2',
      tech: ['HTML5', 'CSS3', 'JavaScript']
    },
    {
      id: 3,
      title: 'Task Management App',
      description: 'A collaborative task management application',
      image: 'https://via.placeholder.com/300x200/333/666?text=Project+3',
      tech: ['React', 'Firebase', 'TypeScript']
    }
  ];

  return (
    <section id="portfolio" className="screen">
      <div className="section-content">
        <h2>My Portfolio</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech, index) => (
                    <span key={index} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;

