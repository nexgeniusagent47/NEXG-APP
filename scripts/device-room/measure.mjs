// scripts/device-room/measure.mjs
//
// THE measurement function. One implementation, used two ways:
//
//   1. `page.evaluate(MEASURE_SOURCE)` — the room's server runs it against a real
//      browser page sized to one device (see `/api/audit` in server.mjs).
//   2. `new Function(MEASURE_SOURCE)` in the room page, for the case where a frame
//      happens to be same-origin.
//
// WHY ONE IMPLEMENTATION: the audit and the room must never disagree about what
// counts as broken. A second copy of this logic would drift, and the drift would be
// invisible — both would still print a number.
//
// WHY IT RUNS ON THE SERVER: the room is served on its own port, so the frames it
// displays are cross-origin and the page cannot read their layout. (The host name
// matches; the port does not, and a port is part of an origin.) `contentDocument` is
// therefore `null` from the room, which is exactly the kind of silent failure that
// reports a clean result. Driving its own browser removes the question.
//
// CONSTRAINT: this is serialised to source text and evaluated without a compiler, so
// it must be a plain function expression — no imports, no TypeScript, no closures over
// anything but its argument, and no reference to module scope.

export const MEASURE_SOURCE = `function (opts) {
  var vw = document.documentElement.clientWidth;
  var vh = document.documentElement.clientHeight;
  var overflowX = document.documentElement.scrollWidth - vw;

  // Is this element clipped by an ancestor, and therefore unable to affect the page?
  //
  // The test must include the element ITSELF: a carousel track carries overflow-x auto
  // in other codebases, and an element that clips its own content cannot push the page
  // sideways either. The hidden and clip values both count — both mean overflowing
  // content is not painted outside the box.
  //
  // NOTE: no backtick characters anywhere inside this string. MEASURE_SOURCE is a
  // template literal, so a single backtick in a comment terminates it and the whole
  // module stops parsing. scripts/device-room/check-source.mjs fails the build on one.
  function isClipped(el) {
    for (var p = el; p && p !== document.body; p = p.parentElement) {
      var ox = window.getComputedStyle(p).overflowX;
      if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') return true;
    }
    return false;
  }

  // Elements positioned beyond the viewport.
  //
  // THE DECISION THAT MATTERS: is this a defect?
  //
  // A "past the right edge" element is only a defect if it makes the PAGE scroll
  // sideways or is visible while unusable. Everything else is a layout doing its job.
  // Two patterns here look identical to a bounding-box test and are both correct:
  //
  //   1. An off-screen carousel slide. The track holds several cards and the ones after
  //      the first sit past the right edge on purpose, clipped by an ancestor's
  //      overflow hidden so they can slide in. Measured on the home page at 360px:
  //      388 of these, and NOT ONE element in the document had overflow-x auto,
  //      because this app's carousels translate a track rather than scroll a container.
  //   2. A marquee, whose track is wider than the viewport by construction.
  //
  // So the primary verdict is the page's own horizontal overflow, which is the thing a
  // user actually experiences. An element is only reported as past the edge when it is
  // NOT clipped by any ancestor — that is, when it is genuinely loose on the page.
  // Diagnosis only: these are counted and reported, never treated as defects on their own.
  var clippedByAncestor = 0;
  var offenders = [];
  var all = document.querySelectorAll('body *');
  for (var i = 0; i < all.length; i++) {
    var el = all[i];
    var box = el.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) continue;
    var cs = window.getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
    if (cs.position === 'fixed' && box.right > vw && box.left < 0) continue;
    if (!(box.right > vw + 1 && box.left >= -1)) continue;

    if (isClipped(el)) {
      clippedByAncestor++;
      continue;
    }
    offenders.push({
      tag: el.tagName.toLowerCase(),
      cls: String(el.className || '').split(/\\s+/).slice(0, 3).join(' ').slice(0, 60),
      right: Math.round(box.right),
      width: Math.round(box.width),
      text: (el.textContent || '').trim().slice(0, 30)
    });
  }

  // Deduplicate near-identical entries so the output stays readable.
  var seen = {};
  var unique = [];
  for (var j = 0; j < offenders.length; j++) {
    var o = offenders[j];
    var k = o.tag + '|' + o.cls;
    if (seen[k]) continue;
    seen[k] = 1;
    unique.push(o);
  }
  unique.sort(function (a, b) { return b.right - a.right; });

  // Text clipped by its own box: overflow hidden and more content than space.
  //
  // The -webkit-line-clamp property forces overflow hidden as part of its own
  // mechanism, so a truncated product title is indistinguishable from a clipped one by
  // computed style alone. The distinction matters and is not cosmetic: a clamped title
  // shows two clean lines and ends in an ellipsis, which is the design working; a title
  // in a fixed-height box is cut mid-word, which is a defect. Only the second is
  // reported, which is why the clamp value is read back and skipped.
  //
  // NOTE: no backticks anywhere inside this string. MEASURE_SOURCE is a template
  // literal, so one backtick in a comment terminates it and the file stops parsing.
  var clampedInset = 0;
  function isDeliberatelyClamped(el, cs) {
    var clamp = cs.webkitLineClamp || cs['-webkit-line-clamp'];
    if (!clamp || clamp === 'none' || clamp === '0') return false;
    clampedInset++;
    return true;
  }

  var clippedEls = [];
  var clipped = 0;
  var candidates = document.querySelectorAll('h1,h2,h3,h4,p,span,div,button,a,li,td,th,figcaption,label');
  for (var m = 0; m < candidates.length; m++) {
    var c = candidates[m];
    // Only elements that RENDER TEXT. An empty decorative box (a gradient overlay, a
    // hairline) has nothing to read, so calling it "clipped text" is a false positive
    // that buries the real findings in noise. innerText is the right test rather than
    // textContent: it is empty for a hidden subtree, so off-screen decorative markup
    // cannot be counted either.
    if (!(c.innerText || '').trim()) continue;
    var ccs = window.getComputedStyle(c);
    if (ccs.overflow !== 'hidden') continue;
    if (c.clientHeight <= 0) continue;
    if (c.scrollHeight <= c.clientHeight + 4) continue;

    if (isDeliberatelyClamped(c, ccs)) continue; // deliberate truncation, not a defect

    clipped++;
    if (clippedEls.length < 6) {
      clippedEls.push({
        tag: c.tagName.toLowerCase(),
        cls: String(c.className || '').split(/\\s+/).slice(0, 3).join(' ').slice(0, 50),
        text: (c.textContent || '').trim().slice(0, 32),
        needs: c.scrollHeight,
        has: c.clientHeight
      });
    }
  }

  // Controls smaller than a comfortable touch target. 24px is the WCAG 2.2 minimum
  // for a target (2.5.8); the platform guidance is 44px, so this is a floor, not a bar.
  var tapTooSmall = 0;
  var tapExamples = [];
  var controls = document.querySelectorAll('button,a[href],input,select,textarea,[role="button"]');
  for (var n = 0; n < controls.length; n++) {
    var t = controls[n];
    var tb = t.getBoundingClientRect();
    if (tb.width === 0 || tb.height === 0) continue;
    if (tb.height < 24 || tb.width < 24) {
      tapTooSmall++;
      if (tapExamples.length < 4) {
        tapExamples.push({
          tag: t.tagName.toLowerCase(),
          w: Math.round(tb.width),
          h: Math.round(tb.height),
          text: (t.textContent || t.getAttribute('aria-label') || '').trim().slice(0, 24)
        });
      }
    }
  }

  // Ratio, not a count: raw scrollHeight is dominated by the lazily mounted
  // carousels and says nothing about whether the page rendered.
  var docHeight = document.documentElement.scrollHeight;
  var viewportRatio = vh > 0 ? Math.round((docHeight / vh) * 10) / 10 : 0;
  var bodyText = (document.body.innerText || '').trim();

  return {
    vw: vw,
    vh: vh,
    overflowX: Math.round(overflowX),
    offenderCount: offenders.length,
    clippedByAncestor: clippedByAncestor,
    worst: unique.slice(0, 5),
    clipped: clipped,
    clippedEls: clippedEls,
    tapTooSmall: tapTooSmall,
    tapExamples: tapExamples,
    docHeight: docHeight,
    viewportRatio: viewportRatio,
    bodyChars: bodyText.length,
    blank: bodyText.length < 200,
    search: location.search
  };
}`;

/**
 * The same function as a value, for callers that evaluate it directly rather than
 * serialising it. `new Function` is used instead of `eval` so this cannot reach
 * anything in this module's scope — the function only ever sees `document`, which is
 * the whole contract.
 */
export const MEASURE = new Function(`return (${MEASURE_SOURCE})`)();
