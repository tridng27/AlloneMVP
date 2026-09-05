# Design brief — AllOne subpages

Hand this to the UI design agent. Content is finished and frozen; this brief covers visual design only.

---

## The task

Redesign the visual layout of every page except `index.html` in the AllOne marketing site. The Vietnamese copy has just been rewritten to benchmark standard and is **final** — do not rewrite, shorten, or reorder it. Your job is to make the pages look as considered as the words.

`index.html` is the design reference and must not be modified. Every other page should feel like it belongs to the same product as the homepage.

---

## Repo facts you must respect

- **Static site. No build step, no package manager, no framework.** Plain HTML/CSS/JS, every page a standalone `.html` at the repo root.
- **Two separate front-end systems.** `index.html` uses `js/home.js` with its own nav markup (`#siteHeader`, `.nav-trigger`, `.nav-menu`, `.is-open`). Every other page uses `js/main.js` with different markup (`#site-header`, `.nav-dropdown-toggle`, `.nav-dropdown`, `.nav-open`). A fix in one does not apply to the other. See `CLAUDE.md`.
- **Shared stylesheet is `css/styles.css`**, already carrying a dark-default / light-opt-in token system ported from `index.html`: `--bg`, `--bg-elev`, `--bg-subtle`, `--text`, `--text-secondary`, `--text-faint`, `--border`, `--border-strong`, `--accent`, `--accent-ai`, `--radius-*`, `--shadow-*`. Light mode is `:root[data-theme="light"]`. **Use tokens; never hardcode a colour** except white text on the accent-coloured CTA banner.
- **Cache busting:** every edit to `css/styles.css` or `js/main.js` requires bumping `?v=N` on every page that references it. Currently `styles.css?v=8`, `main.js?v=5`, `home.js?v=3`.
- **Routing is defined twice** and must stay in sync: `render.yaml` and `nginx/default.conf`. Adding a page means editing both.
- **Never reintroduce em dashes or en dashes.** Site-wide editorial rule.
- **Do not touch form internals.** `lien-he.html` and `dang-ky.html` post to Web3Forms via `js/main.js`. Field `name` attributes, `id="contactForm"`, `id="formSuccess"`, `id="formError"` and the `hp_website` honeypot must survive unchanged. Style them freely.
- **`CLAUDE.md` requires an Artifact preview** of any visual change, approved by the user, before editing the real files.
- Local preview: `docker-compose up` serves on `127.0.0.1:3001`.
- Available imagery is thin: `img/logo-icon.png`, three product screenshots in `img/products/`, four partner logos in `img/partners/`. There is no illustration library and no budget assumption for one.

---

## How these pages compare to the benchmark

Benchmarked against Stripe, Linear, Attio, Notion, HubSpot, Intercom, Vanta, Gong and Asana. The **copy** now matches those standards. The **design** does not, in six specific ways:

1. **No product imagery inside feature sections.** Stripe and Linear alternate a text block with a captioned screenshot of real UI showing real data, for every capability. AllOne's product pages are text-in-cards from top to bottom. This is the single biggest visual gap.
2. **Uniform section rhythm.** Every section is the same `.section` → `.section-head` → grid sandwich at the same vertical padding and the same container width. Benchmark pages vary density deliberately: full-bleed bands, offset two-column splits, and tight stat strips break up the reading.
3. **Flat hierarchy between card types.** `.bento-card`, `.outcome-card`, `.module-card` and the FAQ cards all read at roughly equal weight, so nothing signals what matters most. Border, fill, radius and shadow should be spent by role, not stamped uniformly.
4. **No social-proof surface anywhere.** Every benchmark page puts a logo strip or a stat directly under the hero. AllOne has four real integration-partner logos already sitting unused on subpages.
5. **Tables are unstyled defaults.** The new pricing comparison table (12 rows × 4 columns) and the Omni status table are load-bearing content rendered in a plain bordered table.
6. **FAQ is rendered as generic cards.** Six equal boxes of text; benchmarks use a compact accordion so the questions can be scanned in one screen.

---

## Components to design

### New

