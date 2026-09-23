# Media to record: feedback round 3 (SỬA WEB LẦN 3, 23/09)

These are the items from the sheet that need real footage from the AllOne product.
Everything else in the sheet is already built. Each section below has a working
stand-in today (an illustrated mock or a real screenshot with a spotlight), so the
site is shippable before any video exists. Swapping in the video is a markup edit
on one block; no CSS or JS change is needed.

Row numbers refer to the rows of `SỬA WEB LẦN 3.xlsx`.

---

## How the highlight engine works (read once)

Every "highlight what we are talking about" section is driven by `js/showcase.js`:

- `data-hl-root` marks one showcase.
- Each legend row is a `data-hl-point="key"` (the numbered buttons on the left).
- Whatever lights up for it carries `data-hl-target="key"`.
- **Without a video**, the points cycle on a timer while the section is on screen.
- **With a video**: put `data-hl-video` on the `<video>` and give each point a
  `data-t="seconds"` attribute. The engine then follows the video: whichever point's
  `data-t` was passed most recently is highlighted, and clicking a point seeks the
  video to that second. You only need the start time of each segment.

So recording a video = one continuous take that walks through the points in the
same order as the legend, plus a note of the second each segment starts.

## Recording and export rules (all videos)

| | |
|---|---|
| Account | A demo tenant with demo data only (no real customer names, phones, emails). The existing screenshots use "Nguyễn Thảo", "Nhóm Sale A", etc. Reuse that dataset so the numbers match the rest of the site. |
| Browser | Chrome at 100% zoom, window 1600 × 800 content area (2:1). Hide bookmarks bar and extensions. |
| Theme | App in light theme, same as the screenshots in `img/products/`. |
| Pace | Move the cursor slowly; pause about 1 s on each thing being shown. No typing typos (paste text if needed). |
| Length | 20 to 40 s per video, muted, seamless loop (end on the same screen you start on). |
| Export | MP4 H.264, 1600 px wide, 30 fps, no audio, under 4 MB. |
| Poster | A JPG of the first frame, same size. It is shown before the video loads and on "reduce motion". |
| Files | Put them in a new `/media/` folder at the repo root, e.g. `media/crm-cau-hinh.mp4` + `media/crm-cau-hinh.jpg`. |

Export commands (ffmpeg):

```bash
ffmpeg -i raw.mov -vf "scale=1600:-2,fps=30" -c:v libx264 -crf 26 -preset slow -an -movflags +faststart media/NAME.mp4
ffmpeg -ss 0.5 -i media/NAME.mp4 -frames:v 1 -q:v 3 media/NAME.jpg
```

Hosting: self-host only. The site CSP is `default-src 'self'`, so YouTube or Vimeo
iframes are blocked. Local `<video>` files are allowed as they are.

Standard video tag used in every snippet below:

```html
<video data-hl-video src="/media/NAME.mp4" poster="/media/NAME.jpg"
       width="1600" height="800" muted autoplay loop playsinline preload="metadata"></video>
```

---

## V1. CRM, "Cá nhân hóa và triển khai" (row 7): **most important**

**Where:** `crm.html`, section `#ca-nhan-hoa`, the block with the 6 numbered points and
the screenshot frame on the right.

**Today:** four real screenshots (Security, Lead profile, Sale Teams, Meet) with a
spotlight box that moves to the part matching each point.

**Record one take, 6 segments, in this order:**

| # | Point on the page | What to show on screen | Note the start second |
|---|---|---|---|
| 1 | Tùy chỉnh module, trường dữ liệu, biểu mẫu | Management → Data Customization: open a module, add a field (e.g. "Nguồn giới thiệu"), save, show it on the Lead form | `t1` (0) |
| 2 | Workflow và quy trình phê duyệt | Open a Lead, move its status along the pipeline (In Leads → In Appointment → Already Paid) | `t2` |
| 3 | Phân quyền theo cơ cấu tổ chức | Management → Security: click the "Sales" group, tick and untick a few permissions, show Members tab | `t3` |
| 4 | Dashboard và KPI | Sales → Sale Teams: the KPI cards and the member KPI table | `t4` |
| 5 | Tích hợp email, tổng đài, lịch | On a Lead: Email tab, then Meet tab → "Tạo link" → "Ghi nhận lịch Meet" | `t5` |
| 6 | Mở rộng theo giai đoạn | Sidebar: expand Sales, Commerce, Marketing, Management to show modules turned on per group | `t6` |

