import nexgWordmark from '../assets/nexg-wordmark.svg?url';
import nexgWordmarkDark from '../assets/nexg-wordmark-dark.svg?url';

const MARK_VIEW_BOX = '258 181 139 139';
const GOLD = 'var(--color-gold)';

export default function LogoIcon({
  className = 'w-10 h-10',
  variant = 'mark',
}: {
  className?: string;
  /** `mark` is the compact bell-G; `wordmark` is the supplied horizontal brand artwork. */
  variant?: 'mark' | 'wordmark';
}) {
  if (variant === 'wordmark') {
    return (
      <span className={`nexg-wordmark ${className}`} role="img" aria-label="NEXG">
        <img
          className="nexg-wordmark__image nexg-wordmark__light"
          src={nexgWordmark}
          alt=""
          aria-hidden="true"
        />
        <img
          className="nexg-wordmark__image nexg-wordmark__dark"
          src={nexgWordmarkDark}
          alt=""
          aria-hidden="true"
        />
      </span>
    );
  }

  return (
    <svg
      viewBox={MARK_VIEW_BOX}
      className={`shrink-0 ${className}`}
      role="img"
      aria-label="NEXG"
    ><path d="M341.7,198.16L341.7,198.16c-2.73,0.77-5.74,2-5.47,6.05c0,0.01-0.01,0.03-0.01,0.04 c-0.33,1.78,0.65,3.53,2.03,3.77c12.34,2.13,21.36,8.92,28.29,18.34c3.43,4.66,0.16,11.26-5.63,11.31l-1.59,0.01 c-1.99,0.02-3.87-0.83-5.26-2.26c-12.23-12.63-32.44-14.32-43.66-0.85c-17.31,20.79-7.67,59.27,19.7,56.15 c5.51-0.63,15.22-3.17,18.8-6.04c0.5-0.4,0.97-0.8,1.42-1.2c4.88-4.37,1.7-12.46-4.85-12.36l-7.24,0.11 c-3.93,0.06-7.15-3.08-7.19-7.01l-0.06-5.75c-0.04-3.92,3.1-7.12,7.02-7.16l29.16-0.28c3.91-0.04,7.07,3.09,7.16,7 c0.58,25.32-9.66,53.38-43.32,53.96c-49.8,0.87-64.36-59.89-34.62-89.85c9.11-9.18,19.33-13.39,30.87-14.2 c1.64-0.12,2.88-2,2.69-4.13c0-0.03,0-0.05-0.01-0.08c-0.28-2.99-0.85-4.56-5.34-5.55l0,0.05c-1.73-0.69-2.99-2.85-2.99-5.41v-0.01 c0-1.65,1.02-2.99,2.29-2.99h17.84c2.38,0,3.85,3.53,2.46,6.07C343.62,196.88,342.83,197.74,341.7,198.16z" fill={GOLD} stroke={GOLD} strokeWidth="4.3262" strokeMiterlimit="10" />
    </svg>
  );
}
