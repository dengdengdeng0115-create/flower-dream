import { create } from 'zustand';

export type FlowerStage = 'seed' | 'sprout' | 'bud' | 'blooming' | 'ready' | 'collected';
export type FlowerType = 'sun-loving' | 'shade-loving' | 'rain-loving' | 'wind-loving' | 'mystical';
export type CareAction = 'water' | 'prune' | 'pollinate' | 'protect' | 'sing';
export type Weather = 'sunny' | 'rainy' | 'windy' | 'cloudy' | 'starry';

export interface CareNeed {
  action: CareAction;
  satisfied: boolean;
  progress: number;
}

export interface Flower {
  id: string;
  name: string;
  color: string;
  meaning: string;
  healingText: string;
  position: { x: number; y: number };
  stage: FlowerStage;
  energyValue: number;
  growthProgress: number;
  perfectBonus: boolean;
  type: FlowerType;
  careNeeds: CareNeed[];
  currentNeedIndex: number;
  happiness: number;
}

export interface RandomEvent {
  id: string;
  type: 'butterfly' | 'rainbow' | 'storm' | 'fireflies' | 'shooting-star';
  x: number;
  y: number;
  active: boolean;
  duration: number;
  startTime: number;
}

export interface GameState {
  energy: number;
  maxEnergy: number;
  collectedFlowers: string[];
  unlockedEffects: string[];
  showMeditation: boolean;
  showCollection: boolean;
  showSettings: boolean;
  score: number;
  weather: Weather;
  weatherTimer: number;
  randomEvent: RandomEvent | null;
  combo: number;
  lastActionTime: number;
  settings: {
    particleDensity: number;
    soundEnabled: boolean;
    dayNightMode: 'day' | 'night';
  };
  flowers: Flower[];
}

interface GameActions {
  performCare: (flowerId: string, action: CareAction) => void;
  collectFlower: (flowerId: string, perfect: boolean) => void;
  addEnergy: (amount: number) => void;
  unlockEffect: (effectId: string) => void;
  setShowMeditation: (show: boolean) => void;
  setShowCollection: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
  updateSettings: (settings: Partial<GameState['settings']>) => void;
  setWeather: (weather: Weather) => void;
  triggerRandomEvent: (event: RandomEvent) => void;
  clearRandomEvent: () => void;
  resetGame: () => void;
}

function createCareNeeds(type: FlowerType): CareNeed[] {
  switch (type) {
    case 'sun-loving':
      return [
        { action: 'water', satisfied: false, progress: 0 },
        { action: 'prune', satisfied: false, progress: 0 },
        { action: 'pollinate', satisfied: false, progress: 0 },
      ];
    case 'shade-loving':
      return [
        { action: 'water', satisfied: false, progress: 0 },
        { action: 'protect', satisfied: false, progress: 0 },
        { action: 'prune', satisfied: false, progress: 0 },
      ];
    case 'rain-loving':
      return [
        { action: 'sing', satisfied: false, progress: 0 },
        { action: 'water', satisfied: false, progress: 0 },
        { action: 'pollinate', satisfied: false, progress: 0 },
      ];
    case 'wind-loving':
      return [
        { action: 'prune', satisfied: false, progress: 0 },
        { action: 'sing', satisfied: false, progress: 0 },
        { action: 'protect', satisfied: false, progress: 0 },
      ];
    case 'mystical':
      return [
        { action: 'sing', satisfied: false, progress: 0 },
        { action: 'protect', satisfied: false, progress: 0 },
        { action: 'pollinate', satisfied: false, progress: 0 },
        { action: 'water', satisfied: false, progress: 0 },
      ];
  }
}

