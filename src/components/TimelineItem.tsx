import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import type { CareerEvent } from '../types';
import BootingText from './BootingText';

const TimelineItem = ({ item, index }: { item: CareerEvent, index: number }) => {
  const [itemRef, isVisible] = useAnimateOnScroll({ threshold: 0.5 });
  const IconComponent = item.icon;
  const isLeft = index % 2 === 0;

  return (
    <div
      ref={itemRef}
      className="relative"
    >
      <div className={`flex items-center ${isLeft ? 'flex-row-reverse' : ''}`}>
        <div className={`w-1/2 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
          <div
            className={`bg-gray-800/50 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 ' + (isLeft ? 'translate-x-12' : '-translate-x-12')}`}
          >
            <p className="text-sm text-cyan-400 mb-1">{item.date}</p>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-md text-gray-400 mb-3">{item.company}</p>
            <BootingText
              text={item.description}
              startCondition={isVisible}
              className="text-sm text-gray-300 leading-relaxed min-h-[60px] font-mono"
            />
          </div>
        </div>
        <div className="w-1/2 flex justify-center">
          <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-500 rounded-full border-4 border-gray-900" />
          <div className={`absolute top-1/2 -translate-y-1/2 w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center transition-transform duration-500 ${isVisible ? 'scale-100' : 'scale-0'}`}>
            <IconComponent className={`w-8 h-8 text-cyan-400 transition-transform duration-300 ${isVisible ? 'animate-spin-once' : ''}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;