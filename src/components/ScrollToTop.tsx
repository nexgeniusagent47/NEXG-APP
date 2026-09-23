import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

export default function ScrollToTop() {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const { isLight } = useTheme();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          id="scroll-to-top-btn"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          aria-label={t.ui.scrollToTop.s_f07710}
          className={`fixed right-6 sm:right-8 z-40 p-3 rounded-full shadow-xl backdrop-blur-xl border transition cursor-pointer group hover:scale-110 active:scale-95 ${
            isLight
              ? 'bg-white/90 hover:bg-white text-[#B88728] border-amber-300/80 shadow-amber-900/10'
              : 'bg-[#181a1d]/90 hover:bg-[#202328] text-[#E5B65F] border-white/15 shadow-black/60'
          }`}
          /* Lifted clear of the home indicator. The previous fixed `bottom-20 sm:bottom-8`
             could not account for it, and on a phone the button sat under the hardware. Inline
             rather than a Tailwind class because `env()` needs a fallback and cannot be
             expressed as a static utility. */
          style={{ bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
