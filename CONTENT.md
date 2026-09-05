# AllOne — Content spec

Editorial source of truth for every page except `index.html`.

**Full body copy lives in the `.html` files** (already written and deployed). This document holds the framework behind it: positioning, voice rules, the fact inventory that constrains what may be claimed, per-page section maps, and the register of placeholders still waiting on real data. Use it when writing new pages or editing existing ones so the site keeps one voice.

Language: Vietnamese (`lang="vi"`) throughout.

---

## 1. Positioning

**AllOne is an ecosystem of three products (CRM, Omni, LMS) that share one customer record, with AI that proposes and humans who approve.**

Not "a CRM". CRM is one of three products. The brand string in body copy is `AllOne CRM` when referring to the CRM product, `AllOne` when referring to the platform/company.

### The central problem narrative

Both real customers arrived through the identical chain. It is specific, locally true, and ownable, so it anchors the whole site:

1. **Mỗi bộ phận một bảng tính** — each department keeps its own Google Sheet. No file is wrong; no two files agree.
2. **Đối chiếu trở thành một việc làm** — someone must reconcile them weekly. Companies hire part-time/outsourced staff *just for this*.
3. **Người giỏi làm việc hành chính** — permanent staff absorb repetitive admin on top of their real job.
4. **Người nghỉ, dữ liệu đi theo** — turnover rises, and customer history leaves with the person who held it.

The sharpest one-line form, used as the CRM page's problem H2:
> **Bạn không thiếu người. Bạn đang trả lương cho việc đối chiếu bảng tính.**

### Four differentiators (all defensible from existing product truth)

| Claim | Why it's credible |
|---|---|
| One data source across CRM/Omni/LMS | Architectural, stated consistently across every product page |
| AI đề xuất, con người phê duyệt | Automation off by default, audit logs, independent verification layer for high-risk actions |
| AI answers only from your real data | No generation beyond real Lead/Contact records; Omni's AI is script-only |
| Honest scope and roadmap | Omni ships an explicit "đang chạy / đang triển khai" table; every product page has a scope boundary section |

---

## 2. Voice rules

1. **Name the painful state first, then the fix.** Five words of the reader's current reality beats any adjective.
2. **Two-sentence paragraphs.** Sentence 1 = mechanism. Sentence 2 = payoff.
3. **Every bullet starts with a verb.** No noun-only feature labels.
4. **Concrete artifacts, not abstractions.** "Google Sheet", "Zalo OA", "điểm danh từng buổi", "công nợ khách sạn" — never "giải pháp toàn diện".
5. **Second person, active voice, present tense.**
6. **Say what the product does NOT do.** Every product page carries a scope table. This is the site's strongest credibility asset.
7. **No superlatives, no invented numbers, no fabricated quotes.**
8. **No em dashes or en dashes anywhere.** Site-wide rule. Use periods, commas, colons. Number ranges and compound words take a plain hyphen (`1-10`, `kéo-thả`).
9. **CTA pairs repeat down the page**: one primary (self-serve) + one secondary (talk to sales).

---

## 3. Fact inventory

### Safe to claim (already true on the site)

- Three products: CRM, Omni, LMS, sharing one customer record.
- **Omni** runs Facebook Messenger + Zalo OA today. TikTok Business is pending platform API approval. AI replies from team-authored scripts only, hands off to a human when no script matches, full audit log.
- **LMS** covers courses, timetable, attendance, assignments, online classes, materials, notifications, role permissions.
- **CRM** covers Lead/Contact, pipeline, email campaigns, calls, meetings, permissions, dashboards; AI layer split Insight / Analyze / Prediction.
- **Integration partners** (already on the homepage as "Đối tác tích hợp chính thức"): Zoom, Advance Vision Technology, BussCall, VoIP24h.
- **Customers**: Liam Education (CRM + LMS), AZTravel (CRM). Qualitative outcomes only.
- Pricing is quote-based across all three tiers; deployment is phased.

### Must NOT be claimed without the user supplying it

- Any metric, percentage, count of customers/users, revenue or time saved.
- Customer quotes or named individuals.
- Trial duration, response-time SLA, contract minimums, refund policy.
- Founding dates, headcount, funding.
- Certifications, security/compliance standards, uptime.

### Assumptions written into the copy — confirm or correct these

| Page | Statement | Status |
|---|---|---|
| `bang-gia` | Implementation and training appear as separate line items in the quote | Assumed |
| `bang-gia` | Omni and LMS are priced separately and can be added to any tier | Assumed |
| `free-trial` | No payment details required to start a trial | Assumed |
| `free-trial` | Trial is guided: team configures the account before the customer logs in | Inferred from existing copy |
| `crm`, `lms` | Existing Excel/Sheets data is imported during setup, dedup included | Assumed |
| `crm` | Training is included in the deployment process | Inferred from homepage claim |

---

## 4. Page map

Every page ends with a `.section-cta-banner` closing CTA. Every product page carries a scope table and an FAQ.

