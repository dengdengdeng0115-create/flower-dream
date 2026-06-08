import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Lock, Sparkles, Star, Heart } from 'lucide-react';

const stageNames: Record<string, string> = {
  seed: '种子',
  sprout: '萌芽',
  bud: '花苞',
  blooming: '绽放中',
  ready: '待收集',
  collected: '已收集',
};

const typeNames: Record<string, string> = {
  'sun-loving': '喜阳花',
  'shade-loving': '喜阴花',
  'rain-loving': '喜雨花',
  'wind-loving': '喜风花',
  'mystical': '神秘花',
};

export default function FlowerCollection() {
  const showCollection = useStore((state) => state.showCollection);
  const setShowCollection = useStore((state) => state.setShowCollection);
  const flowers = useStore((state) => state.flowers);
  const collectedFlowers = useStore((state) => state.collectedFlowers);
  const [selectedFlower, setSelectedFlower] = useState<string | null>(null);

  const selected = flowers.find((f) => f.id === selectedFlower);

  return (
    <AnimatePresence>
      {showCollection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-6"
          style={{ background: 'rgba(26, 26, 62, 0.9)' }}
          onClick={() => {
            setShowCollection(false);
            setSelectedFlower(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="glass-strong rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-3xl font-display text-white mb-2 text-center">
              花语图鉴
            </h2>
            <p className="text-white/50 text-center text-sm font-body mb-8">
              培育花朵，在最佳时机收集，解锁它们的治愈力量
            </p>

            {/* Flower grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {flowers.map((flower) => {
                const isCollected = flower.stage === 'collected';
                const isReady = flower.stage === 'ready';
                const canView = isCollected || isReady;

                return (
                  <motion.div
                    key={flower.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => canView && setSelectedFlower(flower.id)}
                    className={`glass rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                      canView ? 'hover:bg-white/20' : 'opacity-50'
                    } ${selectedFlower === flower.id ? 'ring-2 ring-pale-gold' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      {/* Flower icon */}
                      <div
                        className="w-14 h-14 rounded-full mb-3 flex items-center justify-center text-2xl"
                        style={{
                          background: isCollected
                            ? `radial-gradient(circle, ${flower.color}60 0%, transparent 70%)`
                            : isReady
                            ? `radial-gradient(circle, ${flower.color}40 0%, transparent 70%)`
                            : 'rgba(255,255,255,0.05)',
                          boxShadow: isCollected ? `0 0 20px ${flower.color}40` : 'none',
                        }}
                      >
                        {isCollected ? (
                          flower.perfectBonus ? (
                            <Star size={24} style={{ color: flower.color }} />
                          ) : (
                            <Sparkles size={24} style={{ color: flower.color }} />
                          )
                        ) : isReady ? (
                          <Sparkles size={24} style={{ color: flower.color, opacity: 0.7 }} />
                        ) : (
                          <Lock size={20} className="text-white/30" />
                        )}
                      </div>

                      <h3 className="text-white text-sm font-body font-medium">
                        {canView ? flower.name : '???'}
                      </h3>

                      <p className="text-white/50 text-xs mt-1 font-body">
                        {stageNames[flower.stage]}
                      </p>

                      {isCollected && flower.perfectBonus && (
                        <span className="text-pale-gold text-xs mt-1 font-body">
                          完美收集!
                        </span>
                      )}

                      {!isCollected && (
                        <div className="flex items-center gap-1 mt-1">
                          <Heart size={10} className="text-red-300/60" />
                          <span className="text-white/30 text-xs">
                            {flower.happiness}%
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Selected flower detail */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 glass rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-3xl"
                      style={{
                        background: `radial-gradient(circle, ${selected.color}60 0%, transparent 70%)`,
                        boxShadow: `0 0 30px ${selected.color}40`,
                      }}
                    >
                      {selected.perfectBonus ? (
                        <Star size={32} style={{ color: selected.color }} />
                      ) : (
                        <Sparkles size={32} style={{ color: selected.color }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-display text-white">
                          {selected.name}
                        </h3>
                        {selected.perfectBonus && (
                          <span className="text-pale-gold text-xs bg-pale-gold/20 px-2 py-0.5 rounded-full">
                            完美
                          </span>
                        )}
                      </div>
                      <p className="text-pink-purple text-sm mt-1 font-body">
                        {selected.meaning}
                      </p>
                      <p className="text-white/40 text-xs mt-1 font-body">
                        品种: {typeNames[selected.type]}
                      </p>
                      <p className="text-white/70 text-sm mt-3 font-body leading-relaxed">
                        {selected.healingText}
                      </p>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1">
                          <Heart size={14} className="text-red-300" />
                          <span className="text-white/60 text-xs">心情: {selected.happiness}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Sparkles size={14} className="text-pale-gold" />
                          <span className="text-white/60 text-xs">能量: {selected.energyValue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress */}
            <div className="mt-6 text-center">
              <p className="text-white/40 text-xs font-body">
                收集进度: {collectedFlowers.length} / {flowers.length}
              </p>
              <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-pink-purple to-pale-gold rounded-full transition-all duration-500"
                  style={{
                    width: `${(collectedFlowers.length / flowers.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
