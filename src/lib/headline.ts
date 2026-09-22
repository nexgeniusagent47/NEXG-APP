// Break a headline into balanced lines, in any language.
//
// The four-language requirement is why this is not a hardcoded split. `Intl.Segmenter` with
// `granularity: 'word'` finds the break opportunities the language actually has: spaces for
// English, Swahili and Arabic, and the correct boundaries for Chinese, which has none. Splitting
// on `' '` would leave a Chinese headline as one unbroken line.
//
// Lines are balanced by WIDTH rather than by word count. "Right where you are." is 961 units wide
// against 957 for the line above it, so an even word count would still produce a ragged block.
// A target width per line is what keeps the four lines visually similar.
export function splitHeadline(text, lineCount) {
  const clean = String(text ?? '').trim();
  if (!clean || lineCount < 2) return [clean];

  // Break opportunities for the language. Falls back to whitespace where Segmenter is absent.
  //
  // Punctuation is DROPPED rather than kept as its own token. A naive filter that keeps every
  // non-space segment yields "." as a word, and the greedy pass then treats it as something to
  // place — which produced "where you are ." with the full stop floating on its own. The
  // terminal punctuation is re-attached to the last line below, so nothing is lost.
  let words;
  try {
    const seg = new Intl.Segmenter(undefined, { granularity: 'word' });
    words = [...seg.segment(clean)]
      .filter((s) => s.isWordLike)
      .map((s) => s.segment.trim())
      .filter(Boolean);
  } catch {
    words = clean.split(/\s+/).filter(Boolean);
  }

  // Keep the final punctuation, since it belongs to the sentence rather than to a word.
  const tail = clean.match(/[.!?。！？،]+$/)?.[0] ?? '';

  if (words.length <= lineCount) return [clean];

  /*
    Balanced by width, not by word count. Two passes:

    First, an ideal line width. Words are not uniform — "Everything" is 10 characters and "you" is
    three — so a target of `total / lineCount` can fall below the longest single word, and the
    greedy pass then produces lines of wildly different lengths.

    Second, a symmetric greedy fill. A line breaks when adding the next word costs MORE than it
    would cost to stop, measured as the distance from the ideal. A one-sided test ("break once we
    pass the target") overshoots on the first line and starves the rest, because the excess is
    never given back.
  */
  const total = words.reduce((n, w) => n + w.length, 0);
  const ideal = total / lineCount;

  /*
    JOIN WITHOUT A SPACE IN SCRIPTS THAT DO NOT USE ONE.

    `Intl.Segmenter` correctly finds word boundaries in Chinese, but joining those segments with
    a space inserts gaps the language never has:

        您 所需 / 的 一切 / 尊 享 体验          <- wrong
        您所需 / 的一切 / 尊享体验              <- right

    The test is whether the text contains CJK, which is what distinguishes the two joining rules
    in practice. A space remains correct for English, Swahili and Arabic.
  */
  const usesSpaces = !/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(clean);
  const join = (a, b) => (a ? (usesSpaces ? `${a} ${b}` : `${a}${b}`) : b);

  const lines = [];
  let current = '';
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const candidate = join(current, word);
    const remainingLines = lineCount - lines.length;
    const remainingWords = words.length - i;

    // Stop if adding would overshoot more than stopping would undershoot, and there is still
    // room to place the rest. The last line always takes what remains.
    const overshoot = Math.abs(candidate.length - ideal);
    const undershoot = Math.abs(current.length - ideal);
    const mustBreak = remainingLines > 1 && remainingWords >= remainingLines;

    if (current && mustBreak && overshoot > undershoot) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);

  // Re-attach the sentence punctuation to the final line so the text reads as one sentence.
  if (tail && lines.length) {
    lines[lines.length - 1] = lines[lines.length - 1] + tail;
  }
  return lines;
}
