# Font licensing research: "ITC Avant Garde Gothic" + "Cooper BT" for a production React/Vite site

Research date: verified against live sources via direct HTTP fetch. All URLs cited were fetched successfully
unless explicitly marked as unverifiable.

---

## 1. What these fonts actually are

### 1.1 ITC Avant Garde Gothic

| Item | Finding |
|---|---|
| Designers | Herb Lubalin & Tom Carnase (1970, from Lubalin's *Avant Garde* magazine logo); condensed styles by Ed Benguiat (1974); obliques by André Gürtler, Erich Gschwind, Christian Mengelt (1977) |
| Rights holder today | **Monotype** — the fonts.com product page states verbatim: "*ITC Avant Garde Gothic® is a trademark of Monotype ITC Inc. registered in the U.S. Patent and Trademark Office*". ITC is a Monotype brand. |
| Adobe Fonts attribution | "ITC Avant Garde Gothic — **From Monotype**" |
| Current commercial product names | **`ITC Avant Garde Gothic Pro`** (10 styles: Extra Light, Extra Light Oblique, Book, Book Oblique, Medium, Medium Oblique, Demi Bold, Demi Bold Oblique, Bold, Bold Oblique), **`ITC Avant Garde Gothic Std Condensed`** (10 condensed styles), and **`ITC Avant Garde Gothic Paneuropean`** |
| Where sold | fonts.com (Monotype retail), MyFonts (ITC cut **and** a separate Paratype cut with Cyrillic), linotype.com, Adobe Fonts (hosted webfont only) |

Note: there is no single "ITC Avant Garde Gothic" SKU. Monotype's own cut is 20 styles
(Pro + Std Condensed). MyFonts also lists a **Paratype** cut of 10 styles. Pick the cut deliberately —
mixing files from different cuts will produce inconsistent metrics.

Sources:
- https://www.fonts.com/font/itc/itc-avant-garde-gothic
- https://www.myfonts.com/collections/itc-avant-garde-gothic-font-paratype
- https://fonts.adobe.com/fonts/itc-avant-garde-gothic

### 1.2 Cooper Black vs "Cooper BT" vs modern revivals

Three distinct things are commonly confused:

**(a) Cooper Black — the 1922 original.**
Designed by **Oswald Bruce Cooper**, released by **Barnhart Brothers & Spindler** (Chicago) in **1922** as the
extra-bold weight of his "Cooper Old Style" family. Barnhart had been bought by **American Type Founders (ATF)**
in 1911, so ATF acquired the rights. It was subsequently re-issued/digitised by ATF, Adobe, Mergenthaler
Linotype, Bitstream, URW and Monotype.
Source: https://en.wikipedia.org/wiki/Cooper_Black

**(b) "Cooper BT" — the Bitstream digitisation.**
"BT" is Bitstream's naming suffix. It is a *digital revival/digitisation of the Cooper family*, not the metal
original. **Monotype acquired Bitstream Inc.'s font business — including MyFonts.com — in March 2012, in an
all-cash merger valued at about $50 million.** So Cooper BT is a Monotype asset today.

Cooper BT is **still sold, under exactly the name "Cooper BT"**, credited "by Bitstream":
11 styles — Std Light, Light Italic, Medium, Medium Italic, Bold, Bold Italic, **Black**, Black Italic,
Black Headline, Black Italic Headline, Black Outline.

- **$26.90 USD per style; $295.99 USD for the 11-style family pack**
- Sold on MyFonts and on Linotype (Monotype-owned)

Sources:
- https://www.myfonts.com/collections/cooper-font-bitstream
- https://www.linotype.com/1083485/cooper-bt-black-product.html
- https://www.bostonglobe.com/business/2012/03/21/monotype-imaging-completes-acquisition-bitstream-font-business/4H8yzC6uXKsvpEGDEoiiHK/story.html

**(c) Other digitations and revivals** (all different files, different licences):

| Version | Owner | Notes |
|---|---|---|
| **Cooper Black** (Adobe Originals) | Adobe | Adobe's *own* digitisation, distinct from Cooper BT. On Adobe Fonts as "Cooper Black", "From **Adobe Originals**" |
| Cooper Black (URW) | URW / Artifex | No italic; historically bundled with many Microsoft products |
| **Cooper\*** | Owen Earl / indestructible type\* | **OFL-1.1 open-source revival of the whole Cooper series, incl. Black** — see §3 |
| New Kansas | Newlyn (Miles Newlyn) | Commercial Cooper Black centennial revival, available on Adobe Fonts |
| Recoleta | Latinotype (Monotype) | Commercial, Cooper-adjacent 1970s soft serif |

**Important for the brief:** if the client says "Cooper BT", they mean the Bitstream/Monotype product, not
Adobe's Cooper Black. Those are different files with different metrics — do not substitute one for the other
silently.

---

## 2. Web embedding licensing

### 2.1 Can these be self-hosted as woff2?

**Yes — but only under a Monotype Webfont licence, not under Adobe Fonts.**

**Adobe Fonts: self-hosting is explicitly prohibited.** Verbatim from Adobe's own web-font licensing FAQ:

> "No. Adobe doesn't offer the ability to host fonts locally. […] If local hosting (also known as
> self-hosting) is needed, you must purchase a license from the foundry or from an authorized reseller."
>
> "The web font license requires that fonts be added to your website by the embed code provided. […] Any
> other method of displaying the font on your website isn't allowed."

