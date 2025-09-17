import { useState, MouseEvent } from 'react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import type { Skill } from '../types';

const SkillCard = ({ skill, index }: { skill: Skill, index: number }) => {
  const IconComponent = skill.icon;
  const [cardRef, isVisible] = useAnimateOnScroll({ threshold: 0.1 });
  const [glowStyle, setGlowStyle] = useState({});

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGlowStyle({
      background: `radial-gradient(circle at ${x}px ${y}px, rgba(34, 211, 238, 0.15), transparent 40%)`,
    });
  };

  const handleMouseLeave = () => {
    setGlowStyle({});
  };


  return (
    <div
      ref={cardRef}
      className={`group relative bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-cyan-500/20 hover:border-cyan-500/50 transition-all ease-out duration-700 transform hover:transform hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute inset-0 transition-all duration-300 rounded-lg pointer-events-none"
        style={glowStyle}
      />
      <div className="relative z-10">
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
    </div>
  );
};

export default SkillCard;
