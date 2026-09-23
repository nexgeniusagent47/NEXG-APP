// scripts/contrast-probe.mjs
//
// THE contrast probe, as source text. One copy, used two ways:
//   1. scripts/audit-contrast.mjs      — measures the real routes
//   2. scripts/_verify-contrast-probe.mjs — checks the probe against known answers
//
// WHY `String.raw`: the probe is JavaScript that must run in the browser, so it contains
// regex escapes like \\( and \\) and template placeholders like ${...}. Inside a normal
// template literal those are consumed by THIS file's parser and the browser receives
// something different from what is written — which is exactly what happened on the first
// attempt, where the extraction produced a string the browser rejected with
// "Invalid or unexpected token". `String.raw` passes the characters through untouched.
//
// WHY ONE COPY: a probe that is re-implemented in the verifier tests the wrong code. The
// verifier imports this same string, so "the probe passes its known cases" is a statement
// about the probe the audit actually uses.

export const CONTRAST_PROBE = String.raw`(() => {
  // Colour parsing.
  //
  // TWO DISTINCT PROBLEMS, and the honest answer differs for each.
  //
  // 1. rgb()/rgba() - parsed exactly, channels and alpha.
  //
  // 2. oklab()/oklch() - Tailwind v4 emits these for most utilities. Their channel values
  //    are NOT sRGB: oklch(0.928 0.006 264.531) is lightness 0.928, chroma 0.006 and hue
  //    264.5 degrees. Reading those three numbers as r/g/b produced ratios like 2.31:1 for
  //    near-white text on near-black, which is nonsense, and it turned 0 failures into 99
  //    the moment the parser started accepting them.
  //
  //    There is no colour-space conversion here, and inventing one would be the mistake
  //    this project keeps repeating: a confidently wrong number is worse than no number.
  //    So oklab/oklch colours are reported UNRESOLVED and counted separately, never
  //    silently passed and never guessed at.
  //
  //    The one exception is ALPHA, which is meaningful in every space: a 75%-black badge
  //    composites as 75% black whatever syntax expressed it, and opaque-versus-translucent
  //    is the only question the background walk needs answered. So alpha is read from all
  //    syntaxes, and the channels are read only from rgb/rgba.
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
    return { a: a, modern: true, syntax: fn };
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

  // Walk to the first ancestor that actually paints. A layer that is a real image or a
  // gradient stops the walk and yields "unresolved" — a guessed ratio is worse than none,
  // and this project has already been burned by a probe that was confidently wrong.
  const effectiveBackground = (el) => {
    let node = el;
    const stack = [];
    while (node && node !== document.documentElement.parentElement) {
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
      if (bg && bg.a > 0) {
        if (bg.modern && bg.a < 1) {
          // A translucent modern-syntax layer: alpha is meaningful in every colour space,
          // but the channels are not sRGB, so this layer can be counted as coverage only
          // when it is black (which composites as black in any space). Anything else stops
          // the walk rather than being approximated.
          if (bg.syntax === 'oklab' || bg.syntax === 'oklch') {
            // oklab/oklch lightness 0 is black; a fully black layer needs no conversion.
            const bgCss = cs.backgroundColor;
            const isBlack =
              /^ok(lab|ch)\(\s*0(\.0+)?\s/.test(bgCss.trim()) || /^ok(lab|ch)\(\s*0\s/.test(bgCss.trim());
            if (!isBlack) return { unresolved: 'modern-colour' };
            stack.unshift({ r: 0, g: 0, b: 0, a: bg.a });
          } else {
            return { unresolved: 'modern-colour' };
          }
        } else if (bg.modern) {
          // Opaque modern-syntax background: the ratio cannot be derived from CSS here.
          return { unresolved: 'modern-colour' };
        } else {
          stack.unshift(bg);
        }
      }
      node = node.parentElement;
    }
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (const layer of stack) base = blend(layer, base);
    return { color: base, node: null };
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
    if (!own) continue;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    if (parseFloat(cs.opacity) < 0.1) continue;

    if (overImage(el, rect)) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || '').slice(0, 60),
        text: (el.textContent || '').trim().slice(0, 46),
        fontSize: parseFloat(cs.fontSize),
        fontWeight: Number(cs.fontWeight) || 400,
        color: cs.color,
        bg: null,
        unresolved: 'image'
      });
      continue;
    }

    const fg = parseColor(cs.color);
    if (!fg) continue;

    const bgInfo = effectiveBackground(el);

    // A foreground in modern syntax cannot be resolved either. Report it rather than
    // reading oklch channels as r/g/b, which is what produced 99 bogus failures.
    if (fg.modern) {
      out.push({
        tag: el.tagName.toLowerCase(),
        cls: String(el.className || '').slice(0, 60),
        text: (el.textContent || '').trim().slice(0, 46),
        fontSize: parseFloat(cs.fontSize),
        fontWeight: Number(cs.fontWeight) || 400,
        color: cs.color,
        bg: null,
        unresolved: 'modern-colour'
      });
      continue;
    }

    const record = {
      tag: el.tagName.toLowerCase(),
      cls: String(el.className || '').slice(0, 60),
      text: (el.textContent || '').trim().slice(0, 46),
      fontSize: parseFloat(cs.fontSize),
      fontWeight: Number(cs.fontWeight) || 400,
      color: cs.color,
      bg: bgInfo.color
        ? 'rgb(' + Math.round(bgInfo.color.r) + ', ' + Math.round(bgInfo.color.g) + ', ' + Math.round(bgInfo.color.b) + ')'
        : null,
      unresolved: bgInfo.unresolved || null
    };

    if (bgInfo.color) {
      const composedFg = fg.a < 1 ? blend(fg, bgInfo.color) : fg;
      record.ratio = Math.round(ratio(composedFg, bgInfo.color) * 100) / 100;
    }
    out.push(record);
  }
  return out;
})()`;