Source: https://helpx.adobe.com/fonts/web/font-licensing/webfont-licensing.html

**Monotype Webfont licence: self-hosting on your own server IS the licensed model.** From the MyFonts
WebFont EULA (this is the actual EULA attached to Cooper BT):

> "a worldwide […], non-exclusive, non-assignable, non-transferable […] license to: **install the Font
> Software on a Server**, solely to generate content on a Website **for up to the number of Page Views**
> indicated in your Account or transaction documentation"

> "**Server** means any server that is either (a) maintained on your premises; (b) under your exclusive
> control; or (c) owned and controlled by a third-party hosting service for your benefit, provided that you
> (i) have a written agreement regarding the Use and protection of the Font Software installed on such server"

So a CDN/host under your control is acceptable, with a written agreement.

**Three restrictions in that same EULA that matter a lot for a React/Vite app:**

1. **SaaS / product UI exclusion:** "This license does not allow the Font Software (i) to be embedded in a
   **Web Based Customer Product (e.g., a web server application, SaaS or other online product)**".
   If the app is a marketing site → Webfont licence is the right product. If the app *is* the product
   (logged-in SaaS UI), the standard Webfont licence does **not** cover it — you must ask Monotype for the
   correct licence.
2. **Authoring exclusion:** the fonts may not be used in an application that lets users create designs or
   documents.
3. **Per-website, per-domain:** "Businesses or organizations such as advertising agencies, design agencies or
   hosting providers that are responsible for multiple of its own or its clients' Websites must enter into
   **separate Agreements for each Website**." A single webfont licence may not be shared across domains.

Also: using the font in a **static logo image** is a *Desktop* licence matter, not a webfont one.

Sources:
- https://www.myfonts.com/pages/license-agreement?id=eula_2267 (Cooper BT WebFont EULA — fetched successfully)
- https://www.myfonts.com/collections/cooper-font-bitstream?tab=licensing

### 2.2 Are they on Adobe Fonts?

**Both are — under these exact names:**

| Adobe Fonts name | Attribution shown | Notes |
|---|---|---|
| **`ITC Avant Garde Gothic`** | From **Monotype** | The licensed ITC/Monotype family |
| **`Cooper Black`** | From **Adobe Originals** | Adobe's digitisation — **not** Bitstream's Cooper BT |

There is **no "Cooper BT" on Adobe Fonts**. The Adobe Originals Cooper Black is a different file from Cooper BT.

I could not verify the complete per-style inventory on those two Adobe Fonts pages: the style/weight selector
is rendered client-side and is not present in the served HTML, and Adobe's internal JSON/API endpoints
returned 404/500 to unauthenticated requests. Treat "which weights exactly" as **unverified** — confirm in the
Adobe Fonts UI when signed in.

Sources:
- https://fonts.adobe.com/fonts/itc-avant-garde-gothic
- https://fonts.adobe.com/fonts/cooper-black

### 2.3 Cost model

