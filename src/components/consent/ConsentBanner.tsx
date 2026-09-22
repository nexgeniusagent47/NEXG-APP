// src/components/consent/ConsentBanner.tsx
//
// The cookie notice, plus the "manage cookies" control that brings it back.
//
// WHY role="region" rather than role="dialog": this does not take focus, does not trap
// it, and does not stop the page being used. Announcing it as a dialog — and worse,
// marking it `aria-modal` — tells a screen reader that everything outside it is
// unavailable, which is false, and would push a keyboard user through a decision they
// are allowed to ignore.
//
// WHY the `.onboarding-theme` scope rather than `isLight` from useTheme(): the banner
// mounts in src/main.tsx as a sibling of <App />, so it renders OUTSIDE ThemeProvider
// and has no context to read. The theme it must follow is the one ThemeProvider writes
// onto <html> (`html.dark`), and that scope in src/index.css is the project's existing
// answer for exactly this case: it redefines the neutral scale, so one palette serves
// both themes instead of a second light-only one being hardcoded here.
//
// WHY nothing is preselected: `necessary` is the only category that is on without an
// answer, because the site cannot run without it. Analytics and marketing start off in
// both senses — off in the toggle, and off in consent.ts until a yes is recorded.

import { useEffect, useState } from 'react';
import { Cookie } from 'lucide-react';
import {
  CATEGORY_LABELS,
  acceptAll,
  getConsent,
  isUndecided,
  rejectAll,
  setConsent,
  subscribeConsent,
  type ConsentCategory,
} from '../../lib/consent';

/** Order matters: the unconditional category is explained first, then what is optional. */
const CATEGORY_ORDER: ConsentCategory[] = ['necessary', 'analytics', 'marketing'];

const FIELD_ID: Record<ConsentCategory, string> = {
  necessary: 'consent-necessary',
  analytics: 'consent-analytics',
  marketing: 'consent-marketing',
};

export default function ConsentBanner() {
  const [open, setOpen] = useState<boolean>(() => isUndecided());
  const [choices, setChoices] = useState<Record<ConsentCategory, boolean>>(
    () => ({ ...getConsent().categories })
  );

  useEffect(() => {
    const unsubscribe = subscribeConsent((state) => {
      // `unknown` is only reached again through resetConsent(), which is the app
      // asking for a fresh answer — so an unknown state reopens the notice.
      setOpen(state.status === 'unknown');
      setChoices({ ...state.categories });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (!open) {
    return (
      <div className="onboarding-theme fixed bottom-3 left-3 z-[300] print:hidden">
        <button
          type="button"
          data-analytics="consent-manage"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-lg hover:bg-slate-100"
        >
          <Cookie className="h-4 w-4" aria-hidden="true" />
          Manage cookies
        </button>
      </div>
    );
  }

  return (
    <div className="onboarding-theme fixed inset-x-0 bottom-0 z-[300] p-3 print:hidden">
      <section
        role="region"
        aria-label="Cookie preferences"
        className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl"
      >
        <div className="p-4 sm:p-5">
          <h2 className="text-base font-semibold text-slate-900">Your cookie choices</h2>
          <p className="mt-1 text-sm text-slate-600">
            Strictly necessary cookies keep the site working. Analytics and marketing cookies stay
            off until you turn them on, and you can change this at any time.
          </p>

          <ul className="mt-4 space-y-2">
            {CATEGORY_ORDER.map((category) => {
              const { title, description } = CATEGORY_LABELS[category];
              const locked = category === 'necessary';
              return (
                <li
                  key={category}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <label
                    htmlFor={FIELD_ID[category]}
                    className={`flex items-start gap-3 ${locked ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <input
                      id={FIELD_ID[category]}
                      type="checkbox"
                      checked={choices[category]}
                      disabled={locked}
                      onChange={(event) =>
                        setChoices((previous) => ({
                          ...previous,
                          [category]: event.target.checked,
                        }))
                      }
                      // `accent-[#B88728]` is the caret/selection amber from
                      // src/index.css; a browser-native checkbox is the one control
                      // whose checked state is drawn by the platform.
                      className="mt-1 h-4 w-4 shrink-0 accent-[#B88728] disabled:opacity-70"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-slate-900">{title}</span>
                      <span className="block text-xs text-slate-600">{description}</span>
                      {locked && (
                        <span className="mt-1 block text-xs font-medium text-slate-500">
                          Always on. It cannot be switched off because the site cannot run without
                          it.
                        </span>
                      )}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              data-analytics="consent-accept-all"
              onClick={() => acceptAll()}
              className="rounded-lg bg-[#E5B65F] px-4 py-2 text-sm font-semibold text-[#0c0e12] hover:bg-[#d9a748]"
            >
              Accept all
            </button>
            <button
              type="button"
              data-analytics="consent-reject-all"
              onClick={() => rejectAll()}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Reject all
            </button>
            <button
              type="button"
              data-analytics="consent-save"
              onClick={() =>
                setConsent({ analytics: choices.analytics, marketing: choices.marketing })
              }
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Save choices
            </button>
          </div>

          {/* Focus styling is the document-wide `:focus-visible` rule in src/index.css,
              so every control here gets the same visible ring as the rest of the app. */}
          <p className="mt-3 text-xs text-slate-500">
            Necessary cookies are always active. Everything else is optional.
          </p>
        </div>
      </section>
    </div>
  );
}