const initialFlowers: Flower[] = [
  {
    id: 'cosmos-pink',
    name: '粉红波斯菊',
    color: '#e8a0bf',
    meaning: '少女的纯情与自由',
    healingText: '像波斯菊一样，在微风中自由摇曳，不被束缚，活出真实的自己。',
    position: { x: 15, y: 70 },
    stage: 'seed',
    energyValue: 15,
    growthProgress: 0,
    perfectBonus: false,
    type: 'sun-loving',
    careNeeds: createCareNeeds('sun-loving'),
    currentNeedIndex: 0,
    happiness: 50,
  },
  {
    id: 'cosmos-purple',
    name: '紫色波斯菊',
    color: '#b76eb8',
    meaning: '神秘与浪漫',
    healingText: '紫色花海中藏着宇宙的秘密，深呼吸，让浪漫填满你的心。',
    position: { x: 35, y: 55 },
    stage: 'seed',
    energyValue: 20,
    growthProgress: 0,
    perfectBonus: false,
    type: 'shade-loving',
    careNeeds: createCareNeeds('shade-loving'),
    currentNeedIndex: 0,
    happiness: 50,
  },
  {
    id: 'cosmos-white',
    name: '白色波斯菊',
    color: '#fff5f5',
    meaning: '纯洁与希望',
    healingText: '白色花瓣如同清晨的第一缕光，带来新的希望和开始。',
    position: { x: 60, y: 65 },
    stage: 'seed',
    energyValue: 15,
    growthProgress: 0,
    perfectBonus: false,
    type: 'rain-loving',
    careNeeds: createCareNeeds('rain-loving'),
    currentNeedIndex: 0,
    happiness: 50,
  },
  {
    id: 'cosmos-red',
    name: '深红波斯菊',
    color: '#c44d6e',
    meaning: '热情与勇气',
    healingText: '深红如火，点燃内心的勇气，去追寻你真正渴望的生活。',
    position: { x: 80, y: 50 },
    stage: 'seed',
    energyValue: 25,
    growthProgress: 0,
    perfectBonus: false,
    type: 'wind-loving',
    careNeeds: createCareNeeds('wind-loving'),
    currentNeedIndex: 0,
    happiness: 50,
  },
  {
    id: 'firefly',
    name: '萤火虫之光',
    color: '#a8e6cf',
    meaning: '微小但坚定的光芒',
    healingText: '即使微小如萤火虫，也能在黑暗中发出属于自己的光芒。',
    position: { x: 50, y: 30 },
    stage: 'seed',
    energyValue: 30,
    growthProgress: 0,
    perfectBonus: false,
    type: 'mystical',
    careNeeds: createCareNeeds('mystical'),
    currentNeedIndex: 0,
    happiness: 50,
  },
];

const initialState: GameState = {
  energy: 0,
  maxEnergy: 100,
  collectedFlowers: [],
  unlockedEffects: [],
  showMeditation: false,
  showCollection: false,
  showSettings: false,
  score: 0,
  weather: 'sunny',
  weatherTimer: 0,
  randomEvent: null,
  combo: 0,
  lastActionTime: 0,
  settings: {
    particleDensity: 1,
    soundEnabled: false,
    dayNightMode: 'night',
  },
  flowers: initialFlowers,
};

const actionEmojis: Record<CareAction, string> = {
  water: '💧',
  prune: '✂️',
  pollinate: '🦋',
  protect: '🛡️',
  sing: '🎵',
};

const actionNames: Record<CareAction, string> = {
  water: '浇水',
  prune: '修剪',
  pollinate: '授粉',
  protect: '保护',
  sing: '歌唱',
};

const weatherBonus: Record<Weather, Partial<Record<CareAction, number>>> = {
  sunny: { water: 1.5 },
  rainy: { water: 2.0, pollinate: 0.5 },
  windy: { prune: 1.5, sing: 1.3 },
  cloudy: { protect: 1.5 },
  starry: { sing: 2.0, pollinate: 1.5 },
};

