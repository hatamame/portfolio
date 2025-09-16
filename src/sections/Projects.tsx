
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/portfolioData';

const Projects = () => {
  return (
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
  );
};

export default Projects;
