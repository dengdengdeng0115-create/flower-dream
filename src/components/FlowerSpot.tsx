import { useState, useCallback, useEffect, useRef } from 'react';
import { useStore, actionEmojis, actionNames } from '../store/useStore';
import type { FlowerStage, CareAction } from '../store/useStore';

interface FlowerSpotProps {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
  energyValue: number;
  stage: FlowerStage;
  growthProgress: number;
  happiness: number;
  careNeeds: Array<{ action: CareAction; satisfied: boolean; progress: number }>;
  currentNeedIndex: number;
}

const stageNames: Record<FlowerStage, string> = {
  seed: '种子',
  sprout: '萌芽',
  bud: '花苞',
  blooming: '绽放中',
  ready: '可收集',
  collected: '已收集',
};

const stageEmojis: Record<FlowerStage, string> = {
  seed: '🌰',
  sprout: '🌱',
  bud: '🌷',
  blooming: '🌸',
  ready: '✨',
  collected: '🌺',
};

const typeDescriptions: Record<string, string> = {
  'sun-loving': '喜阳花',
  'shade-loving': '喜阴花',
  'rain-loving': '喜雨花',
  'wind-loving': '喜风花',
  'mystical': '神秘花',
};

export default function FlowerSpot({
  id,
  x,
  y,
  color,
  name,
  energyValue,
  stage,
  growthProgress,
  happiness,
  careNeeds,
  currentNeedIndex,
}: FlowerSpotProps) {
  const [hovered, setHovered] = useState(false);
  const [pulseRing, setPulseRing] = useState(0);
  const [clickEffects, setClickEffects] = useState<Array<{ id: number; x: number; y: number; text: string; color: string }>>([]);
  const [showActions, setShowActions] = useState(false);
  const effectIdRef = useRef(0);
  const performCare = useStore((state) => state.performCare);
  const collectFlower = useStore((state) => state.collectFlower);
  const combo = useStore((state) => state.combo);
  const weather = useStore((state) => state.weather);

  // Perfect timing ring animation for ready flowers
  useEffect(() => {
    if (stage !== 'ready') return;
    let startTime = Date.now();
    let animId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const cycle = 2000;
      const progress = (elapsed % cycle) / cycle;
      const ringSize = progress < 0.5 ? 1 - progress * 2 : (progress - 0.5) * 2;
      setPulseRing(ringSize);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [stage]);

  const addClickEffect = (text: string, offsetX: number, offsetY: number, effectColor: string = '#f0d878') => {
    const newId = ++effectIdRef.current;
    setClickEffects((prev) => [...prev, { id: newId, x: offsetX, y: offsetY, text, color: effectColor }]);
    setTimeout(() => {
      setClickEffects((prev) => prev.filter((e) => e.id !== newId));
    }, 1200);
  };

  const handleCareAction = useCallback(
    (action: CareAction, e: React.MouseEvent) => {
      e.stopPropagation();
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;

      const currentNeed = careNeeds[currentNeedIndex];
      const isCorrect = currentNeed?.action === action;

      performCare(id, action);

      if (isCorrect) {
        addClickEffect(`✓ ${actionNames[action]}`, offsetX, offsetY, '#a8e6cf');
        if (combo > 1) {
          setTimeout(() => addClickEffect(`连击x${combo + 1}!`, offsetX + 20, offsetY - 20, '#f0d878'), 200);
        }
      } else {
        addClickEffect(`✗ 需要${actionNames[currentNeed?.action || 'water']}`, offsetX, offsetY, '#ff6b6b');
      }

      // Check if flower became ready
      const flower = useStore.getState().flowers.find((f) => f.id === id);
      if (flower?.stage === 'ready') {
        setShowActions(false);
      }
    },
    [id, careNeeds, currentNeedIndex, performCare, combo]
  );

  const handleCollect = useCallback(
    (e: React.MouseEvent) => {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;

      const isPerfect = pulseRing < 0.15;
      collectFlower(id, isPerfect);
      addClickEffect(isPerfect ? '完美! x2' : `+${energyValue}`, offsetX, offsetY, isPerfect ? '#f0d878' : '#fff');
    },
    [id, energyValue, collectFlower, pulseRing]
  );

  if (stage === 'collected') {
    return (
      <div
        className="fixed z-20 pointer-events-none animate-float"
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="text-2xl opacity-60"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        >
          {stageEmojis[stage]}
        </div>
      </div>
    );
  }

  const isReady = stage === 'ready';
  const currentNeed = careNeeds[currentNeedIndex];
  const size = stage === 'seed' ? 20 : stage === 'sprout' ? 28 : stage === 'bud' ? 36 : 44;

  return (
    <div
      className="fixed z-20 select-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseEnter={() => { setHovered(true); setShowActions(true); }}
      onMouseLeave={() => { setHovered(false); setShowActions(false); }}
    >
      {/* Perfect timing ring for ready flowers */}
      {isReady && (
        <div
          className="absolute inset-0 rounded-full border-2 border-pale-gold/60 pointer-events-none"
          style={{
            width: size + 20 + pulseRing * 40,
            height: size + 20 + pulseRing * 40,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.8 - pulseRing * 0.5,
            transition: 'none',
          }}
        />
      )}

      {/* Growth progress ring */}
      {!isReady && (
        <svg
          className="absolute pointer-events-none"
          style={{
            width: size + 16,
            height: size + 16,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <circle
            cx={(size + 16) / 2}
            cy={(size + 16) / 2}
            r={(size + 16) / 2 - 2}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="2"
          />
          <circle
            cx={(size + 16) / 2}
            cy={(size + 16) / 2}
            r={(size + 16) / 2 - 2}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * ((size + 16) / 2 - 2)}`}
            strokeDashoffset={`${2 * Math.PI * ((size + 16) / 2 - 2) * (1 - growthProgress / 100)}`}
            strokeLinecap="round"
            transform={`rotate(-90 ${(size + 16) / 2} ${(size + 16) / 2})`}
            style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
          />
        </svg>
      )}

      {/* Flower emoji with glow */}
      <div
        className="relative flex items-center justify-center transition-transform duration-200 cursor-pointer"
        style={{
          width: size,
          height: size,
          transform: hovered ? 'scale(1.2)' : 'scale(1)',
        }}
        onClick={isReady ? handleCollect : undefined}
      >
        <span
          className="text-2xl"
          style={{
            filter: isReady
              ? `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 24px ${color}80)`
              : `drop-shadow(0 0 6px ${color}60)`,
            animation: isReady ? 'glow-pulse 1.5s ease-in-out infinite' : 'none',
          }}
        >
          {stageEmojis[stage]}
        </span>
      </div>

      {/* Care action buttons */}
      {showActions && !isReady && currentNeed && (
        <div
          className="absolute left-1/2 -translate-x-1/2 flex gap-1.5 mt-2"
          style={{ top: '100%', animation: 'fadeInUp 0.2s ease-out' }}
        >
          {(['water', 'prune', 'pollinate', 'protect', 'sing'] as CareAction[]).map((action) => {
            const isNeeded = currentNeed.action === action;
            return (
              <button
                key={action}
                onClick={(e) => handleCareAction(action, e)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${
                  isNeeded
                    ? 'bg-white/20 hover:bg-white/40 ring-2 ring-pale-gold/60'
                    : 'bg-white/5 hover:bg-white/15 opacity-60'
                }`}
                title={actionNames[action]}
              >
                {actionEmojis[action]}
              </button>
            );
          })}
        </div>
      )}

      {/* Click effects */}
      {clickEffects.map((effect) => (
        <div
          key={effect.id}
          className="absolute pointer-events-none font-bold text-sm whitespace-nowrap"
          style={{
            left: effect.x,
            top: effect.y,
            color: effect.color,
            animation: 'floatUp 1.2s ease-out forwards',
            textShadow: `0 0 10px ${effect.color}80`,
          }}
        >
          {effect.text}
        </div>
      ))}

      {/* Tooltip */}
      {hovered && (
        <div
          className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 glass px-4 py-2.5 rounded-xl whitespace-nowrap"
          style={{ animation: 'fadeInUp 0.2s ease-out', minWidth: '160px' }}
        >
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-body font-medium">{name}</p>
            <span className="text-white/40 text-xs">{typeDescriptions[id.split('-')[0] === 'firefly' ? 'mystical' : id.split('-')[1] === 'pink' ? 'sun-loving' : id.split('-')[1] === 'purple' ? 'shade-loving' : id.split('-')[1] === 'white' ? 'rain-loving' : 'wind-loving']}</span>
          </div>
          <p className="text-white/50 text-xs mt-1 font-body">
            {stageNames[stage]} {!isReady && `(${Math.floor(growthProgress)}%)`}
          </p>

          {/* Current need indicator */}
          {!isReady && currentNeed && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-white/60 text-xs">需要:</span>
              <span className="text-pale-gold text-sm">{actionEmojis[currentNeed.action]} {actionNames[currentNeed.action]}</span>
            </div>
          )}

          {/* Happiness bar */}
          <div className="mt-2">
            <div className="flex items-center justify-between">
              <span className="text-white/40 text-xs">心情</span>
              <span className={`text-xs ${happiness > 70 ? 'text-firefly' : happiness > 40 ? 'text-pale-gold' : 'text-red-300'}`}>
                {happiness}%
              </span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${happiness}%`,
                  background: happiness > 70 ? '#a8e6cf' : happiness > 40 ? '#f0d878' : '#ff6b6b',
                }}
              />
            </div>
          </div>

          {isReady && (
            <p className="text-pale-gold text-xs mt-2 font-body text-center">
              在光环最小时点击收集!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
