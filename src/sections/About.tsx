import Scene3D from '../canvas/Scene3D';
import TypingText from '../components/TypingText';

const About = ({ scrollProgress }: { scrollProgress: number }) => {
  return (
    <section id="about" className="py-20 bg-gray-900/30 relative z-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4">
              革新的な技術で未来を創造
            </h3>
            <TypingText text="フルスタック開発者として、最新のWeb技術とAI技術を駆使して、ユーザーエクスペリエンスを重視した革新的なアプリケーションを開発しています。" />
            <TypingText text="常に新しい技術を学び続け、クリーンなコードと効率的なソリューションを提供することで、ビジネス価値の最大化を目指しています。" />
            <div className="flex space-x-6 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">5+</div>
                <div className="text-gray-400">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">50+</div>
                <div className="text-gray-400">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">20+</div>
                <div className="text-gray-400">Technologies</div>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center items-center w-80 h-80 cursor-grab active:cursor-grabbing">
            <Scene3D scrollProgress={scrollProgress} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;