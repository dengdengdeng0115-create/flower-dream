import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store/useStore';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  type: 'firefly' | 'petal';
  color: string;
  life: number;
  maxLife: number;
  angle: number;
  speed: number;
}

interface WindPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const windPointsRef = useRef<WindPoint[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0 });
  const animationRef = useRef<number>(0);
  const settings = useStore((state) => state.settings);

  const createParticle = useCallback((type: 'firefly' | 'petal'): Particle => {
    const canvas = canvasRef.current;
    if (!canvas) return null as unknown as Particle;

    const density = settings.particleDensity;

    if (type === 'firefly') {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        type: 'firefly',
        color: `hsl(${120 + Math.random() * 40}, 80%, ${70 + Math.random() * 20}%)`,
        life: 0,
        maxLife: Infinity,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2,
      };
    } else {
      return {
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 1,
        vy: Math.random() * 1 + 0.5,
        size: Math.random() * 6 + 3,
        opacity: Math.random() * 0.6 + 0.2,
        type: 'petal',
        color: ['#ffb6c1', '#ffc0cb', '#ff69b4', '#dda0dd', '#f8e6e6'][
          Math.floor(Math.random() * 5)
        ],
        life: 0,
        maxLife: 600 + Math.random() * 400,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.3 + 0.1,
      };
    }
  }, [settings.particleDensity]);

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fireflyCount = Math.floor(40 * settings.particleDensity);
    const petalCount = Math.floor(25 * settings.particleDensity);

    particlesRef.current = [];

    for (let i = 0; i < fireflyCount; i++) {
      particlesRef.current.push(createParticle('firefly'));
    }

    for (let i = 0; i < petalCount; i++) {
      const p = createParticle('petal');
      p.y = Math.random() * canvas.height;
      particlesRef.current.push(p);
    }
  }, [createParticle, settings.particleDensity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.vx = e.clientX - prevX;
      mouseRef.current.vy = e.clientY - prevY;

      if (Math.abs(mouseRef.current.vx) > 2 || Math.abs(mouseRef.current.vy) > 2) {
        windPointsRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: mouseRef.current.vx * 0.3,
          vy: mouseRef.current.vy * 0.3,
          life: 30,
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;
      mouseRef.current.x = touch.clientX;
      mouseRef.current.y = touch.clientY;
      mouseRef.current.vx = touch.clientX - prevX;
      mouseRef.current.vy = touch.clientY - prevY;

      if (Math.abs(mouseRef.current.vx) > 2 || Math.abs(mouseRef.current.vy) > 2) {
        windPointsRef.current.push({
          x: touch.clientX,
          y: touch.clientY,
          vx: mouseRef.current.vx * 0.3,
          vy: mouseRef.current.vy * 0.3,
          life: 30,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;

    const animate = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw wind points
      windPointsRef.current = windPointsRef.current.filter((wp) => {
        wp.life--;
        wp.x += wp.vx;
        wp.y += wp.vy;
        wp.vx *= 0.95;
        wp.vy *= 0.95;

        if (wp.life > 0) {
          ctx.beginPath();
          ctx.arc(wp.x, wp.y, (30 - wp.life) * 0.8, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 255, 255, ${wp.life * 0.01})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          return true;
        }
        return false;
      });

      // Update and draw particles
      particlesRef.current.forEach((p) => {
        p.life++;

        // Apply wind force
        windPointsRef.current.forEach((wp) => {
          const dx = p.x - wp.x;
          const dy = p.y - wp.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            const force = (100 - dist) / 100 * 0.5;
            p.vx += (wp.vx * force) / dist * 10;
            p.vy += (wp.vy * force) / dist * 10;
          }
        });

        if (p.type === 'firefly') {
          p.angle += p.speed * 0.02;
          p.vx += Math.sin(p.angle) * 0.01;
          p.vy += Math.cos(p.angle) * 0.01;
          p.vx *= 0.99;
          p.vy *= 0.99;
          p.x += p.vx;
          p.y += p.vy;

          // Wrap around
          if (p.x < -10) p.x = canvas.width + 10;
          if (p.x > canvas.width + 10) p.x = -10;
          if (p.y < -10) p.y = canvas.height + 10;
          if (p.y > canvas.height + 10) p.y = -10;

          // Pulsing opacity
          const pulseOpacity = p.opacity * (0.5 + 0.5 * Math.sin(frameCount * 0.05 + p.angle * 10));

          // Glow
          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
          gradient.addColorStop(0, `rgba(168, 230, 207, ${pulseOpacity})`);
          gradient.addColorStop(0.5, `rgba(168, 230, 207, ${pulseOpacity * 0.3})`);
          gradient.addColorStop(1, 'rgba(168, 230, 207, 0)');

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
          ctx.fill();
        } else {
          // Petal physics
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.vy += 0.02; // gravity
          p.x += p.vx + Math.sin(frameCount * 0.01 + p.angle) * 0.5;
          p.y += p.vy;
          p.angle += 0.02;

          // Reset if out of bounds or too old
          if (p.y > canvas.height + 20 || p.life > p.maxLife) {
            p.x = Math.random() * canvas.width;
            p.y = -10;
            p.vx = (Math.random() - 0.5) * 1;
            p.vy = Math.random() * 1 + 0.5;
            p.life = 0;
            p.maxLife = 600 + Math.random() * 400;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.globalAlpha = p.opacity;

          // Draw petal shape
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          ctx.restore();
        }
      });

      // Spawn new petals occasionally
      if (frameCount % (60 / settings.particleDensity) === 0) {
        const newPetal = createParticle('petal');
        particlesRef.current.push(newPetal);

        // Remove old petals to maintain count
        const maxPetals = Math.floor(30 * settings.particleDensity);
        const petals = particlesRef.current.filter((p) => p.type === 'petal');
        if (petals.length > maxPetals) {
          const toRemove = petals.length - maxPetals;
          let removed = 0;
          particlesRef.current = particlesRef.current.filter((p) => {
            if (p.type === 'petal' && removed < toRemove) {
              removed++;
              return false;
            }
            return true;
          });
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationRef.current);
    };
  }, [initParticles, createParticle, settings.particleDensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
