// scripts/contrast-probe.mjs
//
// THE contrast probe, as source text. One copy, used two ways:
//   1. scripts/audit-contrast.mjs      â€” measures the real routes
//   2. scripts/verify-contrast-probe.mjs â€” checks the probe against known answers
//
// WHY `String.raw`: the probe is JavaScript that must run in the browser, so it contains
// regex escapes like \\( and \\) and template placeholders like ${...}. Inside a normal
// template literal those are consumed by THIS file's parser and the browser receives
// something different from what is written â€” which is exactly what happened on the first
// attempt, where the extraction produced a string the browser rejected with
// "Invalid or unexpected token". `String.raw` passes the characters through untouched.
//
// WHY ONE COPY: a probe that is re-implemented in the verifier tests the wrong code. The
// verifier imports this same string, so "the probe passes its known cases" is a statement
// about the probe the audit actually uses.

export const CONTRAST_PROBE = String.raw`(() => {
  // Colour parsing.
  //
  // rgb()/rgba() carry sRGB channels and are read directly.
  //
  // oklab()/oklch() do NOT: oklch(0.928 0.006 264.531) is lightness 0.928, chroma 0.006 and
  // hue 264.5 degrees. Reading those three numbers as r/g/b produced ratios like 2.31:1 for
  // near-white text on near-black, and turned 0 failures into 99 the moment the parser
  // started accepting them. Tailwind v4 emits this syntax for most utilities, so leaving it
  // unresolved meant 2550 elements across the app could not be measured at all.
  //
  // They are now resolved by asking the BROWSER, which is the only parser here that is right.
  // The colour is painted to a 1x1 canvas and the pixel is read back.
  //
  // THE SENTINEL IS LOAD-BEARING. An unparsable value leaves fillStyle UNCHANGED rather
  // than throwing or blanking it, so a failed parse would silently inherit the previous
  // colour. A fixed sentinel is painted first; if the pixel still reads as the sentinel, the
  // value did not parse and the colour stays unresolved. Without that check this would
  // report confident nonsense for every value the browser rejects.
  //
  // This DOES use a canvas, which the project notes warn about - "canvas returns opaque black
  // for oklch()". That warning is about a different call pattern: getComputedStyle(...).color
  // and ctx.fillStyle both return the oklch STRING unchanged, so a probe reading those sees
  // no conversion and concludes black. Reading an actual PIXEL does convert, and it was
  // measured against the Tailwind palette before being trusted: gray-200 exact, gray-500
  // within 2/255 on one channel, black and white exact. verify-contrast-probe.mjs pins
  // gray-400 and gray-500 to the ratios DESIGN.md already documents, so a regression here
  // fails on the palette's own numbers.
  //
  // Alpha is not converted and is not canvas-readable; it is read from the source string,
  // which is exact in every syntax. Only the channel values come from the pixel.
  const SENTINEL = [0x12, 0x34, 0x56]; // #123456: matches nothing in this app's palette
  const canvas =
    typeof document !== 'undefined' ? document.createElement('canvas') : null;
  if (canvas) {
    canvas.width = 1;
    canvas.height = 1;
  }
  const ctx = canvas ? canvas.getContext('2d', { willReadFrequently: true }) : null;

  /** Channels for any CSS colour, or null when the browser will not parse it. */
  const resolveChannels = (css) => {
    if (!ctx) return null;
    ctx.fillStyle = '#123456';
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    if (d[0] === SENTINEL[0] && d[1] === SENTINEL[1] && d[2] === SENTINEL[2]) return null;
    return { r: d[0], g: d[1], b: d[2] };
  };

  const parseColor = (value) => {
    if (!value || value === 'transparent') return null;
    const m = value.match(/(rgba?|oklab|oklch|lab|lch|color)\(([^)]+)\)/);
    if (!m) return null;

    const fn = m[1];
    const body = m[2].trim();
    const slash = body.split('/');
    const parts = slash[0].split(/[,\s]+/).filter(Boolean).map(Number);
    if (parts.length < 3) return null;

    let a = 1;
    if (slash.length > 1) a = Number(slash[1].trim());
    else if (parts.length > 3) a = parts[3];
    if (isNaN(a)) a = 1;
    if (a === 0) return null;

    if (fn === 'rgb' || fn === 'rgba') {
      return { r: parts[0], g: parts[1], b: parts[2], a: a, modern: false };
    }

    // Modern syntax: ask the browser for the channels, read alpha from the string.
    const resolved = resolveChannels(value);
    if (!resolved) return { a: a, modern: true, syntax: fn, unresolvable: true };
    return { r: resolved.r, g: resolved.g, b: resolved.b, a: a, modern: false };
  };

  const relLum = ({ r, g, b }) => {
    const f = (c) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };

  const ratio = (a, b) => {
    const la = relLum(a), lb = relLum(b);
    const hi = la >= lb ? la : lb;
    const lo = la >= lb ? lb : la;
    return (hi + 0.05) / (lo + 0.05);
  };

  const blend = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1
  });

  const compositeOver = (stack, base) => {
    let out = base;
    for (const layer of stack) out = blend(layer, out);
    return out;
  };

  // Walk to the first ancestor that actually paints. A layer that is a real image or a
  // gradient stops the walk and yields "unresolved" â€” a guessed ratio is worse than none,
  // and this project has already been burned by a probe that was confidently wrong.
  //
  // THE ONE BOUNDED CASE. A stack that is already 90% opaque hides what is under it: an
  // unreadable layer beneath can move the result by at most 'remaining' of the sRGB range.
  // Stopping there turns "unmeasurable" into "measured within a stated bound", which is what
  // makes an input with a 95%-opaque fill measurable at all â€” otherwise every field, badge
  // and pill that sits over a photograph is skipped, and the placeholder text inside it is
  // never checked.
  //
  // The bound is resolved CONSERVATIVELY: the composite is computed over both a white and a
  // black base and the LOWER of the two ratios is the one reported, so a bounded check can
  // only ever be more pessimistic than the truth, never less.
  const effectiveBackground = (el) => {
    let node = el;
    const stack = [];
    let remaining = 1; // how much of what lies BENEATH the collected layers still shows
    while (node && node !== document.documentElement.parentElement) {
      if (remaining <= 0.1) {
        return {
          color: compositeOver(stack, { r: 255, g: 255, b: 255, a: 1 }),
          worst: compositeOver(stack, { r: 0, g: 0, b: 0, a: 1 }),
          bounded: remaining
        };
      }
      const cs = getComputedStyle(node);
      const bgImage = cs.backgroundImage && cs.backgroundImage !== 'none';
      const bg = parseColor(cs.backgroundColor);

      // Image first: a url(...) layer is the harder case and its value can also contain a
      // gradient, so testing "gradient" first would report an image as a gradient.
      if (bgImage && /url\(/.test(cs.backgroundImage)) return { unresolved: 'image' };
      if (bgImage && /gradient/.test(cs.backgroundImage)) return { unresolved: 'gradient' };

      // A translucent layer must be COMPOSITED, not ignored and not treated as opaque.
      // Treating a 75%-black badge as transparent resolves to the white page behind it and
      // reports white-on-white at 1.00:1 for text that actually sits at about 8:1 - a
      // false positive that was produced for real on the spa page, and which would have
      // sent someone to "fix" a badge that was already correct.
      //
      // Every layer that reaches here now carries real sRGB channels: rgb() directly, and
      // oklab/oklch through the browser. A value the browser refuses to parse comes back
      // flagged and stops the walk rather than being approximated.
      if (bg) {
        if (bg.unresolvable) return { unresolved: 'unparsable-colour' };
        stack.unshift(bg);
        remaining *= 1 - bg.a;
      }
      node = node.parentElement;
    }
    return { color: compositeOver(stack, { r: 255, g: 255, b: 255, a: 1 }) };
  };

  // Text painted over an img cannot have its contrast derived from CSS, and this app uses
  // that pattern for several decorative sections (a photograph with a bg-black/60 scrim).
  //
  // This produced a real false failure: "Ready to Transform Your Property?" was reported as
  // white-on-white at 1.05:1 in light mode. The heading sits on a photograph with a 60%
  // black scrim, which the walk could not see, because the scrim is transparent in modern
  // syntax and an img is not a CSS background at all - so it fell through to the page
  // colour. Reporting it was worse than saying nothing.
  const overImage = (el, textRect) => {
    for (var n = el.parentElement; n && n !== document.body; n = n.parentElement) {
      var cs = getComputedStyle(n);
      if (cs.position === 'static') continue;
      var imgs = n.querySelectorAll(':scope > img, :scope > picture > img, :scope > div > img');
      for (var i = 0; i < imgs.length; i++) {
        var r = imgs[i].getBoundingClientRect();
        if (r.width < 8 || r.height < 8) continue;
        if (r.right > textRect.left && r.left < textRect.right && r.bottom > textRect.top && r.top < textRect.bottom) {
          return true;
        }
      }
    }
    return false;
  };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    // Only elements that render their own text.
    const own = Array.prototype.some.call(el.childNodes, (n) => n.nodeType === 3 && n.textContent.trim().length > 1);

    // A placeholder is an ATTRIBUTE, not a text node, so a field whose only visible text is
    // its placeholder was skipped outright by the test above. It is still text a user reads
    // before typing: the hero search field was the single most prominent string on the home
    // page and 3248 checks never looked at it. Its colour lives on the ::placeholder pseudo
    // element, which is readable through the second argument of getComputedStyle.
    const phEl = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
    const ph = phEl ? String(el.getAttribute('placeholder') || '').trim() : '';
    const isPlaceholder = !own && ph.length > 1;
    if (!own && !isPlaceholder) continue;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (parseFloat(cs.opacity) < 0.1) continue;

    const textValue = isPlaceholder ? ph : (el.textContent || '').trim();
    const pseudo = isPlaceholder ? getComputedStyle(el, '::placeholder') : null;
    const colorValue = isPlaceholder ? pseudo.color : cs.color;
    const fontSizeValue = parseFloat(isPlaceholder ? pseudo.fontSize : cs.fontSize);
    const fontWeightValue = Number(isPlaceholder ? pseudo.fontWeight : cs.fontWeight) || 400;

    const bgInfo = effectiveBackground(el);

    // Text painted over an img cannot have its contrast derived from CSS, and this app uses
    // that pattern for several decorative sections (a photograph with a bg-black/60 scrim).
    //
    // This produced a real false failure: "Ready to Transform Your Property?" was reported as
    // white-on-white at 1.05:1 in light mode. The heading sits on a photograph with a 60%
    // black scrim, which the walk could not see, because the scrim is transparent in modern
    // syntax and an img is not a CSS background at all - so it fell through to the page
    // colour. Reporting it was worse than saying nothing.
    //
    // It is consulted when the walk had to stop, AND when the walk resolved without a bound:
    // a resolved stack that never met a painted layer has reached the page colour, which says
    // nothing about an img that may be painting in between. A BOUNDED result is the one case
    // where the image provably cannot matter, because the stack already hides 90% of it.
    if (!bgInfo.bounded && overImage(el, rect)) {
      out.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || '',
        cls: String(el.className || '').slice(0, 60),
        text: textValue.slice(0, 46),
        fontSize: fontSizeValue,
        fontWeight: fontWeightValue,
        color: colorValue,
        bg: null,
        placeholder: isPlaceholder,
        unresolved: 'image'
      });
      continue;
    }

    if (bgInfo.unresolved) {
      out.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || '',
        cls: String(el.className || '').slice(0, 60),
        text: textValue.slice(0, 46),
        fontSize: fontSizeValue,
        fontWeight: fontWeightValue,
        color: colorValue,
        bg: null,
        placeholder: isPlaceholder,
        unresolved: bgInfo.unresolved
      });
      continue;
    }

    const fg = parseColor(colorValue);
    if (!fg) continue;

    // A foreground the browser could not parse. Every parsed colour now carries sRGB
    // channels, so this only fires on a genuinely unreadable value.
    if (fg.unresolvable) {
      out.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || '',
        cls: String(el.className || '').slice(0, 60),
        text: textValue.slice(0, 46),
        fontSize: fontSizeValue,
        fontWeight: fontWeightValue,
        color: colorValue,
        bg: null,
        placeholder: isPlaceholder,
        unresolved: 'modern-colour'
      });
      continue;
    }

    const rgb = (c) => 'rgb(' + Math.round(c.r) + ', ' + Math.round(c.g) + ', ' + Math.round(c.b) + ')';
    const record = {
      tag: el.tagName.toLowerCase(),
      id: el.id || '',
      cls: String(el.className || '').slice(0, 60),
      text: textValue.slice(0, 46),
      fontSize: fontSizeValue,
      fontWeight: fontWeightValue,
      color: colorValue,
      bg: rgb(bgInfo.color),
      placeholder: isPlaceholder,
      unresolved: null
    };

    const composedFg = fg.a < 1 ? blend(fg, bgInfo.color) : fg;
    if (bgInfo.bounded) {
      // Report the WORSE of the two possible backdrops, so a bounded check can only be more
      // pessimistic than the truth. The best case stays on the record so a borderline result
      // can be judged rather than trusted.
      const worst = blend(fg, bgInfo.worst);
      const rWhite = ratio(composedFg, bgInfo.color);
      const rBlack = ratio(worst, bgInfo.worst);
      record.bg = rgb(bgInfo.color) + ' .. ' + rgb(bgInfo.worst);
      record.ratio = Math.round(Math.min(rWhite, rBlack) * 100) / 100;
      record.ratioBest = Math.round(Math.max(rWhite, rBlack) * 100) / 100;
      record.boundedBy = Math.round(bgInfo.bounded * 1000) / 1000;
    } else {
      record.ratio = Math.round(ratio(composedFg, bgInfo.color) * 100) / 100;
    }
    out.push(record);
  }
  return out;
})()`;
