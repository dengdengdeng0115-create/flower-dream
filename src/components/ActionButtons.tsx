import { Leaf, BookOpen, Settings, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function ActionButtons() {
  const showMeditation = useStore((state) => state.showMeditation);
  const showCollection = useStore((state) => state.showCollection);
  const showSettings = useStore((state) => state.showSettings);
  const setShowMeditation = useStore((state) => state.setShowMeditation);
  const setShowCollection = useStore((state) => state.setShowCollection);
  const setShowSettings = useStore((state) => state.setShowSettings);

  const anyOpen = showMeditation || showCollection || showSettings;

  return (
    <div className="fixed bottom-6 left-6 z-30 flex flex-col gap-3">
      {anyOpen ? (
        <button
          onClick={() => {
            setShowMeditation(false);
            setShowCollection(false);
            setShowSettings(false);
          }}
          className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300"
        >
          <X size={20} />
        </button>
      ) : (
        <>
          <button
            onClick={() => setShowMeditation(true)}
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/80 hover:text-firefly hover:bg-white/20 transition-all duration-300 group"
            title="冥想模式"
          >
            <Leaf size={20} className="group-hover:animate-float" />
          </button>

          <button
            onClick={() => setShowCollection(true)}
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/80 hover:text-pink-purple hover:bg-white/20 transition-all duration-300 group"
            title="花语图鉴"
          >
            <BookOpen size={20} className="group-hover:animate-float" />
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="w-12 h-12 rounded-full glass flex items-center justify-center text-white/80 hover:text-pale-gold hover:bg-white/20 transition-all duration-300 group"
            title="设置"
          >
            <Settings size={20} className="group-hover:animate-float" />
          </button>
        </>
      )}
    </div>
  );
}
