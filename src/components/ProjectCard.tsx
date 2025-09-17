import { useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import type { Project } from '../types';

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
        <p className="text-gray-300 mb-4 leading-relaxed h-20 transition-opacity duration-300 group-hover:opacity-0">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 absolute bottom-6 px-6 left-0 w-full">
          {project.tech.map((tech, i) => (
            <span
              key={tech}
              className="px-3 py-1 text-xs bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              style={{ transitionDelay: `${i * 50}ms` }}
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

export default ProjectCard;