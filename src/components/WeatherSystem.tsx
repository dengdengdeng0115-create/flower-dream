import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import type { Weather } from '../store/useStore';

const weatherIcons: Record<Weather, string> = {
  sunny: '☀️',
  rainy: '🌧️',
  windy: '💨',
  cloudy: '☁️',
  starry: '✨',
};

const weatherNames: Record<Weather, string> = {
  sunny: '晴朗',
  rainy: '雨天',
  windy: '微风',
  cloudy: '多云',
  starry: '星空',
};

const weatherEffects: Record<Weather, string> = {
  sunny: '浇水效果+50%',
  rainy: '浇水效果翻倍，授粉效果减半',
  windy: '修剪和歌唱效果+30%',
  cloudy: '保护效果+50%',
  starry: '歌唱和授粉效果翻倍',
};

export default function WeatherSystem() {
  const weather = useStore((state) => state.weather);
  const setWeather = useStore((state) => state.setWeather);
  const [showInfo, setShowInfo] = useState(false);
  const [weatherChangeAnim, setWeatherChangeAnim] = useState(false);

  // Auto change weather every 30-60 seconds
  useEffect(() => {
    const weatherTypes: Weather[] = ['sunny', 'rainy', 'windy', 'cloudy', 'starry'];

    const scheduleNextWeather = () => {
      const delay = 30000 + Math.random() * 30000; // 30-60 seconds
      return setTimeout(() => {
        const currentIndex = weatherTypes.indexOf(useStore.getState().weather);
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * weatherTypes.length);
        } while (newIndex === currentIndex);

        setWeatherChangeAnim(true);
        setTimeout(() => {
          setWeather(weatherTypes[newIndex]);
          setTimeout(() => setWeatherChangeAnim(false), 500);
        }, 300);

        scheduleNextWeather();
      }, delay);
    };

    const timer = scheduleNextWeather();
    return () => clearTimeout(timer);
  }, [setWeather]);

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30">
      <AnimatePresence mode="wait">
        <motion.div
          key={weather}
          initial={weatherChangeAnim ? { opacity: 0, y: -20 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer"
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
        >
          <span className="text-lg">{weatherIcons[weather]}</span>
          <span className="text-white/80 text-sm font-body">{weatherNames[weather]}</span>
        </motion.div>
      </AnimatePresence>

      {/* Weather info tooltip */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 glass rounded-xl px-4 py-3 whitespace-nowrap"
          >
            <p className="text-white/60 text-xs font-body">当前天气效果:</p>
            <p className="text-pale-gold text-sm font-body mt-1">{weatherEffects[weather]}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
