
import TimelineItem from '../components/TimelineItem';
import { careerHistory } from '../data/portfolioData';

const Career = () => {
  return (
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
  );
};

export default Career;
