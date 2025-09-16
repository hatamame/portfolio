import { useState, useEffect, useRef, ReactNode, FC } from 'react';
import { ChevronDown, Github, ExternalLink, Mail, Linkedin, Code2, Cpu, Database, Brain, Briefcase, GraduationCap, Cake } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TorusKnot } from '@react-three/drei';
import { Mesh } from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

// --- Loading Animation Component ---
const LoadingAnimation: FC<{ onFinished: () => void }> = ({ onFinished }) => {
  const [typedText, setTypedText] = useState('');
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const loadingSequence = [
    { text: 'SYSTEM CHECK INITIATED...', duration: 1500 },
    { text: 'CONNECTING TO MAIN SERVER...', duration: 1800 },
    { text: 'LOADING ASSETS & TEXTURES...', duration: 2200 },
    { text: 'STARTING ENGINE SEQUENCE...', duration: 2500 },
    { text: 'WELCOME ABOARD.', duration: 1000 },
  ];

  useEffect(() => {
    let sequenceTimeout: number;
    let exitTimeout: number;
    let progressInterval: number;

    const runSequence = (index: number) => {
      if (index >= loadingSequence.length) {
        setIsExiting(true);
        exitTimeout = window.setTimeout(onFinished, 1000); // Fade out duration
        return;
      }

      const current = loadingSequence[index];
      let i = 0;
      const typingInterval = setInterval(() => {
        setTypedText(current.text.substring(0, i + 1));
        i++;
        if (i > current.text.length) {
          clearInterval(typingInterval);
        }
      }, 50);

      sequenceTimeout = window.setTimeout(() => {
        runSequence(index + 1);
      }, current.duration);
    };

    runSequence(0);

    const totalDuration = loadingSequence.reduce((acc, curr) => acc + curr.duration, 0) + 500;
    const startTime = Date.now();
    progressInterval = window.setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsedTime / totalDuration) * 100);
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
      }
    }, 50);

    return () => {
      clearTimeout(sequenceTimeout);
      clearTimeout(exitTimeout);
      clearInterval(progressInterval);
    };
  }, [onFinished]);

  return (
    <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center z-[100] text-cyan-400 font-mono transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      <div className="w-48 h-48 mb-8 relative">
        <svg className={`w-full h-full transition-transform duration-1000 ease-in-out ${isExiting ? '-translate-y-[150vh] rotate-45' : 'animate-rocket-idle'}`} viewBox="0 0 200 200">
          <path d="M100 20 L140 100 L120 120 L120 180 L80 180 L80 120 L60 100 Z" fill="#e0e0e0" />
          <circle cx="100" cy="80" r="15" fill="#22d3ee" stroke="#333" strokeWidth="4" />
          <path d="M60 100 L40 140 L60 120 Z" fill="#c0c0c0" />
          <path d="M140 100 L160 140 L140 120 Z" fill="#c0c0c0" />
          <path d="M80 180 Q100 220 120 180 L100 170 Z" fill="#ffac33" className="animate-flame" />
        </svg>
      </div>
      <div className="w-80 h-auto text-left p-4 bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg">
        <p className="text-lg text-white mb-2">{'>'} System Status:</p>
        <div className="h-6 mb-2">
          <span className="text-cyan-400">{typedText}</span>
          <span className="animate-pulse ml-1">_</span>
        </div>
        <div className="w-full bg-gray-800/50 border border-cyan-500/20 rounded-full h-2.5">
          <div className="bg-cyan-400 h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
        </div>
      </div>
    </div>
  );
};


// --- Custom Hook for Scroll Animation ---
const useAnimateOnScroll = (options?: IntersectionObserverInit) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      options
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return [ref, isVisible] as const;
};

// --- 3D Components ---
const FuturisticObject = () => {
  const outerRef = useRef<Mesh>(null!);
  const innerRef = useRef<Mesh>(null!);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const mouseX = state.mouse.x;
    const mouseY = state.mouse.y;

    if (outerRef.current) {
      outerRef.current.rotation.y += (mouseX - outerRef.current.rotation.y) * 0.05;
      outerRef.current.rotation.x += (-mouseY - outerRef.current.rotation.x) * 0.05;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= delta * 0.5;
      innerRef.current.rotation.x -= delta * 0.5;
      const scale = 1 + 0.1 * Math.sin(time * 2);
      innerRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group rotation-y={Math.PI / 4}>
      <TorusKnot ref={outerRef} args={[1.8, 0.5, 200, 32]}>
        <meshPhysicalMaterial
          roughness={0.05}
          metalness={0.1}
          transmission={1.0}
          ior={1.33}
          thickness={1.5}
          transparent
        />
      </TorusKnot>
      <TorusKnot ref={innerRef} args={[0.8, 0.2, 100, 16]}>
        <meshStandardMaterial color="#00f5ff" emissive="#00f5ff" emissiveIntensity={4} />
      </TorusKnot>
    </group>
  );
};

