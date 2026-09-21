import nexgLogo from '../assets/images/NEXG LOGO.png';
import { useTheme } from '../context/ThemeContext';

export default function LogoIcon({ className = "w-10 h-10" }: { className?: string }) {
  const { isLight } = useTheme();

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <img 
        src={nexgLogo} 
        alt="NEXG Logo" 
        className={`w-full h-full object-contain transition-all duration-300 ${
          isLight 
            ? 'filter drop-shadow-sm brightness-0 contrast-200 opacity-90' 
            : 'filter drop-shadow-[0_2px_10px_rgba(229,182,95,0.35)]'
        }`} 
        referrerPolicy="no-referrer"
      />
    </div>
  );
}




