import { useRef, useEffect } from 'react';
import type { Particle } from '../types';

const ParticleCanvas = ({ scrollProgress }: { scrollProgress: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(scrollProgress);

  // Keep scrollRef updated without re-triggering the main effect
  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);


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
        // Apply a subtle parallax effect based on scroll
        this.y += this.vy + (scrollRef.current - 0.5) * 0.25;

        if (canvas && (this.x < 0 || this.x > canvas.width)) this.vx *= -1;
        if (canvas && (this.y < 0 || this.y > canvas.height)) {
          // Reset particle to the opposite side for a continuous flow
          if (this.vy > 0 && this.y > canvas.height) {
            this.y = 0;
          } else if (this.vy < 0 && this.y < 0) {
            this.y = canvas.height;
          }
        }
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default ParticleCanvas;