**Adobe Fonts — subscription, not per-font.**
Three access levels exist (as of Fall 2022, still current in Adobe's docs):
**Adobe Fonts Pro** — full library, included with Creative Cloud, Acrobat Pro/Standard, paid Adobe Express
plans, and **paid single-app desktop plans**; **Adobe Fonts Standard** — reduced library, for paid mobile-only
/ web-only plans and plans priced at $5/month or lower; **Adobe Fonts Free** — limited.
Caveats: you must be signed in to the Creative Cloud desktop app with a **named-user** subscription — "You
can't add fonts with a device or site-wide license". For client sites, **the client must hold their own
subscription**; an agency may not lend its own.
I did **not** verify a current monthly CC price (adobe.com timed out repeatedly) — confirm at purchase.

Source: https://helpx.adobe.com/fonts/web/introduction/system-subscription-requirements.html

**Monotype / MyFonts — per-style + per-pageview annual.**
The MyFonts FAQ describes the standard model verbatim:

> "You get a total number of pageviews that can be used **per month**. […] if you purchase 250,000 pageviews
> per month, when your webpages using the webfonts have been viewed 250,000 times in a single month, you will
> need to buy the webfont package again for a higher tier of pageviews per month."

"Page View" is defined in the EULA as "a single request to load a particular web page … regardless of whether
such visit or display is unique" — i.e. **raw page requests, not unique visitors**. You must keep records and
certify usage on request within 30 days. The licence is term-based (annual by default, auto-renew optional).

**Price anchors I verified** (desktop licences, useful as scale references; webfont tiers are quoted
dynamically at cart/checkout and I could not retrieve exact pageview-tier prices without a cart session):

| Product | Per style | Family pack |
|---|---|---|
| Cooper BT (Bitstream, 11 styles) | $26.90 | $295.99 |
| ITC Avant Garde Gothic Pro (Monotype, fonts.com) | $42.99 | $329.98 (complete 20-style pack); $219.98 (10-style pack) |
| ITC Avant Garde Gothic (Paratype cut, 10 styles) | $19.90 | $199.00 |

Licence types offered on both families: Desktop, Company Desktop, **Webfonts**, App, Electronic Doc,
Digital Ad/Email, Server.

Sources:
- https://www.myfonts.com/pages/faq
- https://www.fonts.com/font/itc/itc-avant-garde-gothic
- https://www.myfonts.com/collections/itc-avant-garde-gothic-font-paratype

**Monotype Fonts** (the enterprise subscription product) exists but has **no public pricing** — the plans page
is a "Speak to sales" contact form. Budgets for that path must come from a quote.

### 2.4 Is there a free/open licence version of either original?

**No. Be unambiguous about this.**

- **ITC Avant Garde Gothic** is proprietary and trademarked (Monotype ITC Inc.). There is **no OFL, Apache or
  GPL release of the original**, and it is **not on Google Fonts**. What exists freely are *clones* and
  *lookalikes* (§3.1) — legally distinct designs, not the original.
- **Cooper BT / Cooper Black** is proprietary. There is **no free release of Cooper BT or of Adobe's Cooper
  Black**. What exists freely is an independent **OFL revival of the underlying 1920s Cooper designs**
  (Cooper\*, §3.2) — a different, separately drawn font that is legally usable, plus looser lookalikes.

I verified against the full Google Fonts catalogue metadata (`https://fonts.google.com/metadata/fonts`):
**zero families matching "Cooper", "Avant", or "Adventor"** are on Google Fonts. Neither the originals nor
their closest clones are available from Google Fonts.

---

## 3. Free / open substitutes that can legally be self-hosted or loaded from Google Fonts

### 3.1 For the Avant Garde role

**The URW clone history — confirmed.**
**URW Gothic L is a metric-compatible clone of ITC Avant Garde Gothic**, created as a replacement for the
PostScript Base 35 font set shipped with Ghostscript, and subsequently released under free/open-source terms.
Fonts In Use states verbatim: "*URW Gothic L is a version of ITC Avant Garde Gothic with identical metrics,
intended for use as a replacement in the PostScript Base 35 fonts for the Ghostscript program. The font has
since been released under free and open source terms.*"

The TeX Gyre Adventor release history corroborates the chain: URW++ (Dr. Peter Rosenfeld) agreed in 2009 to
release the 35 Ghostscript base fonts under LPPL/GPL/AFPL; TeX Gyre fonts were developed from the Ghostscript
4.00 base; a Cyrillic subset could not be cleared (Valek Filippov's glyphs), **so TeX Gyre Adventor has no
Cyrillic**.

Sources:
- https://fontsinuse.com/typefaces/20262/urw-gothic
- https://www.gust.org.pl/projects/e-foundry/tex-gyre/adventor/tg-hist-adventor.txt

| Font | Licence | Where to get it | Closeness to ITC Avant Garde Gothic |
|---|---|---|---|
| **TeX Gyre Adventor** | **GUST Font License** — legally equivalent to **LPPL 1.3c or later**; DFSG-free. **Not OFL.** Contains only a *non-binding request* (not a requirement) to rename derived works | CTAN / GUST: https://ctan.org/pkg/tex-gyre-adventor · https://www.gust.org.pl/projects/e-foundry/tex-gyre/ | **Very close** — it is the metric-compatible URW clone, re-engineered. Caveats: **not on Google Fonts** (self-host only); **no Cyrillic**; no Monotype "Pro" extras (the 33 alternates/ligatures added in ITC's OpenType release); based on the older Base-35 digitisation |
| **URW Gothic** (`urw-base35-fonts`) | **AGPL-3.0 with a font exception** — the exception covers embedding in documents (PostScript/PDF), *not* web distribution | Artifex: https://github.com/ArtifexSoftware/urw-base35-fonts · Debian `fonts-urw-base35` | **Very close** (same clone). **Licence caution:** shipping the woff2 to every visitor is distribution/network use under AGPL-3. For a commercial production site this is genuinely awkward — prefer TeX Gyre Adventor, which is the same design under a non-copyleft licence |
| **Jost** | **OFL-1.1** | Google Fonts | **Similar spirit** — but note it is **Futura**-derived (Paul Renner, 1920s Germany), originally released as "Renner\*" and renamed for IP reasons. It is *not* an Avant Garde clone. Same designer as Cooper\* (Owen Earl) |
| **Poppins** | **OFL-1.1** | Google Fonts | **Similar spirit** — geometric, compass-and-circle construction; taller x-height and monolinear, reads more contemporary than Avant Garde |
| **Questrial** | **OFL-1.1** | Google Fonts | **Similar spirit** — geometric sans, single weight, clean circles |
| **Didact Gothic** | **OFL-1.1** | Google Fonts | **Similar spirit** — geometric, single weight, very plain |
| **Montserrat** | **OFL-1.1** | Google Fonts | **Loose** — Gotham-like American geometric, wider and rounder; not Avant-Garde-derived |
| **Urbanist**, **Outfit**, **Sora** | **OFL-1.1** | Google Fonts | **Loose** — modern geometric sans, wrong era feel for an Avant Garde pastiche |

Facts about Jost verified at https://github.com/indestructible-type/Jost. Google Fonts licence strings verified
directly from upstream `METADATA.pb` files in https://github.com/google/fonts.

### 3.2 For the Cooper role

**A legitimate OFL Cooper revival does exist — this is the headline finding.**

**Cooper\*** — by **Owen Earl** (indestructible type\*, the same designer as Jost)
- **Licence: SIL Open Font License 1.1** (`OFL.txt`: "Copyright 2024 The Cooper\* Project Authors")
- **What it is:** "a meticulously researched, historically accurate revival of the Cooper series designed by
  Oswald Cooper and released by Barnhart Brothers & Spindler in the 1920s", researched against the 1923
  Barnhart Brothers & Spindler catalogue, the 1934 ATF catalogue, and the 1949 *Book of Oz Cooper*
- **Ships a Black weight**, so it covers the Cooper Black role specifically
- Full family in-repo: Regular, Italic, Medium, Medium Italic, SemiBold, SemiBold Italic, Bold, Bold Italic,
  ExtraBold, ExtraBold Italic, **Black, Black Italic**, plus variable `Cooper[wght].ttf` / `Cooper-Italic[wght].ttf`
- **woff2 webfonts are already built and committed** (e.g. `fonts/webfonts/Cooper-Black.woff2`, ~44 KB — I
  verified this downloads with HTTP 200)
- Repo active (last push 2025-05-25), not archived, 104 stars, no GitHub Releases — pull from the repo
- **Not on Google Fonts** — self-host it
- Caveat: it is a one-designer project with a small contributor base, and its own specimen page notes that
  some symbols Oswald Cooper never drew were added by the author. Treat as "high quality but verify glyph
  coverage against your copy" rather than a foundry-grade product

Sources:
- https://github.com/indestructible-type/Cooper (verified: OFL-1.1, family listing, woff2 assets)
- https://indestructibletype.com/Cooper/

| Font | Licence | Where | Closeness to Cooper Black |
|---|---|---|---|
| **Cooper\*** (Black) | **OFL-1.1** | GitHub / indestructibletype.com | **Very close** — historically researched revival of the actual Cooper series, Black weight included |
| **Fraunces** | **OFL-1.1** | Google Fonts | **Similar spirit** — variable display serif, `wght` 100–900, `opsz` 9–144, plus **SOFT** and **WONK** axes (verified from `METADATA.pb`). Crank SOFT up + WONK down + wght 900 for a warm, blobby 1970s display feel. Not a Cooper clone |
| **Young Serif** | **OFL-1.1** | Google Fonts | **Similar spirit** — very chunky, soft-cornered serif; single weight; good "friendly heavy" stand-in |
| **Calistoga** | **OFL-1.1** | Google Fonts | **Similar spirit** — warm, rounded, mid-century signage serif (Sorkin Type) |
| **Alfa Slab One** | **OFL-1.1** | Google Fonts | **Loose** — heavy slab, right *weight*, wrong serif structure |
| **Bowlby One** | **OFL-1.1** | Google Fonts | **Loose** — fat rounded display, more 1970s cartoon than Cooper |
| **Rammetto One** | **OFL-1.1** | Google Fonts | **Loose** — heavy rounded display |
| **Bitter** | **OFL-1.1** | Google Fonts | **Loose** — contemporary slab for text, not a display face |
| **Roboto Slab** | **Apache-2.0** | Google Fonts | **Loose** — neutral slab, wrong personality |
| ~~Preschool~~ | **none — do not use** | github.com/eliheuer/preschool | Described as "A Cooper-Black-like OFL free/libre font", but the repo has **no licence file and no font binaries** (verified). Not usable |
| New Kansas (Newlyn) | Commercial | Adobe Fonts | **Very close** by intent — a Cooper Black centennial revival, but paid |
| Recoleta (Latinotype) | Commercial | Fontspring / Monotype | **Similar spirit** — paid |

All Google Fonts licence strings above were read directly from upstream `METADATA.pb` in
https://github.com/google/fonts, not from third-party summaries.

---

## 4. Practical recommendation

In order of preference:

### Option A — Client supplies licensed woff2 files (self-hosted). **Recommended if the client already owns a licence.**
This is the only path that gets the *actual* typefaces and also keeps the app's font loading self-contained
(no third-party CDN in the critical path, no privacy/GDPR exposure from an external font host).

**What you need from the client, in writing:**
1. **Which licence and with whom** — a Monotype/MyFonts **Webfont licence** is what permits self-hosting.
   If they only have **Adobe Fonts**, self-hosting is *not* permitted and you must fall back to Option B.
2. **The webfont kit itself** — the `.woff2` files, plus the CSS the foundry supplies, plus the EULA text.
3. **Exact styles licensed**, by foundry style name (e.g. `Cooper BT Std Black`, `ITC Avant Garde Gothic Pro
   Book`). Confirm you have the weights you intend to use — and confirm they are the same *cut* throughout
   (Monotype cut vs Paratype cut vs Adobe Originals Cooper Black are not interchangeable).
4. **The licensed domain(s)**, spelled out. The licence is **per website/domain**; confirm whether
   `www`, bare domain, subdomains, staging, and preview deploys are covered. Budget a separate licence for
   staging/preview if not.
5. **The licensed monthly Page View tier and term dates**, plus who owns renewal. "Page View" = raw page
   requests, unique or not. Agree who monitors and who pays for a tier upgrade if traffic exceeds it —
   the EULA obliges the licensee to upgrade or stop using the font.
6. **Confirmation that your app qualifies as a "Website"** and not a "Web Based Customer Product
   (e.g. … SaaS or other online product)" under the Webfont EULA. If the app is a logged-in product UI,
   get an explicit written confirmation from Monotype that the licence covers it — the standard Webfont
   EULA excludes it.
7. **Written permission to serve the files from your host/CDN.** The EULA's "Server" definition covers your
   own and third-party hosts under your control, but it requires a written agreement about the fonts'
   use and protection — get that in the file.
8. **Whether subsetting is permitted.** Many EULAs restrict modification; do not run `glyphhanger`/subsetting
   on licensed files without written confirmation.
9. Any **trademark attribution** requirements.

Then wire it up in the Vite build as local `@font-face` rules with `font-display: swap`,
`<link rel="preload">` for the primary weights, and `unicode-range` subsetting only if permitted.

### Option B — Adobe Fonts, if the client already pays for Creative Cloud
Cheapest and fastest if a CC subscription exists. Add both families by exact name
(**`ITC Avant Garde Gothic`**, **`Cooper Black`**) and drop Adobe's `<link>` embed code into the app shell.
**The client must own the subscription** — an agency's own CC account may not be used for a client's site,
and Adobe's terms forbid transferring the project to the client unless the client has their own subscription.
Accepted trade-offs: Adobe-hosted CDN in the critical path, no self-hosting, no offline/self-contained builds,
and the style inventory must be confirmed in the UI (see §2.2).

### Option C — Buy a Monotype Webfont licence (client or you)
The purpose-built self-hosting licence for exactly this. Requires a quote for the pageview tier; desktop
anchors are ~$27–43 per style and ~$200–330 per family pack, and webfont tiers are annual and priced by
monthly pageviews. Expect a Monotype Fonts enterprise quote if the app is SaaS rather than a site.

### Option D — Ship the OFL substitutes (fastest, zero licensing risk, no client dependency)
- **Display/accent (Cooper role): `Cooper*` Black** (OFL-1.1, self-hosted) — a genuine, historically
  researched Cooper revival with a Black weight and prebuilt woff2. This is unusually good for an open
  substitute and is the closest thing to "Cooper Black without a licence".
- **Sans/display (Avant Garde role): `TeX Gyre Adventor`** (GUST/LPPL, self-hosted) — the metric-compatible
  URW clone, i.e. the *actual* Avant Garde design lineage. Fall back to **Jost** or **Poppins** (OFL, Google
  Fonts) if you cannot self-host or need weights/coverage Adventor lacks.
- Prefer **Fraunces** (OFL, Google Fonts) over Cooper\* only if you want a Google-Fonts-hosted, zero-asset
  option for the Cooper role.

Keep Inter (or another OFL UI sans) for body/UI text regardless of which option you choose — both requested
faces are display faces, and Avant Garde Gothic in particular is poor at small text sizes.

---

## 5. Sources of the "free download" kind — avoid

- **Do not use any "free ITC Avant Garde Gothic / Cooper BT download" aggregator.** Both are live commercial
  products; anything offered as a free download of these exact names is an unauthorised copy.
- **hipfonts.com** surfaced in search as *"FREE ITC Avant Garde Gothic Font"*. Its own article then tells you
  to buy from MyFonts or activate on Adobe Fonts, and its tag list is pure SEO stuffing. It is **not a
  licensing authority** — do not rely on it for legal guidance. (https://hipfonts.com/avant-garde-font/)
- Search results also surfaced what appear to be **unauthorised redistributors** of the commercial Monotype
  font, e.g. **zijia.com.cn** and **fontke.com** offering ITC Avant Garde Gothic family packages, and a
  misconfigured public directory on a third-party corporate FTP. Treat all of these as off-limits.
- The well-known "free fonts" aggregator pattern (sites whose entire model is hosting commercial foundry
  files behind a download button) should be treated as piracy regardless of the disclaimer text on the page.
- **font-converters.com** — a TTF→WOFF2 converter whose "Adobe Font Export" page invites ToS violations by
  its framing, although the page text itself correctly states Adobe Fonts cannot be extracted. It is not a
  font source; do not use it to "liberate" Adobe Fonts files.

---

## 6. Things I could NOT verify (do not treat as settled)

1. **Exact per-style inventory of both families on Adobe Fonts.** The pages render styles client-side; Adobe's
   JSON/API endpoints returned 404/500 unauthenticated. Family names and foundry attributions *are* verified.
2. **Exact Monotype/MyFonts webfont pageview-tier prices.** Tiers are quoted at cart/checkout and require a
   session; the pricing *model* and the desktop price anchors are verified.
3. **Current Adobe Creative Cloud / Adobe Fonts Pro monthly price.** adobe.com timed out on repeated attempts.
4. **Monotype Fonts subscription pricing.** No public pricing; sales contact only.
5. **Cooper\* glyph coverage against a specific copy deck.** The family and its Black weight are confirmed
   present and downloadable; the author notes some non-Cooper symbols were added by him. Spot-check your
   actual characters (accents, currency, punctuation) before committing.
6. **Whether Cooper\* is trademark-clear to distribute under that name in every jurisdiction.** It is OFL
   with no Reserved Font Name declared in the copyright line (the OFL text includes the standard RFN clause
   but no names are listed after the copyright statement). I am not a lawyer; if the brand matters, get
   counsel to review. Note the project itself renamed Jost from "Renner\*" over IP concerns.
