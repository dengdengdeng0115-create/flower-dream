import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function MeditationMode() {
  const showMeditation = useStore((state) => state.showMeditation);
  const setShowMeditation = useStore((state) => state.setShowMeditation);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (!showMeditation) return;

    const phases: Array<'inhale' | 'hold' | 'exhale' | 'rest'> = ['inhale', 'hold', 'exhale', 'rest'];
    const durations = [4000, 2000, 4000, 2000];
    let currentPhase = 0;

    const runPhase = () => {
      setPhase(phases[currentPhase]);
      setTimeout(() => {
        currentPhase = (currentPhase + 1) % phases.length;
        if (currentPhase === 0) setCycle((c) => c + 1);
        runPhase();
      }, durations[currentPhase]);
    };

    runPhase();

    return () => {
      currentPhase = -1;
    };
  }, [showMeditation]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return '吸气...';
      case 'hold':
        return '屏息...';
      case 'exhale':
        return '呼气...';
      case 'rest':
        return '放松...';
    }
  };

  const getScale = () => {
    switch (phase) {
      case 'inhale':
        return 1.5;
      case 'hold':
        return 1.5;
      case 'exhale':
        return 1;
      case 'rest':
        return 1;
    }
  };

  return (
    <AnimatePresence>
      {showMeditation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-40 flex items-center justify-center"
          style={{ background: 'rgba(26, 26, 62, 0.85)' }}
          onClick={() => setShowMeditation(false)}
        >
          <div className="relative flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* Breathing circle */}
            <motion.div
              animate={{ scale: getScale() }}
              transition={{ duration: phase === 'inhale' || phase === 'exhale' ? 4 : 2, ease: 'easeInOut' }}
              className="w-48 h-48 rounded-full flex items-center justify-center relative"
              style={{
                background: 'radial-gradient(circle, rgba(183, 110, 184, 0.3) 0%, rgba(168, 230, 207, 0.1) 50%, transparent 70%)',
                boxShadow: '0 0 60px rgba(183, 110, 184, 0.2), 0 0 120px rgba(168, 230, 207, 0.1)',
              }}
            >
              <motion.div
                animate={{ scale: getScale() * 0.7 }}
                transition={{ duration: phase === 'inhale' || phase === 'exhale' ? 4 : 2, ease: 'easeInOut' }}
                className="w-32 h-32 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(240, 216, 120, 0.2) 0%, transparent 70%)',
                }}
              />
            </motion.div>

            {/* Phase text */}
            <motion.p
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-12 text-2xl text-white/90 font-display tracking-widest"
            >
              {getPhaseText()}
            </motion.p>

            {/* Cycle counter */}
            <p className="mt-4 text-white/50 text-sm font-body">
              已完成 {cycle} 轮呼吸
            </p>

            {/* Instruction */}
            <p className="mt-8 text-white/40 text-xs font-body max-w-xs text-center">
              跟随圆环的节奏呼吸，让思绪随着花海飘散...
              <br />
              点击任意处退出冥想
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