const Scene3D = () => {
  return (
    <Canvas camera={{ position: [0, 0, 7] }}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} color="#00f5ff" intensity={3} />
      <pointLight position={[-10, -10, -10]} color="#ff007f" intensity={3} />
      <FuturisticObject />
      <OrbitControls enableZoom={false} enablePan={false} />
      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.1} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
};

// --- Type Definitions ---
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
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  items: string[];
}

interface CareerEvent {
  icon: React.ComponentType<{ className?: string }>;
  date: string;
  title: string;
  company: string;
  description: string;
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

// --- Reusable Components ---
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
          <div className="absolute top-0 left-0 text-red-500 opacity-70 transform translate-x-1" aria-hidden="true">
            {children}
          </div>
          <div className="absolute top-0 left-0 text-cyan-500 opacity-70 transform -translate-x-1" aria-hidden="true">
            {children}
          </div>
        </>
      )}
    </div>
  );
};

const ProjectCard = ({ project, index }: { project: Project, index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cardRef, isVisible] = useAnimateOnScroll({ threshold: 0.1 });

  return (
    <div
      ref={cardRef}
      className={`group relative bg-gray-900/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg overflow-hidden transition-all ease-out duration-700 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={project.github}
            aria-label={`${project.title} GitHub`}
            className="p-2 bg-gray-800/80 rounded-full hover:bg-cyan-500/20 transition-colors"
          >
            <Github className="w-5 h-5 text-cyan-400" />
          </a>
          <a
            href={project.live}
            aria-label={`${project.title} Live Demo`}
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
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent transform -skew-x-12 animate-shimmer" />
      )}
    </div>
  );
};

const SkillCard = ({ skill, index }: { skill: Skill, index: number }) => {
  const IconComponent = skill.icon;
  const [cardRef, isVisible] = useAnimateOnScroll({ threshold: 0.1 });

  return (
    <div
      ref={cardRef}
      className={`group bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 transition-all ease-out duration-700 transform hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/10 rounded-lg mb-4 group-hover:bg-cyan-500/20 transition-colors">
          <IconComponent className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
        </div>
        <h3 className="text-xl font-bold text-white">{skill.name}</h3>
      </div>
      <div className="space-y-2">
        {skill.items.map((item) => (
          <div
            key={item}
            className="text-gray-300 text-sm p-2 bg-gray-700/30 rounded"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

const TimelineItem = ({ item, index }: { item: CareerEvent, index: number }) => {
  const [itemRef, isVisible] = useAnimateOnScroll({ threshold: 0.5 });
  const IconComponent = item.icon;
  const isLeft = index % 2 === 0;

  return (
    <div ref={itemRef} className="relative">
      <div className={`flex items-center ${isLeft ? 'flex-row-reverse' : ''}`}>
        <div className={`w-1/2 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
          <div
            className={`bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 transition-all duration-700 ease-out transform hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/20 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 ' + (isLeft ? 'translate-x-12' : '-translate-x-12')}`}
          >
            <p className="text-sm text-cyan-400 mb-1">{item.date}</p>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-md text-gray-400 mb-3">{item.company}</p>
            <p className="text-sm text-gray-300 leading-relaxed">{item.description}</p>
          </div>
        </div>
        <div className="w-1/2 flex justify-center">
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 rounded-full border-4 border-gray-900" />
          <div className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-cyan-500/10 rounded-full flex items-center justify-center transition-transform duration-500 ${isVisible ? 'scale-100' : 'scale-0'}`}>
            <IconComponent className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---
const App = () => {
  const [showPortfolio, setShowPortfolio] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const isLoaded = showPortfolio; // Link isLoaded to showPortfolio state
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const projects: Project[] = [
    {
      id: 1,
      title: "sticky-flow",
      description: "オンライン付箋ツール。リアルタイムコラボレーションを搭載。",
      tech: ["React", "Python", "TensorFlow", "D3.js"],
      github: "https://github.com/hatamame/stickey-flow",
      live: "https://stickey-flow.vercel.app/",
      image: "img/sticky-flow.png"
    },
    {
      id: 2,
      title: "SUDOKU",
      description: "オンライン数独ゲーム。デイリーチャレンジによる無限の楽しみ方。",
      tech: ["Solidity", "Web3.js", "React", "Node.js"],
      github: "https://github.com/hatamame/sudoku-game",
      live: "https://sudoku-game-ten-fawn.vercel.app/",
      image: "img/SUDOKU.png"
    },
    {
      id: 3,
      title: "html-practice-course",
      description: "WebSocketを使用したリアルタイムHTML学習プラットフォーム。",
      tech: ["React", "Socket.io", "Node.js", "MongoDB"],
      github: "https://github.com/hatamame/HTML-practice-course",
      live: "https://html-practice-course-nu.vercel.app/",
      image: "img/html-practice-course.png"
    },
    {
      id: 4,
      title: "AI競馬予想アプリ",
      description: "OpenAI APIと機械学習を活用した競馬予想アプリ。",
      tech: ["React", "TypeScript", "OpenAI API", "Tailwind CSS"],
      github: "https://github.com/hatamame/horserace",
      live: "https://horserace-nine.vercel.app/",
      image: "img/keiba-app.png"
    }
  ];

  const skills: Skill[] = [
    { icon: Code2, name: "Frontend", items: ["React", "TypeScript", "Vue.js", "Next.js"] },
    { icon: Database, name: "Backend", items: ["Node.js", "Python", "PostgreSQL", "supabase", "firebase"] },
    { icon: Cpu, name: "DevOps", items: ["Docker", "AWS", "CI/CD", "Kubernetes"] },
    { icon: Brain, name: "AI/ML", items: ["TensorFlow", "PyTorch", "OpenAI API", "Computer Vision"] },
  ];

  const careerHistory: CareerEvent[] = [
    {
      icon: Cake,
      date: "2002/04/24",
      title: "誕生",
      company: "千葉県船橋市",
      description: "千葉県船橋市で誕生。幼少期からテクノロジーに興味を持つ。",
    },
    {
      icon: GraduationCap,
      date: "2009 - 2015",
      title: "小学校卒業",
      company: "船橋市立船橋小学校",
      description: "地元の小学校で基礎学力と協調性を養う。",
    },
    {
      icon: GraduationCap,
      date: "2015 - 2021",
      title: "中学・高校卒業",
      company: "芝中学・高等学校",
      description: "プログラミングを始め、初めてコードを書く。デザインと技術の融合に興味を持つ。",
    },
    {
      icon: GraduationCap,
      date: "2021 - 2025",
      title: "学士(外国研究)取得",
      company: "上智大学",
      description: "ロシア語を専攻しつつ、データ構造、アルゴリズム、ソフトウェア工学の基礎を学ぶ。",
    },
    {
      icon: Briefcase,
      date: "2025 - ",
      title: "現職",
      company: "日本トーター株式会社",
      description: "Webアプリケーションのフロントエンド開発を担当。ReactとTypeScriptを使用し、UIコンポーネントの実装とテストに従事。",
    },
  ];

  // Particle effect
  useEffect(() => {
    if (!isLoaded) return; // Only run when portfolio is shown

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

    let animationFrameId: number;
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

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

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded]);

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
      const sections = ['hero', 'about', 'skills', 'career', 'projects', 'contact'];
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
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />

      <div
        className="fixed w-96 h-96 rounded-full opacity-20 pointer-events-none z-0 transition-all duration-1000 ease-out"
        style={{
          background: 'radial-gradient(circle, #00f5ff 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        aria-hidden="true"
      />

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

      <main>
        <section id="hero" className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center max-w-4xl mx-auto px-6">
            <div className={`transition-opacity duration-1000 ${isLoaded ? 'opacity-100 animate-fadeInUp' : 'opacity-0'}`}>
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
              aria-label="Scroll to about section"
            >
              <ChevronDown className="w-8 h-8 text-cyan-400" />
            </button>
          </div>
        </section>

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
              <div className="relative flex justify-center items-center w-80 h-80 cursor-grab active:cursor-grabbing">
                <Scene3D />
              </div>
            </div>
          </div>
        </section>

        <section id="skills" className="py-20 bg-gray-900/30 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">Technical Skills</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {skills.map((skill, index) => (
                <SkillCard key={skill.name} skill={skill} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="career" className="py-20 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">Career Path</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto" />
            </div>
            <div className="relative">
              <div className="absolute left-1/2 top-0 h-full w-0.5 bg-cyan-500/30" />
              <div className="space-y-16">
                {careerHistory.map((item, index) => (
                  <TimelineItem key={index} item={item} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="py-20 relative z-10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">Featured Projects</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-6" />
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                最新技術を活用したプロジェクトをご紹介します
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-gray-900/30 relative z-10">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-6">Get In Touch</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-8" />
            <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
              新しいプロジェクトのご相談や技術的なディスカッションなど、
              お気軽にお声がけください。素晴らしいものを創造しましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <a
                href="mailto:haruta_tsukada@totor.co.jp"
                className="flex items-center space-x-3 px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <Mail className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-cyan-400">haruta_tsukada@totor.co.jp</span>
              </a>
              <a
                href="https://github.com/hatamame"
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
      </main>

      <footer className="py-8 border-t border-gray-800 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2025 haruta tsukada. All rights reserved.</p>
          <p className="mt-2 text-sm">Made with ❤️ using React, TypeScript & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

export default App;