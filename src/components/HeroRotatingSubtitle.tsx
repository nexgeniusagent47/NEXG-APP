// src/components/HeroRotatingSubtitle.tsx
//
// The hero subtitle, rotating through five psychologically distinct reasons to
// use NEXG.
//
// The brief: "our categories and subcategories should decide in a psychologically
// enticing way, and they should be like 5 different ones."
//
// The taxonomy already contains the answer. 21 verticals fail as a list — nobody
// reads 21 items, and a flat list of nouns is not a reason to do anything. What
// works is grouping them by the MOTIVATION a person is in when they open the app.
// Five groups, five different psychological levers:
//
//   Craving  appetite, indulgence, immediate reward
//   Reset    restoration, self-care, permission to stop
//   Arrive   status, effortlessness, being expected
//   Supply   competence, the household running itself
//   Fix      relief, the problem is already handled
//
// The categories are the source, not decoration: each group is real verticals from
// the seeded catalogue. Nothing here is invented copy standing in for taxonomy —
// the taxonomy decides.
//
// Motion lives in `src/index.css` beside the rest of the hero's presentation. The
// reveal is re-keyed on every change so its animation replays; `prefers-reduced-motion`
// stops the rotation and shows every group as static text, because hiding four of
// five groups behind an animation fails exactly the people who asked for less
// animation.

import React, { useEffect, useMemo, useState } from 'react';

export interface HeroPod {
  /** Stable id, also the React key. */
  id: string;
  /** The accent word: the motivation, not the merchandise. */
  lead: string;
  /** The sub-line naming which real verticals this covers. */
  support: string;
}

export const HERO_PODS: HeroPod[] = [
  { id: 'craving', lead: 'Craving', support: 'Fine dining, cellar, late-night' },
  { id: 'reset', lead: 'Reset', support: 'Spa, beauty, wellness' },
  { id: 'arrive', lead: 'Arrive', support: 'Chauffeurs, transfers, safaris' },
  { id: 'supply', lead: 'Supply', support: 'Groceries, pharmacy, butcher' },
  { id: 'fix', lead: 'Fix', support: 'Vehicle service, laundry, repairs' },
];

/**
 * 3200ms is deliberately slower than a UI transition. This is a reading line, not
 * a status indicator: it must finish before it changes again, or it reads as noise.
 */
const ROTATE_MS = 3200;

interface HeroSubtitleProps {
  isLight: boolean;
  reduceMotion: boolean;
  className?: string;
}

/**
 * The five motivations, revealed one at a time behind a clip wipe. Gold sweeps
 * across the line on each change rather than the line cross-fading, and the reveal
 * is re-keyed on every change so it reports the state change instead of firing once
 * on mount and leaving a static line behind.
 *
 * `prefers-reduced-motion` renders all five statically rather than stopping the
 * rotation on one of them: hiding four of five behind motion fails exactly the
 * people who asked for less motion.
 */
export const HeroWipeSubtitle: React.FC<HeroSubtitleProps> = ({
  reduceMotion,
  className,
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % HERO_PODS.length),
      ROTATE_MS
    );
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const pod = useMemo(() => HERO_PODS[index], [index]);

  if (reduceMotion) {
    return (
      <p className={className} data-hero-wipe="static">
        <span className="hero-wipe__inner">
          <span className="hero-wipe__lead">Craving</span>
          {HERO_PODS.slice(1).map((entry) => (
            <React.Fragment key={entry.id}>
              <span className="hero-pod__sep" aria-hidden="true">
                {' · '}
              </span>
              {entry.lead}
            </React.Fragment>
          ))}
        </span>
      </p>
    );
  }

  return (
    <p className={className} data-hero-wipe="rotating">
      {/* aria-live is polite, never assertive: this changes on its own and must not
          interrupt a screen reader mid-sentence. */}
      <span className="hero-wipe" aria-live="polite" aria-atomic="true">
        {/* Re-keyed on the pod id: a new key remounts the node, which is what
            restarts the clip-path animation. */}
        <span key={pod.id} className="hero-wipe__inner">
          <span className="hero-wipe__lead">{pod.lead}</span>
          <span className="hero-pod__sep" aria-hidden="true">
            ·
          </span>
          <span className="hero-pod__support">{pod.support}</span>
        </span>
      </span>
    </p>
  );
};
