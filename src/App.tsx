import { useState, useEffect } from 'react';

// Components
import LoadingAnimation from './components/LoadingAnimation';
import HiddenContent from './components/HiddenContent';
import SecretButton from './components/SecretButton';


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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showHiddenPage, setShowHiddenPage] = useState(false);
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

      const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      // Avoid division by zero on pages that don't scroll
      setScrollProgress(totalScrollableHeight > 0 ? currentScroll / totalScrollableHeight : 0);

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

  if (showHiddenPage) {
    return <HiddenContent backToPortfolio={() => setShowHiddenPage(false)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden animate-fadeIn">
      <ParticleCanvas scrollProgress={scrollProgress} />

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
        <About scrollProgress={scrollProgress} />
        <Skills />
        <Career />
        <Projects />
        <Game setGameCompleted={setGameCompleted} />
        <Contact />
      </main>

      <Footer />
      {gameCompleted && <SecretButton onClick={() => setShowHiddenPage(true)} />}
    </div>
  );
};

export default App;