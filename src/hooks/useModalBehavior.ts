// src/hooks/useModalBehavior.ts
//
// The behaviour that makes an overlay an actual modal.
//
// Every one of these is invisible until it is missing, and each has a distinct
// failure mode:
//
//   * Escape to dismiss      — without it a keyboard user cannot leave the surface
//                              at all, and must reach for the mouse.
//   * Background scroll lock — without it a thumb-drag outside the sheet scrolls
//                              the page underneath, losing the user's place in a
//                              long catalogue while they are mid-form.
//   * Initial focus          — without it focus stays on the page behind, so a
//                              screen reader never announces the dialog.
//   * Focus restore          — without it, closing the dialog drops focus to the
//                              document body and the user restarts navigation from
//                              the top of the page.
//
// MerchantPreviewSheet implemented all four inline. MerchantItemModal — the
// highest-stakes surface in the flow — implemented none, so the two overlays one
// layer apart behaved differently. This hook is that behaviour in one place,
// which is the only way the two cannot drift again.

import { useEffect, useRef } from 'react';

interface UseModalBehaviorOptions {
  /** Whether the modal is currently mounted and visible. */
  isOpen: boolean;
  /** Called on Escape and on backdrop activation. */
  onClose: () => void;
}

export function useModalBehavior({ isOpen, onClose }: UseModalBehaviorOptions) {
  // Element to focus when the modal opens. Falls back to the panel itself.
  const initialFocusRef = useRef<HTMLElement | null>(null);
  // Element that had focus before opening, so it can be restored on close.
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus after paint so the node exists and its transition has begun.
    const focusTimer = window.setTimeout(() => {
      const target =
        initialFocusRef.current ??
        (document.querySelector('[data-modal-panel]') as HTMLElement | null);
      target?.focus();
    }, 50);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      // Restore focus only if the previous element is still in the document.
      const previous = returnFocusRef.current;
      if (previous && document.contains(previous)) previous.focus();
    };
  }, [isOpen, onClose]);

  return { initialFocusRef };
}
