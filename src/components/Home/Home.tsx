import React from 'react';
import { useEffect, useState } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const [currentText, setCurrentText] = useState(0);
  const texts = ['Web Developer', 'Software Developer', 'Full Stack Developer'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [texts.length]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="screen home">
      <div className="home-container">
        <div className="home-img">
          <img src="/main.jpg" alt="Fauruz's photo" />
        </div>
        <div className="home-content">
          <h1>Hi it's <span>Fauruz</span></h1>
          <h3 className="typing-text">
            I'm a <span>{texts[currentText]}</span>
          </h3>
          <p>Web Developer, Designer, and Programmer</p>
          <div className="social-icons">
            <a href="#" className="fa-brands fa-linkedin"></a>
            <a href="#" className="fa-brands fa-github"></a>
            <a href="#" className="fa-brands fa-facebook"></a>
          </div>
          <a 
            href="#contact" 
            className="btn"
            onClick={() => scrollToSection('contact')}
          >
            Hire me
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;

