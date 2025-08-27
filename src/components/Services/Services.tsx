import React from 'react';
import './Services.css';

const Services: React.FC = () => {
  const services = [
    {
      id: 1,
      icon: 'fa-code',
      title: 'Web Development',
      description: 'Custom websites and web applications built with modern technologies'
    },
    {
      id: 2,
      icon: 'fa-mobile-alt',
      title: 'Mobile Development',
      description: 'Responsive design and mobile-first development approach'
    },
    {
      id: 3,
      icon: 'fa-paint-brush',
      title: 'UI/UX Design',
      description: 'Beautiful and intuitive user interface design'
    },
    {
      id: 4,
      icon: 'fa-database',
      title: 'Backend Development',
      description: 'Robust server-side applications and APIs'
    }
  ];

  return (
    <section id="services" className="screen">
      <div className="section-content">
        <h2>My Services</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-icon">
                <i className={`fas ${service.icon}`}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

