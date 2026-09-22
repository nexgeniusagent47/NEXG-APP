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
// The taxonomy is the source, not the copy. Each group is real verticals from the
// seeded catalogue, and the support line names them, so the specific thing being
// advertised is still legible under the warm word.
//
// The first drafts failed in two different directions, and both failures are worth
// keeping on record:
//
//   Draft 1 — "Arrive, Supply, Fix". Operational verbs. A verb describes what the
//   platform does TO you, which is why it read rigid. Only Craving and Reset were
//   states the customer is already in.
//
//   Draft 2 — "Breathe, Welcomed, Handled, Sorted". Abstract states. Warmer, but
//   they name a mood and hide the goods, so a customer still cannot tell what is
//   for sale.
//
// What works is both at once: a plain lead the customer recognises themselves in,
// then the actual services, spelled out. The block below IS the call to action —
// it answers "what is this and what can I get" without a second sentence. "Relax"
// and "Cravings" are the customer's words; "spa · massage · wellness" is the
// inventory. Neither half carries the line alone.

import React, { useEffect, useMemo, useState } from 'react';

/** How the line reveals itself. Each variant gives the words a different amount of room. */
export type RevealMode = 'dash' | 'stack' | 'plain';

export interface HeroPod {
  /** Stable id, also the React key. */
  id: string;
  /** The customer's own word for the moment. Carries the accent. */
  lead: string;
  /** The actual services, so the line names what is for sale. */
  support: string;
}

export const HERO_PODS: HeroPod[] = [
  // Every lead AND every support word is capitalised: these read as service labels
  // rather than as a sentence, so Title Case throughout makes them scannable.
  { id: 'relax', lead: 'Relax', support: 'Spa · Wellness · Fitness' },
  { id: 'cravings', lead: 'Cravings', support: 'Restaurants · Delivery · Fine Dining' },
  { id: 'rides', lead: 'Rides', support: 'Chauffeurs · Rentals · Airport Transfers' },
  { id: 'stockup', lead: 'Stock Up', support: 'Groceries · Pharmacy · Essentials' },
  { id: 'experiences', lead: 'Experiences', support: 'Events · Safaris' },
  // The two the user asked for. "Exclusive 18+" carries the age gate in the lead itself
  // rather than burying it in the support line, because it is the part that has to be
  // unmissable — someone scrolling past needs to register the restriction, not the
  // categories behind it.
  { id: 'exclusive', lead: 'Exclusive 18+', support: 'Adults Only · Private · Discreet' },
  { id: 'membership', lead: 'Membership', support: 'Privileges · Priority · Rewards' },
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
  /** How much room the words get. Defaults to the shipped treatment. */
  reveal?: RevealMode;
}

/**
 * The five moments, revealed one at a time.
 *
 * Three treatments exist so the amount of air around the words can be judged rather
 * than argued about: `plain` drops the services and leaves the customer's own word
 * standing alone, `dash` sets one line with an em dash as the call to action, and
 * `stack` puts the word in a large warm face with the services as a tracked
 * caption beneath it.
 *
 * The reveal is re-keyed on every change so it reports the state change instead of
 * firing once on mount and leaving a static line behind. With
 * `prefers-reduced-motion` all five render as static text rather than stopping the
 * rotation on one of them: hiding four of five behind motion fails exactly the
 * people who asked for less motion.
 */
export const HeroWipeSubtitle: React.FC<HeroSubtitleProps> = ({
  reduceMotion,
  className,
  reveal = 'dash',
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

  // The modifier names the reveal in every case, including the default. Emitting no
  // class for the default is what stopped the `dash` rules from ever matching: the
  // stylesheet targets `.hero-wipe--dash`, so the class has to exist.
  const innerClass = `hero-wipe__inner hero-wipe--${reveal}`;

  if (reduceMotion) {
    return (
      <p className={className} data-hero-wipe="static">
        <span className={innerClass}>
          {HERO_PODS.map((entry, i) => (
            <React.Fragment key={entry.id}>
              {i > 0 && (
                <span className="hero-pod__sep" aria-hidden="true">
                  {' · '}
                </span>
              )}
              <span className="hero-wipe__lead">{entry.lead}</span>
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
            restarts the reveal animation. */}
        <span key={pod.id} className={innerClass}>
          <span className="hero-wipe__lead">{pod.lead}</span>
          {reveal !== 'plain' && (
            /* Wrapped so the support line's `em` resolves against the lead word rather
               than against the shared parent. As siblings they share a font-size
               context, and an `em` on the support compounded to 0.856 of the lead when
               0.925 was intended. */
            <span className="hero-wipe__tail">
              {reveal === 'dash' && (
                <span className="hero-wipe__dash" aria-hidden="true">
                  {' · '}
                </span>
              )}
              <span className="hero-wipe__support">{pod.support}</span>
            </span>
          )}
        </span>
      </span>
    </p>
  );
};
