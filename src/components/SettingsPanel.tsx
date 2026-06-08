import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Volume2, VolumeX, Sun, Moon, RotateCcw } from 'lucide-react';

export default function SettingsPanel() {
  const showSettings = useStore((state) => state.showSettings);
  const setShowSettings = useStore((state) => state.setShowSettings);
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);
  const resetGame = useStore((state) => state.resetGame);

  return (
    <AnimatePresence>
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-6"
          style={{ background: 'rgba(26, 26, 62, 0.9)' }}
          onClick={() => setShowSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-strong rounded-3xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-display text-white mb-6 text-center">
              设置
            </h2>

            <div className="space-y-6">
              {/* Sound toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.soundEnabled ? (
                    <Volume2 size={20} className="text-firefly" />
                  ) : (
                    <VolumeX size={20} className="text-white/50" />
                  )}
                  <span className="text-white/80 text-sm font-body">环境音效</span>
                </div>
                <button
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                    settings.soundEnabled ? 'bg-firefly/50' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${
                      settings.soundEnabled ? 'left-6' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Day/Night toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {settings.dayNightMode === 'day' ? (
                    <Sun size={20} className="text-pale-gold" />
                  ) : (
                    <Moon size={20} className="text-pink-purple" />
                  )}
                  <span className="text-white/80 text-sm font-body">日夜模式</span>
                </div>
                <button
                  onClick={() =>
                    updateSettings({
                      dayNightMode: settings.dayNightMode === 'day' ? 'night' : 'day',
                    })
                  }
                  className={`w-12 h-6 rounded-full transition-all duration-300 relative ${
                    settings.dayNightMode === 'day' ? 'bg-pale-gold/50' : 'bg-pink-purple/50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${
                      settings.dayNightMode === 'day' ? 'left-6' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Particle density */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm font-body">粒子密度</span>
                  <span className="text-pale-gold text-sm font-display">
                    {Math.round(settings.particleDensity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="2"
                  step="0.1"
                  value={settings.particleDensity}
                  onChange={(e) =>
                    updateSettings({ particleDensity: parseFloat(e.target.value) })
                  }
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #b76eb8 0%, #f0d878 ${
                      ((settings.particleDensity - 0.3) / 1.7) * 100
                    }%, rgba(255,255,255,0.1) ${
                      ((settings.particleDensity - 0.3) / 1.7) * 100
                    }%)`,
                  }}
                />
              </div>

              {/* Reset */}
              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    if (confirm('确定要重置所有进度吗？')) {
                      resetGame();
                      setShowSettings(false);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-300 transition-all duration-300"
                >
                  <RotateCcw size={16} />
                  <span className="text-sm font-body">重置游戏进度</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