**Swap in:** replace the whole `<div class="hl-screens"> … </div>` block with:

```html
<div class="hl-screens">
  <div class="hl-screen">
    <video data-hl-video src="/media/crm-cau-hinh.mp4" poster="/media/crm-cau-hinh.jpg"
           width="1600" height="800" muted autoplay loop playsinline preload="metadata"></video>
  </div>
</div>
```

and add the start seconds to the 6 buttons above it, for example:

```html
<button type="button" class="hl-point" data-hl-point="c1" data-t="0"> …
<button type="button" class="hl-point" data-hl-point="c2" data-t="6"> …
<button type="button" class="hl-point" data-hl-point="c3" data-t="12"> …
```

Remove the `data-screen="…"` attributes from those buttons (they only switch
screenshots). Update the caption under the frame to
`Quay màn hình AllOne. Ý bên trái sáng lên theo đúng đoạn đang chạy.`

---

## V2. Omni hero (row 11, and row 12 folded in)

**Where:** `omni.html`, hero, right column (`.sh-wrap`).

**Today:** an illustrated inbox (`.mock-frame`) with the channel chips and one
floating callout. Labelled "Giao diện minh hoạ".

**Record (15 to 25 s, loop), or take one screenshot if a video is too much:**
the Omni inbox during a shift. A Messenger message arrives, then a Zalo OA message
arrives in the same list; the AI answers one of them from a script (the audit line
visible); a third message falls outside the script and shows "Cần người xử lý" /
handoff to a staff member. Channel badges (Messenger, Zalo OA) must be visible.

**Swap in:** replace the `<div class="mock-frame"> … </div>` inside `.sh-wrap` with:

```html
<div class="sh-frame">
  <div class="hl-bar" aria-hidden="true"><i></i><i></i><i></i></div>
  <video src="/media/omni-hop-thu.mp4" poster="/media/omni-hop-thu.jpg"
         width="1600" height="800" muted autoplay loop playsinline preload="metadata"></video>
</div>
```

(For a screenshot use `<img src="/img/products/omni-hop-thu.jpg" …>` instead of the
video.) Keep the `.sh-stats` callout below it; update its numbers to what the footage
shows. The note under it can then drop the channel list.

---

## V3. Omni "Theo vai trò" (row 14): 2 videos

**Where:** `omni.html`, tabs "Nhân viên trực" (`data-panel="o1"`) and
"Quản trị viên" (`data-panel="o2"`).

**Today:** an illustrated screen per role; the numbered part lights up with each point.

**V3a. Nhân viên trực, 4 segments:**

| # | Point | Show |
|---|---|---|
| 1 | Messenger và Zalo OA trong cùng một danh sách | Scroll the unified conversation list, channel badges visible |
| 2 | Phân biệt AI đã trả lời / cần người xử lý | Filter or point at the status pills |
| 3 | Tiếp nhận hội thoại AI chuyển sang, không mất ngữ cảnh | Open a handed-off conversation; the AI summary and earlier messages are visible |
| 4 | Trả lời trực tiếp trong Omni | Type and send a reply from the Omni composer |

**V3b. Quản trị viên, 4 segments:**

| # | Point | Show |
|---|---|---|
| 1 | Kết nối và quản lý tài khoản từng kênh | Channel settings: connected Messenger and Zalo OA, TikTok pending |
| 2 | Viết và chỉnh sửa kịch bản trả lời tự động | Open a script (e.g. KB-04 Bảng giá), edit the trigger and the answer, save |
| 3 | Rà soát nhật ký kiểm toán | Audit log: open one AI reply and its matched script |
| 4 | Theo dõi trạng thái kênh, xử lý khi gián đoạn | Channel status screen, reconnect a channel |

**Swap in (per tab):** replace that tab's `<div class="mock-frame"> … </div>` with:

