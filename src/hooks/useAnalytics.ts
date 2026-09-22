// src/hooks/useAnalytics.ts
//
// The app-facing analytics surface: named events, page views, and one global click
// capture.
//
// WHY a capture-phase listener on the document instead of an onClick per control:
// the product has hundreds of interactive elements spread across lazily-loaded
// routes, so per-element instrumentation makes coverage depend on whoever remembered
// to add a handler. One listener sees every click, including in markup that does not
// exist yet. Capture phase rather than bubble phase because a handler is free to call
// `stopPropagation()` on the way up, and a click that the app handled must not
// disappear from the record of what happened.
//
// WHY the descriptor is read from the DOM rather than from the event: a pointer event
// carries no text, and `textContent` carries EVERYTHING the user can see. So the read
// is restricted to a tag name, an author-written `data-analytics` value, and 40
// characters of rendered label. Form controls are excluded outright — an <input>'s
// value, a <textarea>'s characters and a <select>'s chosen option are all things the
// user typed or picked, and none of them are ours to send.
//
// WHY consent is mirrored into a module flag: telemetry.trackEvent() already refuses
// to send without it, but the descriptor read is DOM work that should not happen at
// all for a visitor who has not agreed. The flag is seeded at import and kept in step
// by subscribeConsent, so granting consent mid-session starts collection immediately
// instead of at the next reload.

import { useEffect } from 'react';
import { hasConsent, subscribeConsent } from '../lib/consent';
import { trackEvent as recordEvent } from '../lib/telemetry';

const CLICK_EVENT = 'ui_click';
const PAGE_VIEW_EVENT = 'page_view';

/** Long enough to name a control, short enough that it cannot become a copy of the page. */
const MAX_LABEL_CHARS = 40;

/**
 * Anything whose rendered text is user input or a user choice.
 *
 * `[contenteditable]` is in the list because a rich-text field has no `value` to
 * protect but its children are exactly the user's characters.
 */
const FORM_CONTROL_SELECTOR =
  'input, textarea, select, option, [contenteditable]:not([contenteditable="false"])';

/**
 * A type alias rather than an interface on purpose: an alias of an object literal
 * type carries an implicit index signature, so a descriptor can be handed straight to
 * `trackEvent(name, props)` without a cast. An interface is not assignable to
 * `Record<string, unknown>`.
 */
export type ClickDescriptor = {
  /** Lower-case tag name of the element actually clicked. */
  tag: string;
  /** The nearest `data-analytics` value, when the markup declares one. */
  analyticsId?: string;
  /** Coarse visible label, masked and truncated. Never a form value. */
  text?: string;
};

export interface UseAnalyticsResult {
  trackEvent: (name: string, props?: Record<string, unknown>) => void;
  trackPageView: (page?: string) => void;
  trackClick: (label: string, props?: Record<string, unknown>) => void;
}

// ------------------------------------------------------------------- consent

let collecting = hasConsent('analytics');

// Subscribed at module scope and never unsubscribed: this mirrors a cookie that
// outlives every component, so there is no mount for it to be tied to.
subscribeConsent((state) => {
  collecting = state.status === 'granted' && state.categories.analytics === true;
});

// ------------------------------------------------------------- descriptor

/**
 * Mask the two things that turn up in rendered copy and are nobody's telemetry:
 * contact details in a listing, and long digit runs (order numbers, phone numbers).
 */
function maskSensitive(value: string): string {
  return value
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]{2,}/g, '[email]')
    .replace(/\+?\d[\d\s()-]{5,}\d/g, '[number]');
}

function coarseText(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const collapsed = raw.replace(/\s+/g, ' ').trim();
  if (!collapsed) return undefined;
  const masked = maskSensitive(collapsed).slice(0, MAX_LABEL_CHARS).trim();
  return masked || undefined;
}

function describeClick(target: EventTarget | null): ClickDescriptor | null {
  if (typeof Element === 'undefined' || !(target instanceof Element)) return null;

  const tag = target.tagName.toLowerCase();
  // The document itself is dead space, not a control; recording it buries the real
  // clicks under one event per click anywhere on the page background.
  if (!tag || tag === 'html' || tag === 'body') return null;

  // A wrapper carrying `data-analytics` labels its whole subtree, which is what lets
  // one attribute describe a card full of controls.
  const labelled = (target.closest('[data-analytics]') as Element | null) ?? target;
  const analyticsId = labelled.getAttribute('data-analytics')?.trim() || undefined;

  const isTypedContent =
    target.closest(FORM_CONTROL_SELECTOR) !== null ||
    labelled.closest(FORM_CONTROL_SELECTOR) !== null;
  const text = isTypedContent ? undefined : coarseText(labelled.textContent);

  return {
    tag,
    ...(analyticsId ? { analyticsId } : {}),
    ...(text ? { text } : {}),
  };
}

// --------------------------------------------------------------- listener

let clickListener: ((event: MouseEvent) => void) | null = null;
let mountedListeners = 0;

function onDocumentClick(event: MouseEvent): void {
  if (!collecting) return;
  const descriptor = describeClick(event.target);
  if (!descriptor) return;
  recordEvent(CLICK_EVENT, descriptor);
}

/**
 * One document-level listener, reference-counted.
 *
 * Several components may call `useAnalytics()`; attaching a listener per caller would
 * record the same click several times and remove it while another component is still
 * mounted. The count keeps it exactly one, and removes it when the last caller
 * unmounts.
 */
function useGlobalClickListener(): void {
  useEffect(() => {
    mountedListeners += 1;
    if (!clickListener) {
      clickListener = onDocumentClick;
      document.addEventListener('click', clickListener, true);
    }
    return () => {
      mountedListeners = Math.max(0, mountedListeners - 1);
      if (mountedListeners === 0 && clickListener) {
        // The capture flag must match the one passed to addEventListener, or the
        // removal silently does nothing.
        document.removeEventListener('click', clickListener, true);
        clickListener = null;
      }
    };
  }, []);
}

// -------------------------------------------------------------------- api

/** A named product event. Flat props, sanitised again on the way out and in. */
export function trackEvent(name: string, props?: Record<string, unknown>): void {
  recordEvent(name, props);
}

/**
 * A navigation within the SPA.
 *
 * `page` is the route as the app knows it: not every screen has a distinct path —
 * discovery and the merchant sheet are state, not URLs — so the caller's name is
 * worth more than `location.pathname` when it has one.
 */
export function trackPageView(page?: string): void {
  const current =
    typeof window === 'undefined'
      ? undefined
      : `${window.location.pathname}${window.location.search}`;
  const view = page ?? current;
  recordEvent(PAGE_VIEW_EVENT, view ? { page: view } : undefined);
}

/** The imperative half of the click capture, for a call site that knows more than the DOM does. */
export function trackClick(label: string, props?: Record<string, unknown>): void {
  recordEvent(CLICK_EVENT, { analyticsId: label, ...props });
}

/**
 * Installs the app-wide click capture and returns the event API.
 *
 * Called once near the root: the capture only exists while something is mounted, and
 * mounting it per page would drop the clicks made while a route chunk is loading.
 */
export function useAnalytics(): UseAnalyticsResult {
  useGlobalClickListener();
  return { trackEvent, trackPageView, trackClick };
}

/** Convenience for a component that only emits clicks and should not own the capture. */
export function useTrackClick(): (label: string, props?: Record<string, unknown>) => void {
  // `trackClick` is module-level, so its identity is already stable across renders;
  // wrapping it in useCallback would produce a function that never changes.
  return trackClick;
}
