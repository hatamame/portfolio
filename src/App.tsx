import { useState, useEffect } from 'react';

// Components
import LoadingAnimation from './components/LoadingAnimation';

// Sections
import Header from './sections/Header';
import Hero from './sections/Hero';
import About from './sections/About';
import Skills from './sections/Skills';
import Career from './sections/Career';
import Projects from './sections/Projects';
import Game from './sections/Game';
import Contact from './sections/Contact';
import Footer from './sections/Footer';

// Canvas
import ParticleCanvas from './canvas/ParticleCanvas';

const App = () => {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isLoaded = showPortfolio;

  // Mouse follow effect
  useEffect(() => {
    if (!isLoaded) return;
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isLoaded]);

  // Section detection on scroll
  useEffect(() => {
    if (!isLoaded) return;
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'career', 'projects', 'game', 'contact']; // 'game' を追加
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element && scrollPosition >= element.offsetTop && scrollPosition < element.offsetTop + element.offsetHeight) {
          setActiveSection(sectionId);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoaded]);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!showPortfolio) {
    return <LoadingAnimation onFinished={() => setShowPortfolio(true)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden animate-fadeIn">
      <ParticleCanvas />

      <div
        className="fixed w-96 h-96 rounded-full opacity-20 pointer-events-none z-0 transition-all duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, #00f5ff 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        aria-hidden="true"
      />

      <Header activeSection={activeSection} scrollToSection={scrollToSection} />

      <main>
        <Hero isLoaded={isLoaded} scrollToSection={scrollToSection} />
        <About />
        <Skills />
        <Career />
        <Projects />
        <Game /> {/* 追加 */}
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default App;