import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import About from './components/About/About';
import Portfolio from './components/Portfolio/Portfolio';
import Services from './components/Services/Services';
import Contact from './components/Contact/Contact';
import { useScrollSnap } from './hooks/useScrollSnap';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  useScrollSnap();

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.screen');
      let current = '';
      
      sections.forEach(section => {
        const htmlSection = section as HTMLElement;
        const sectionTop = htmlSection.offsetTop;
        const sectionHeight = htmlSection.clientHeight;
        
        if (window.pageYOffset >= (sectionTop - 200)) {
          current = htmlSection.getAttribute('id') || '';
        }
      });
      
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="App">
      <Header activeSection={activeSection} />
      <Home />
      <About />
      <Portfolio />
      <Services />
      <Contact />
    </div>
  );
}

export default App;

