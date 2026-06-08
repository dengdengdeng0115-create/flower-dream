import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ParticleCanvas from './components/ParticleCanvas';
import FlowerSpot from './components/FlowerSpot';
import EnergyBar from './components/EnergyBar';
import ActionButtons from './components/ActionButtons';
import MeditationMode from './components/MeditationMode';
import FlowerCollection from './components/FlowerCollection';
import SettingsPanel from './components/SettingsPanel';
import WeatherSystem from './components/WeatherSystem';
import RandomEvents from './components/RandomEvents';
import { useStore } from './store/useStore';

function App() {
  const [loaded, setLoaded] = useState(false);
  const flowers = useStore((state) => state.flowers);
  const settings = useStore((state) => state.settings);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Background image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: 'easeOut' }}
        className="absolute inset-0 z-0"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Cinematic%20flower%20field%20at%20twilight%2C%20cosmos%20flowers%20in%20pink%20purple%20and%20white%2C%20golden%20hour%20lighting%2C%20shallow%20depth%20of%20field%2C%20atmospheric%20haze%2C%20film%20grain%2C%204K%20resolution%2C%20photorealistic&image_size=landscape_16_9')`,
          }}
        />
        {/* Vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(26, 26, 62, 0.6) 100%)',
          }}
        />
        {/* Day/Night overlay */}
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: settings.dayNightMode === 'day'
              ? 'rgba(255, 200, 150, 0.1)'
              : 'rgba(26, 26, 62, 0.3)',
          }}
        />
      </motion.div>

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Random events */}
      <RandomEvents />

      {/* Flower spots */}
      {loaded && flowers.map((flower) => (
        <FlowerSpot
          key={flower.id}
          id={flower.id}
          x={flower.position.x}
          y={flower.position.y}
          color={flower.color}
          name={flower.name}
          energyValue={flower.energyValue}
          stage={flower.stage}
          growthProgress={flower.growthProgress}
          happiness={flower.happiness}
          careNeeds={flower.careNeeds}
          currentNeedIndex={flower.currentNeedIndex}
        />
      ))}

      {/* UI Elements */}
      <WeatherSystem />
      <EnergyBar />
      <ActionButtons />

      {/* Modals */}
      <MeditationMode />
      <FlowerCollection />
      <SettingsPanel />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="fixed top-6 left-6 z-30"
      >
        <h1 className="text-2xl font-display text-white/90 text-glow">
          花海梦境
        </h1>
        <p className="text-white/40 text-xs mt-1 font-body">
          根据花朵需求培育，在最佳时机收集
        </p>
      </motion.div>

      {/* Custom CSS animations */}
      <style>{`
        @keyframes burstExpand {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(8);
            opacity: 0;
          }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