```html
<div class="hl-frame">
  <div class="hl-bar" aria-hidden="true"><i></i><i></i><i></i><span>Omni · Ca trực</span></div>
  <video data-hl-video src="/media/omni-nhan-vien.mp4" poster="/media/omni-nhan-vien.jpg"
         width="1600" height="800" muted autoplay loop playsinline preload="metadata"></video>
</div>
```

and add `data-t="…"` to the 4 `.hl-point` buttons of that tab. Use
`omni-quan-tri.mp4` for the admin tab.

---

## V4. LMS "Theo vai trò" (row 20): 3 videos

**Where:** `lms.html`, tabs `data-panel="p1"` (Học viên), `p2` (Giảng viên),
`p3` (Quản trị đào tạo). Same structure and swap as V3.

| Video | Segment 1 | Segment 2 | Segment 3 | Segment 4 |
|---|---|---|---|---|
| `lms-hoc-vien.mp4` | Today's class + course progress | Session materials | Reminder / deadline notification | Submit an assignment, see the grade and teacher feedback |
| `lms-giang-vien.mp4` | Take attendance in a session | Grade a submission and leave feedback | Upload material for the next session | Start the Zoom class from the schedule |
| `lms-quan-tri.mp4` | Courses, classes, teachers overview | Attendance / progress per class | Roles and permissions (admin, teacher, student) | Move a session; the notification goes out |

---

## V5. Thư viện tài liệu hero (row 43): screenshot, needs real figures

**Where:** `tai-nguyen.html`, the `.page-hero` at the top.

**Today:** the eyebrow is highlighted and the text is centred; there is no media yet.
The sheet suggests a revenue or performance board of Liam Education or AZTravel.
Figures on the site must be real, so this needs **a screenshot from their actual
tenant, with written permission from the client**, and names blurred except
the company name.

**Swap in:** turn the hero into two columns:

```html
<section class="page-hero">
  <div class="container hero-split-grid" style="max-width: var(--container)">
    <div>
      <p class="eyebrow">Tài nguyên</p>
      <h1>Case study và <span class="text-highlight">thư viện tài liệu</span></h1>
      <p>…</p>
    </div>
    <div class="sh-frame">
      <div class="hl-bar" aria-hidden="true"><i></i><i></i><i></i></div>
      <img src="/img/products/liam-hieu-suat.jpg" width="1600" height="800" alt="…" loading="lazy">
    </div>
  </div>
</section>
```

and remove `is-centered` from the section (the centred text only makes sense
without media).

---

## Optional

These already look finished; footage would only upgrade them.

- **Closing call to action, "cách 2" (rows 10, 16, 23, 40, 42, 47).** The sheet preferred a
  brand media behind the CTA but noted nothing suitable was found. "Cách 1" (Cogover
  layout) is live. If a loop is made (abstract product motion, 8 to 12 s, dark, no text),
  add it as the first child of `.cta-panel`:
  `<video class="cta-bg" src="/media/cta-loop.mp4" muted autoplay loop playsinline aria-hidden="true"></video>`
  plus this CSS in `styles.css` / `home.css` (bump `?v=`):
  `.cta-panel { position: relative; overflow: hidden; isolation: isolate; }`
  `.cta-bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .28; z-index: -1; }`
- **CRM hero (row 4).** The real Sale Teams screenshot with callouts is live. A 10 s loop of
  the same screen (switching the period filter, KPI bars filling) can replace the `<img>`
  in `.sh-frame` one to one.
- **Đăng ký "Cách hoạt động" (row 52).** The 3D step stack is live. A short screen recording
  of the first login into a pre-built trial account could sit under it in `.signup-media`.

---

## Checklist

- [ ] V1 CRM configuration walk-through (6 segments + timestamps)
- [ ] V2 Omni hero loop or screenshot
- [ ] V3a Omni agent (4 segments), V3b Omni admin (4 segments)
- [ ] V4 LMS student, teacher, admin (4 segments each)
- [ ] V5 Liam or AZTravel performance screenshot, with client permission
- [ ] After swapping: bump nothing in CSS/JS (no change there); the HTML pages are not cached
