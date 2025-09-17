
import { ChevronDown } from 'lucide-react';
import GlitchText from '../components/GlitchText';

interface HeroProps {
  isLoaded: boolean;
  scrollToSection: (sectionId: string) => void;
}

const Hero = ({ isLoaded, scrollToSection }: HeroProps) => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative z-10">
      <div className="text-center max-w-4xl mx-auto px-6">
        <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100 animate-fadeInUp' : 'opacity-0'}`}>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <GlitchText>
              <span className="text-cyan-400">Full Stuck.</span>
              <br />
              <span className="text-white">Full Power.</span>
            </GlitchText>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            最新技術で革新的なWebアプリケーションを創造
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => scrollToSection('projects')}
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1"
            >
              プロジェクトを見る
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 font-semibold rounded-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              お問い合わせ
            </button>
          </div>
        </div>
        <button
          onClick={() => scrollToSection('about')}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          aria-label="Scroll to about section"
        >
          <ChevronDown className="w-8 h-8 text-cyan-400" />
        </button>
      </div>
    </section>
  );
};

export default Hero;
