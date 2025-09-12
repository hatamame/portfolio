import { useState, useEffect, useRef, ReactNode } from 'react';
import { ChevronDown, Github, ExternalLink, Mail, Linkedin, Code2, Cpu, Database, Brain, Settings } from 'lucide-react';

// 型定義
interface Project {
  id: number;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  image: string;
}

interface Skill {
  icon: React.ElementType;
  name: string;
  items: string[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // プロジェクトデータ
  const projects: Project[] = [
    {
      id: 1,
      title: "AI-Powered Dashboard",
      description: "機械学習を活用したリアルタイム分析ダッシュボード。データの可視化と予測分析機能を搭載。",
      tech: ["React", "Python", "TensorFlow", "D3.js"],
      github: "#",
      live: "#",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23000'/%3E%3Ccircle cx='100' cy='125' r='30' fill='%2300f5ff' opacity='0.6'/%3E%3Ccircle cx='200' cy='80' r='25' fill='%23ff007f' opacity='0.6'/%3E%3Ccircle cx='300' cy='150' r='35' fill='%2300ff88' opacity='0.6'/%3E%3Cpath d='M100 125 L200 80 L300 150' stroke='%23fff' stroke-width='2' fill='none' opacity='0.8'/%3E%3C/svg%3E"
    },
    {
      id: 2,
      title: "Blockchain Voting System",
      description: "セキュアな投票システム。ブロックチェーン技術により透明性と改ざん防止を実現。",
      tech: ["Solidity", "Web3.js", "React", "Node.js"],
      github: "#",
      live: "#",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23111'/%3E%3Cg%3E%3Crect x='50' y='50' width='80' height='50' fill='%23333' stroke='%2300ff88' stroke-width='2'/%3E%3Crect x='160' y='50' width='80' height='50' fill='%23333' stroke='%2300ff88' stroke-width='2'/%3E%3Crect x='270' y='50' width='80' height='50' fill='%23333' stroke='%2300ff88' stroke-width='2'/%3E%3Crect x='50' y='150' width='80' height='50' fill='%23333' stroke='%2300ff88' stroke-width='2'/%3E%3Crect x='160' y='150' width='80' height='50' fill='%23333' stroke='%2300ff88' stroke-width='2'/%3E%3Crect x='270' y='150' width='80' height='50' fill='%23333' stroke='%2300ff88' stroke-width='2'/%3E%3C/g%3E%3C/svg%3E"
    },
    {
      id: 3,
      title: "Real-time Chat App",
      description: "WebSocketを使用したリアルタイムチャットアプリ。暗号化通信とファイル共有機能付き。",
      tech: ["React", "Socket.io", "Node.js", "MongoDB"],
      github: "#",
      live: "#",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23000'/%3E%3Crect x='50' y='50' width='300' height='150' fill='%23111' stroke='%2300f5ff' stroke-width='2'/%3E%3Crect x='70' y='70' width='200' height='20' fill='%2300f5ff' opacity='0.3'/%3E%3Crect x='70' y='100' width='150' height='20' fill='%23ff007f' opacity='0.3'/%3E%3Crect x='70' y='130' width='180' height='20' fill='%2300ff88' opacity='0.3'/%3E%3Ccircle cx='320' cy='80' r='15' fill='%2300f5ff'/%3E%3C/svg%3E"
    }
  ];

  const skills: Skill[] = [
    { icon: Code2, name: "Frontend", items: ["React", "TypeScript", "Vue.js", "Next.js"] },
    { icon: Database, name: "Backend", items: ["Node.js", "Python", "PostgreSQL", "MongoDB"] },
    { icon: Cpu, name: "DevOps", items: ["Docker", "AWS", "CI/CD", "Kubernetes"] },
    { icon: Brain, name: "AI/ML", items: ["TensorFlow", "PyTorch", "OpenAI API", "Computer Vision"] },
  ];

  // パーティクル効果
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 50;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class ParticleImpl implements Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;

      constructor() {
        this.x = canvas ? Math.random() * canvas.width : 0;
        this.y = canvas ? Math.random() * canvas.height : 0;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (canvas && (this.x < 0 || this.x > canvas.width)) this.vx *= -1;
        if (canvas && (this.y < 0 || this.y > canvas.height)) this.vy *= -1;
      }

      draw(context: CanvasRenderingContext2D) {
        context.globalAlpha = this.opacity;
        context.fillStyle = '#00f5ff';
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new ParticleImpl());
    }

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      // パーティクル間の接続線
      particles.forEach((particle, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p2.x - particle.x;
          const dy = p2.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.globalAlpha = (100 - distance) / 100 * 0.1;
            ctx.strokeStyle = '#00f5ff';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
    setIsLoaded(true);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // マウス追従効果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // スクロールによるセクション検出
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'projects', 'contact'];
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
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const GlitchText = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
    const [glitch, setGlitch] = useState(false);

    useEffect(() => {
      const interval = setInterval(() => {
        setGlitch(true);
        setTimeout(() => setGlitch(false), 200);
      }, 3000);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className={`relative ${className}`}>
        <div className={`transition-all duration-200 ${glitch ? 'animate-pulse' : ''}`}>
          {children}
        </div>
        {glitch && (
          <>
            <div className="absolute top-0 left-0 text-red-500 opacity-70 transform translate-x-1">
              {children}
            </div>
            <div className="absolute top-0 left-0 text-cyan-500 opacity-70 transform -translate-x-1">
              {children}
            </div>
          </>
        )}
      </div>
    );
  };

  const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div
        className={`group relative bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 ${isLoaded ? 'animate-slideUp' : ''
          }`}
        style={{ animationDelay: `${index * 200}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <a
              href={project.github}
              className="p-2 bg-gray-800/80 rounded-full hover:bg-cyan-500/20 transition-colors"
            >
              <Github className="w-5 h-5 text-cyan-400" />
            </a>
            <a
              href={project.live}
              className="p-2 bg-gray-800/80 rounded-full hover:bg-cyan-500/20 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-cyan-400" />
            </a>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-cyan-400 mb-3 group-hover:text-cyan-300 transition-colors">
            {project.title}
          </h3>
          <p className="text-gray-300 mb-4 leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* ホバー時の光の効果 */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent transform -skew-x-12 animate-shimmer" />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 背景パーティクル */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* マウス追従グラデーション */}
      <div
        className="fixed w-96 h-96 rounded-full opacity-20 pointer-events-none z-0 transition-all duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, #00f5ff 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* ナビゲーション */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-lg border-b border-cyan-500/20">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">
              <GlitchText>
                <span className="text-cyan-400">{'<'}</span>
                <span className="text-white">DevName</span>
                <span className="text-cyan-400">{'/>'}</span>
              </GlitchText>
            </div>
            <div className="hidden md:flex space-x-8">
              {['about', 'skills', 'projects', 'contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize hover:text-cyan-400 transition-colors relative ${activeSection === item ? 'text-cyan-400' : 'text-gray-300'
                    }`}
                >
                  {item}
                  {activeSection === item && (
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center max-w-4xl mx-auto px-6">
          <div className={`transition-all duration-1000 ${isLoaded ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <GlitchText>
                <span className="text-cyan-400">Full Stack</span>
                <br />
                <span className="text-white">Developer</span>
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
          >
            <ChevronDown className="w-8 h-8 text-cyan-400" />
          </button>
        </div>
      </section>

      {/* About セクション */}
      <section id="about" className="py-20 relative z-10">
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
              <p className="text-gray-300 leading-relaxed">
                フルスタック開発者として、最新のWeb技術とAI技術を駆使して、
                ユーザーエクスペリエンスを重視した革新的なアプリケーションを開発しています。
              </p>
              <p className="text-gray-300 leading-relaxed">
                常に新しい技術を学び続け、クリーンなコードと効率的なソリューションを
                提供することで、ビジネス価値の最大化を目指しています。
              </p>
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
            <div className="relative">
              <div className="w-80 h-80 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-20 animate-pulse" />
                <div className="absolute inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute inset-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Settings className="w-16 h-16 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills セクション */}
      <section id="skills" className="py-20 bg-gray-900/30 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">Technical Skills</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <div
                  key={skill.name}
                  className={`group bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/20 ${isLoaded ? 'animate-slideUp' : 'opacity-0'
                    }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-lg mb-4 group-hover:bg-cyan-500/20 transition-colors">
                      <IconComponent className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {skill.items.map((item, i) => (
                      <div
                        key={i}
                        className="text-gray-300 text-sm p-2 bg-gray-700/30 rounded hover:bg-gray-700/50 transition-colors"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Projects セクション */}
      <section id="projects" className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">Featured Projects</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-6" />
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              最新技術を活用した革新的なプロジェクトをご紹介します
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact セクション */}
      <section id="contact" className="py-20 bg-gray-900/30 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">Get In Touch</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8" />
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            新しいプロジェクトのご相談や技術的なディスカッションなど、
            お気軽にお声がけください。一緒に素晴らしいものを創造しましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <a
              href="mailto:contact@example.com"
              className="flex items-center space-x-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <Mail className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-cyan-400">contact@example.com</span>
            </a>
            <a
              href="https://github.com"
              className="flex items-center space-x-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <Github className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-cyan-400">GitHub</span>
            </a>
            <a
              href="https://linkedin.com"
              className="flex items-center space-x-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <Linkedin className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-cyan-400">LinkedIn</span>
            </a>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-8 border-t border-gray-800 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2024 DevName Portfolio. All rights reserved.</p>
          <p className="mt-2 text-sm">Made with ❤️ using React, TypeScript & Tailwind CSS</p>
        </div>
      </footer>

      {/* カスタムCSS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out forwards;
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;