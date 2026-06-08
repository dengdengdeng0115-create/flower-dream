import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { RandomEvent } from '../store/useStore';

export default function RandomEvents() {
  const randomEvent = useStore((state) => state.randomEvent);
  const triggerRandomEvent = useStore((state) => state.triggerRandomEvent);
  const clearRandomEvent = useStore((state) => state.clearRandomEvent);
  const addEnergy = useStore((state) => state.addEnergy);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);

  const spawnEvent = useCallback(() => {
    const eventTypes: RandomEvent['type'][] = ['butterfly', 'rainbow', 'storm', 'fireflies', 'shooting-star'];
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];

    const event: RandomEvent = {
      id: Date.now().toString(),
      type,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      active: true,
      duration: 8000,
      startTime: Date.now(),
    };

    triggerRandomEvent(event);

    // Spawn particles for the event
    const newParticles = [];
    const count = type === 'fireflies' ? 15 : type === 'butterfly' ? 3 : type === 'storm' ? 8 : 5;
    const emoji =
      type === 'butterfly'
        ? '🦋'
        : type === 'rainbow'
        ? '🌈'
        : type === 'storm'
        ? '⚡'
        : type === 'fireflies'
        ? '✨'
        : '☄️';

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + i,
        x: event.x + (Math.random() - 0.5) * 20,
        y: event.y + (Math.random() - 0.5) * 20,
        emoji,
      });
    }
    setParticles(newParticles);

    // Clear event after duration
    setTimeout(() => {
      clearRandomEvent();
      setParticles([]);
    }, event.duration);

    // Bonus energy for interacting with event
    addEnergy(5);
  }, [triggerRandomEvent, clearRandomEvent, addEnergy]);

  // Random event spawning
  useEffect(() => {
    const scheduleNextEvent = () => {
      const delay = 20000 + Math.random() * 40000; // 20-60 seconds
      return setTimeout(() => {
        if (!useStore.getState().randomEvent) {
          spawnEvent();
        }
        scheduleNextEvent();
      }, delay);
    };

    const timer = scheduleNextEvent();
    return () => clearTimeout(timer);
  }, [spawnEvent]);

  const getEventMessage = (type: RandomEvent['type']) => {
    switch (type) {
      case 'butterfly':
        return '蝴蝶群来访！授粉效果临时提升';
      case 'rainbow':
        return '彩虹出现！所有花朵心情提升';
      case 'storm':
        return '暴风雨来临！保护花朵获得额外奖励';
      case 'fireflies':
        return '萤火虫之夜！能量获取翻倍';
      case 'shooting-star':
        return '流星划过！许愿获得大量能量';
    }
  };

  return (
    <AnimatePresence>
      {randomEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-25 pointer-events-none"
        >
          {/* Event message */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 glass-strong rounded-2xl px-6 py-3"
          >
            <p className="text-white text-sm font-body text-center">
              {getEventMessage(randomEvent.type)}
            </p>
            <p className="text-pale-gold text-xs text-center mt-1">+5 能量</p>
          </motion.div>

          {/* Event particles */}
          {particles.map((particle, index) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0.5],
                x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
                y: [0, -30 - Math.random() * 50, -60 - Math.random() * 100],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
              className="fixed text-2xl"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
            >
              {particle.emoji}
            </motion.div>
          ))}

          {/* Special effects overlay */}
          {randomEvent.type === 'rainbow' && (
            <div
              className="fixed inset-0"
              style={{
                background: 'linear-gradient(180deg, transparent 60%, rgba(255,255,255,0.05) 100%)',
              }}
            />
          )}
          {randomEvent.type === 'storm' && (
            <div
              className="fixed inset-0 animate-pulse"
              style={{
                background: 'rgba(100, 100, 150, 0.1)',
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