| Component | Used on | Notes |
|---|---|---|
| **Status pill** | `omni.html` status table | Two states: "Đang chạy" (positive) and "Đang triển khai" (pending). Semantic colour, separate from the brand accent. |
| **Comparison table** | `bang-gia.html` | 12 rows × 4 columns. Needs a sticky header row, a visual distinction between boolean cells ("Có"/"Không") and descriptive cells, an emphasised "Business" column to match the featured plan card, and a real mobile strategy (horizontal scroll with a pinned first column, or per-plan stacking). |
| **FAQ accordion** | 6 pages | Currently `.bento-grid` + `.bento-card`. Should collapse to question-only rows, expanding one at a time. Keyboard accessible, first item may open by default. |
| **Case study fact rail** | both case studies | `.case-meta` / `.case-meta-item` exist but are visually plain. Should read as a credential block. |
| **Metric callout** | both case studies | Not yet in the markup — design the slot now so numbers can drop in later. See placeholders below. |
| **Pull quote** | both case studies | Same: design the component, leave it out of the page until a real quote exists. |
| **Social-proof strip** | under every product hero | Partner logos exist and already have light/dark variants (`logo-light` / `logo-dark` pattern in `index.html`). |
| **Captioned screenshot block** | product pages | Text + real UI image + caption. The pattern the pages most need. |

### Existing, restyle rather than replace

`.page-hero` · `.section-head` · `.step-strip` · `.tabs` / `.tab-panel` · `.bento-grid` · `.check-list` · `.principle-box` (and `.is-ai`) · `.callout-box` · `.outcomes-grid` · `.module-card` · `.pricing-grid` / `.price-card` · `.contact-grid` / `.contact-form` · `.section-cta-banner` · `.table-wrap` / `.example-table`

---

## Page-by-page

| Page | Words | Design priority |
|---|---|---|
| `crm.html` | ~2,000 | Longest page on the site. Needs the most rhythm work: 9 sections currently at identical density. The 4-step problem strip and the AI Insight/Analyze/Prediction strip use the same `.step-strip` component back to back and must be visually differentiated. |
| `bang-gia.html` | ~1,250 | The comparison table is the page. Also: the "four pricing factors" grid is the section that stops quote-based pricing reading as evasive, so it deserves more weight than a plain 4-card row. |
| `lms.html` | ~1,100 | 7-card capability grid needs a considered asymmetric layout, not 7 equal boxes. |
| `case-study-liam-education.html` | ~950 | Fact rail, `.case-body-grid` two-column narrative, and slots for metrics and a quote. |
| `omni.html` | ~950 | Status table with pills; "Early Access" should read as a deliberate maturity label, not a warning. |
| `case-study-aztravel.html` | ~850 | Same system as the other case study. Must look like a series. |
| `free-trial.html` | ~560 | 4-step process strip is the centrepiece. |
| `lien-he.html` | ~405 | Two-column form layout. The "what happens next" list beside the form is the conversion lever. |
| `tai-nguyen.html` | ~300 | Honest empty state. Should look intentional, not unfinished. |
| `dang-ky.html` | ~230 | Shortest by design. Nothing should compete with the form. |
| `404.html` | ~100 | Four destination cards. |

---

## Placeholder slots to design for

These have no real data yet, so **design the container and leave it out of the live page** until the user supplies content. Do not fill them with invented numbers, fake logos, or lorem quotes.

1. Social-proof strip under each product hero — customer count, logos, or one named stat
2. Metric callouts in case study heroes — 2 to 3 figures
3. Named pull quote inside case study results — full name + job title
4. Per-capability product screenshots on `crm.html` (only three images exist today)
5. Trust bar on `bang-gia.html` between the comparison table and the FAQ
6. Response-time promise beside the `lien-he.html` form
7. Trial duration in the `free-trial.html` FAQ

---

## Definition of done

- Every page renders correctly in **both** dark and light themes, with the toggle persisting across navigation.
- Both nav dropdowns open, close each other, and work on touch, mouse and keyboard.
- No horizontal page scroll at any width; wide tables scroll inside their own container.
- Forms submit and show success/error states.
- Copy is unchanged, no em/en dashes introduced, `?v=N` bumped wherever shared CSS/JS changed.
- An Artifact preview was approved before the real files were edited.