### `crm.html` — flagship product page (~2,000 words)
1. **Hero** — "Quản lý khách hàng trên một nguồn dữ liệu duy nhất"
2. **Problem** — the four-step chain as `.step-strip`, closing on a `.callout-box` that names the fix
3. **Capabilities** — 5 tabs: Quản lý khách hàng / Đội ngũ bán hàng / Tiếp thị tự động / Giao tiếp đa kênh / Vận hành và phân quyền
4. **AI layer** — Insight / Analyze / Prediction + the "AI đề xuất, con người phê duyệt" principle box
5. **Integrations** — Zoom, VoIP24h, BussCall, cross-product links
6. **Customization + phased deployment** — 4-step process strip
7. **Proof** — two case study cards
8. **Scope table** — what belongs to CRM vs Omni vs LMS vs partners
9. **FAQ** — 6 objections: data migration, timeline, non-technical teams, buying all three, AI autonomy, cost

### `omni.html` — early-access product (~950 words)
Hero (labelled "Early Access", not apologised for) → problem (multi-tab channel juggling) → 6 capabilities → 2 role tabs → **status table** (đang chạy / đang triển khai, per capability) → FAQ → CTA.
The status table is this page's credibility engine. Keep it accurate and visible.

### `lms.html` — product page (~1,100 words)
Hero → problem ("Lớp học chạy trên trí nhớ của người điều phối") → 7 capabilities → 3 role tabs (Học viên / Giảng viên / Quản trị đào tạo) → scope table → Liam Education proof card → FAQ → CTA.

### `bang-gia.html` — quote-based pricing (~1,250 words)
1. **Hero** — reframes the missing price as scope-based quoting
2. **"Bốn yếu tố quyết định con số cuối cùng"** — số sản phẩm, số người dùng, mức tùy chỉnh, tích hợp. *This section is what stops "Liên hệ tư vấn" reading as evasion.*
3. **Three tiers** — each with a who-it's-for line, `Liên hệ tư vấn` in the price slot, cumulative feature lists
4. **12-row comparison table** — the substitute for a number; lets buyers self-qualify
5. **Included in every plan**
6. **FAQ** — 6, opening with "Vì sao không niêm yết giá cụ thể?"
7. **CTA** with three-bullet promise

### `case-study-liam-education.html` (~950 words) and `case-study-aztravel.html` (~850 words)
Same skeleton: Hero with `H1 = "Cách <Customer> <verb phrase>"` + `.case-meta` fact rail → Bối cảnh (customer's own story first) → Thách thức (names Google Spreadsheet explicitly, ends in a business consequence) → Giải pháp triển khai → Vận hành sau triển khai (a day in the life) → Kết quả (3 qualitative outcomes) → Áp dụng chung (5 generalised benefits, shared across both) → cross-link to the other case study → CTA.

No metrics and no quotes anywhere, by design — the fact rail and operational specificity carry credibility instead. See §5 for where to add them later.

### `lien-he.html` (~405 words)
Hero + "Sau khi bạn gửi form" three-step expectation list + form (unchanged fields) + 4-item FAQ that removes reasons not to send.

### `dang-ky.html` (~230 words)
Hero + "Ba bước tiếp theo" + form (unchanged fields). Deliberately the shortest page on the site: nothing should distract from the form.

### `free-trial.html` (~560 words)
Hero → 3 things you can verify → 4-step how-it-works → callout explaining *why* the trial is guided rather than instant self-serve → FAQ → CTA.

### `tai-nguyen.html` (~300 words)
Honest empty state: says plainly that nothing is published yet and refuses to pad, then routes to the four destinations that do answer questions, then lists what is coming and why in that order.

> **Recommendation:** Stripe, Attio and Notion have no `/resources` page at all — "Resources" is a nav dropdown pointing at things that already exist. Consider dropping this page from the nav until the library is real, and pointing the nav item at the case studies instead.

### `404.html` (~100 words)
One line of orientation, two CTAs, then four cards to the most-wanted destinations.

---

## 5. Placeholder register

Slots designed into the layout, waiting on real data. Each is currently absent rather than faked.

| # | Placement | Needs |
|---|---|---|
| 1 | Under every product hero | Social-proof strip: customer count, logos, or a single named stat |
| 2 | Case study heroes | 2-3 metric callouts (e.g. "X giờ mỗi tuần cắt được") |
| 3 | Inside case study Kết quả sections | A named quote with full name + job title |
| 4 | CRM capabilities sections | Real product screenshots per capability (only 3 exist today) |
| 5 | `bang-gia` between table and FAQ | Trust bar: logos or "Đang phục vụ N doanh nghiệp" |
| 6 | `lien-he` next to the form | Concrete response-time promise ("phản hồi trong 1 ngày làm việc") |
| 7 | `free-trial` FAQ | Trial duration |
| 8 | Product pages | Security/compliance reassurance once there is something certifiable to say |

Items 1, 2 and 3 are the highest leverage: every benchmark page leans on quantified proof, and their absence is the single largest remaining gap versus Stripe/Linear/Attio.
