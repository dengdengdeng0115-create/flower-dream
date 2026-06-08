import { useStore } from '../store/useStore';

export default function EnergyBar() {
  const energy = useStore((state) => state.energy);
  const maxEnergy = useStore((state) => state.maxEnergy);
  const collectedCount = useStore((state) => state.collectedFlowers.length);
  const combo = useStore((state) => state.combo);
  const score = useStore((state) => state.score);

  const percentage = (energy / maxEnergy) * 100;
  const isFull = energy >= maxEnergy;

  return (
    <div className="fixed top-6 right-6 z-30 glass rounded-2xl p-4 min-w-[220px]">
      {/* Score */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-white/60 text-xs font-body">得分</span>
        <span className="text-pale-gold text-lg font-display">{score.toLocaleString()}</span>
      </div>

      {/* Combo indicator */}
      {combo > 1 && (
        <div className="text-center mb-2">
          <span className="text-firefly text-sm font-body animate-pulse">
            连击 x{combo}!
          </span>
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <span className="text-white/80 text-sm font-body">自然能量</span>
        <span className="text-pale-gold text-sm font-display">
          {energy} / {maxEnergy}
        </span>
      </div>

      {/* Energy bar */}
      <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${percentage}%`,
            background: isFull
              ? 'linear-gradient(90deg, #f0d878, #ffec8b, #f0d878)'
              : 'linear-gradient(90deg, #b76eb8, #e8a0bf, #f0d878)',
            boxShadow: isFull ? '0 0 10px #f0d878' : 'none',
          }}
        />
      </div>

      {/* Collection count */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-white/60 text-xs font-body">已收集花朵</span>
        <span className="text-firefly text-xs font-display">
          {collectedCount} / 5
        </span>
      </div>

      {/* Full energy indicator */}
      {isFull && (
        <div className="mt-2 text-center">
          <span className="text-pale-gold text-xs animate-pulse font-body">
            能量已满，花海为你绽放
          </span>
        </div>
      )}
    </div>
  );
}
