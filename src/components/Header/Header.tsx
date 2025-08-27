import React from 'react';
import './Header.css';

interface HeaderProps {
  activeSection: string;
}

const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header>
      <a href="#" className="logo" onClick={() => scrollToSection('home')}>
        Fauruz
      </a>

      <nav>
        <a 
          href="#home" 
          className={activeSection === 'home' ? 'active' : ''}
          onClick={() => scrollToSection('home')}
        >
          Home
        </a>
        <a 
          href="#about" 
          className={activeSection === 'about' ? 'active' : ''}
          onClick={() => scrollToSection('about')}
        >
          About
        </a>
        <a 
          href="#portfolio" 
          className={activeSection === 'portfolio' ? 'active' : ''}
          onClick={() => scrollToSection('portfolio')}
        >
          Portfolio
        </a>
        <a 
          href="#services" 
          className={activeSection === 'services' ? 'active' : ''}
          onClick={() => scrollToSection('services')}
        >
          Services
        </a>
        <a 
          href="#contact" 
          className={activeSection === 'contact' ? 'active' : ''}
          onClick={() => scrollToSection('contact')}
        >
          Contact
        </a>   
      </nav>
    </header>
  );
};

export default Header;

