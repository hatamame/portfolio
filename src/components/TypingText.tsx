import { useState, useEffect, FC } from 'react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

const TypingText: FC<{ text: string; className?: string }> = ({ text, className = "" }) => {
    const [typedText, setTypedText] = useState('');
    const [ref, isVisible] = useAnimateOnScroll({ threshold: 0.8 });

    useEffect(() => {
        if (isVisible) {
            let i = 0;
            const typingInterval = setInterval(() => {
                i++;
                setTypedText(text.substring(0, i));
                if (i >= text.length) {
                    clearInterval(typingInterval);
                }
            }, 30);
            return () => clearInterval(typingInterval);
        }
    }, [isVisible, text]);

    return (
        <p ref={ref} className={`text-gray-300 leading-relaxed font-mono ${className}`}>
            {typedText}
            {typedText.length < text.length && <span className="animate-pulse ml-1 bg-cyan-400 w-[2px] h-5 inline-block"></span>}
        </p>
    );
};

export default TypingText;