export const useStore = create<GameState & GameActions>((set) => ({
  ...initialState,

  performCare: (flowerId: string, action: CareAction) =>
    set((state) => {
      const flower = state.flowers.find((f) => f.id === flowerId);
      if (!flower || flower.stage === 'collected' || flower.stage === 'ready') return state;

      const currentNeed = flower.careNeeds[flower.currentNeedIndex];
      if (!currentNeed) return state;

      const now = Date.now();
      const timeSinceLastAction = now - state.lastActionTime;
      const newCombo = timeSinceLastAction < 3000 ? state.combo + 1 : 1;

      // Check if action matches need
      const isCorrectAction = currentNeed.action === action;
      const weatherMultiplier = weatherBonus[state.weather]?.[action] || 1;
      const comboMultiplier = Math.min(newCombo * 0.15, 1.5);

      let growthBoost = 0;
      let happinessChange = 0;
      let newCareNeeds = [...flower.careNeeds];
      let newCurrentNeedIndex = flower.currentNeedIndex;
      let newHappiness = flower.happiness;

      if (isCorrectAction) {
        // Correct action
        growthBoost = (10 + comboMultiplier * 8) * weatherMultiplier;
        happinessChange = 10;
        newCareNeeds[flower.currentNeedIndex] = {
          ...currentNeed,
          satisfied: true,
          progress: 100,
        };
        newCurrentNeedIndex = flower.currentNeedIndex + 1;

        // If all needs satisfied, advance stage
        if (newCurrentNeedIndex >= flower.careNeeds.length) {
          newCurrentNeedIndex = 0;
          newCareNeeds = createCareNeeds(flower.type);
        }
      } else {
        // Wrong action - small penalty but still some growth
        growthBoost = 3;
        happinessChange = -5;
      }

      newHappiness = Math.max(0, Math.min(100, newHappiness + happinessChange));
      const newProgress = Math.min(flower.growthProgress + growthBoost, 100);

      let newStage: FlowerStage = flower.stage;
      if (newProgress >= 100) newStage = 'ready';
      else if (newProgress >= 75) newStage = 'blooming';
      else if (newProgress >= 50) newStage = 'bud';
      else if (newProgress >= 25) newStage = 'sprout';

      const newFlowers = state.flowers.map((f) =>
        f.id === flowerId
          ? {
              ...f,
              growthProgress: newProgress,
              stage: newStage,
              careNeeds: newCareNeeds,
              currentNeedIndex: newCurrentNeedIndex,
              happiness: newHappiness,
            }
          : f
      );

      return {
        flowers: newFlowers,
        combo: newCombo,
        lastActionTime: now,
        score: state.score + Math.floor(growthBoost * (1 + newCombo * 0.1)),
      };
    }),

  collectFlower: (flowerId: string, perfect: boolean) =>
    set((state) => {
      if (state.collectedFlowers.includes(flowerId)) return state;
      const flower = state.flowers.find((f) => f.id === flowerId);
      if (!flower) return state;

      const happinessBonus = flower.happiness / 100;
      const bonus = perfect ? 2 + happinessBonus : 1 + happinessBonus * 0.5;
      const newEnergy = Math.min(state.energy + Math.floor(flower.energyValue * bonus), state.maxEnergy);
      const newCollected = [...state.collectedFlowers, flowerId];
      const newFlowers = state.flowers.map((f) =>
        f.id === flowerId ? { ...f, stage: 'collected' as FlowerStage, perfectBonus: perfect } : f
      );

      return {
        energy: newEnergy,
        collectedFlowers: newCollected,
        flowers: newFlowers,
        score: state.score + Math.floor(flower.energyValue * bonus * 10),
        combo: 0,
      };
    }),

  addEnergy: (amount: number) =>
    set((state) => ({
      energy: Math.min(state.energy + amount, state.maxEnergy),
    })),

  unlockEffect: (effectId: string) =>
    set((state) => ({
      unlockedEffects: state.unlockedEffects.includes(effectId)
        ? state.unlockedEffects
        : [...state.unlockedEffects, effectId],
    })),

  setShowMeditation: (show: boolean) =>
    set(() => ({
      showMeditation: show,
      showCollection: false,
      showSettings: false,
    })),

  setShowCollection: (show: boolean) =>
    set(() => ({
      showMeditation: false,
      showCollection: show,
      showSettings: false,
    })),

  setShowSettings: (show: boolean) =>
    set(() => ({
      showMeditation: false,
      showCollection: false,
      showSettings: show,
    })),

  updateSettings: (settings: Partial<GameState['settings']>) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),

  setWeather: (weather: Weather) =>
    set(() => ({
      weather,
    })),

  triggerRandomEvent: (event: RandomEvent) =>
    set(() => ({
      randomEvent: event,
    })),

  clearRandomEvent: () =>
    set(() => ({
      randomEvent: null,
    })),

  resetGame: () =>
    set(() => ({
      ...initialState,
      flowers: initialFlowers.map((f) => ({
        ...f,
        stage: 'seed' as FlowerStage,
        growthProgress: 0,
        perfectBonus: false,
        careNeeds: createCareNeeds(f.type),
        currentNeedIndex: 0,
        happiness: 50,
      })),
    })),
}));

export { actionEmojis, actionNames, weatherBonus };
