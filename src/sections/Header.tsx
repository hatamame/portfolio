
import GlitchText from '../components/GlitchText';

interface HeaderProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const Header = ({ activeSection, scrollToSection }: HeaderProps) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-cyan-500/20">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <a href="#hero" className="text-2xl font-bold">
            <GlitchText>
              <span className="text-cyan-400">{'<'}</span>
              <span className="text-white">DevName</span>
              <span className="text-cyan-400">{'/>'}</span>
            </GlitchText>
          </a>
          <div className="hidden md:flex space-x-8">
            {['about', 'skills', 'career', 'projects', 'contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`capitalize hover:text-cyan-400 transition-colors relative ${activeSection === item ? 'text-cyan-400' : 'text-gray-300'
                  }`}
              >
                {item}
                {activeSection === item && (
                  <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
