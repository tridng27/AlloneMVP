# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Preview before applying visual/UI changes

For any change that affects layout, styling, or visual behavior (HTML/CSS/JS edits to any page), publish an Artifact preview of the change first and let the user manually verify it before editing the actual repo files. Only apply the edits to the real `.html`/`css`/`js` files in this repo after the user confirms the preview looks right. Non-visual changes (e.g. `render.yaml`/`nginx` config, copy-only text fixes the user explicitly dictated) don't need this step.

## What this is

A static marketing site for AllOne (Vietnamese-language, `lang="vi"`) — plain HTML/CSS/JS, no build step, no package manager, no test suite. Every page is a standalone `.html` file at the repo root that shares `css/styles.css` and one of two JS bundles.

## Running locally

There's no dev server tooling (no npm scripts). Either:
- Open the `.html` files directly, or serve the repo root with any static file server.
- `docker-compose up` — builds the `Dockerfile` (nginx:alpine serving the repo root) and serves on `127.0.0.1:3001`.

There is no lint, test, or build command — validate changes by loading the page in a browser.

## Cache-busting versioning

`css/styles.css` and every `js/*.js` file are referenced with a `?v=N` query string in each HTML `<link>`/`<script>` tag (e.g. `/js/main.js?v=4`), because both nginx and Render cache `/css/*` and `/js/*` for a year as `immutable`. **Whenever you edit a shared CSS/JS file, bump the `?v=N` on every HTML page that references it**, or the change won't be visible to already-visited browsers.

## Routing is defined twice — keep in sync

Clean URLs (e.g. `/san-pham` instead of `/san-pham.html`) and security headers are configured in two places that must be kept in sync by hand:
- `render.yaml` — used by the Render static-site deployment (redirects `.html` → clean path, rewrites clean path → backing `.html` file, sets security headers).
- `nginx/default.conf` + `nginx/security-headers.conf` — used by the Docker/self-hosted deployment, mirrors the same redirect/rewrite/header rules.

Adding a new top-level page means adding entries in **both** places (the redirect regex list in `nginx/default.conf`, and the redirect/rewrite blocks in `render.yaml`).

## Two separate front-end JS systems

`index.html` (the homepage) was redesigned separately from the rest of the site and does **not** share the older pages' script:

- **`index.html`** loads `js/home.js` + `js/vendor/three.min.js` + `js/klein-bottle.js` (a parametric 3D Klein-bottle hero animation built on Three.js). It has its own light/dark theme toggle via `[data-theme]` on `<html>` (dark is the default with no attribute; the toggle persists to `localStorage` under key `allone-theme`) and its own nav markup/classes (`#siteHeader`, `.is-open`, `.nav-trigger`).
- **Every other page** (`san-pham`, `giai-phap`, `bang-gia`, `tai-nguyen`, `lien-he`, `free-trial`, `dang-ky`, `lms`, `omni`, `404`) loads `js/main.js` (+ `js/config.js` on pages with a lead form). These use different nav markup/classes (`#site-header`, `.nav-open`, `.nav-dropdown-toggle`) and have no theme toggle — they're single-theme.

Don't assume a fix in one JS file applies to both — nav/dropdown/reveal-on-scroll logic is duplicated with different selectors, not shared. If a nav or reveal-animation change should apply site-wide, it needs to be made in both `home.js` and `main.js`.

## Lead-capture forms

Forms on `dang-ky.html`, `lien-he.html`, `free-trial.html`, etc. post directly to Web3Forms (`https://api.web3forms.com/submit`) from `js/main.js` — there is no backend. The access key lives in `js/config.js` as `WEB3FORMS_ACCESS_KEY`; if it's empty, submissions are simulated (logged to console) instead of sent. Forms include a hidden honeypot field (`hp_website`) for basic bot filtering.

## Design tokens

All colors/spacing/radii are CSS custom properties defined once in `css/styles.css` under `:root` (e.g. `--accent`, `--bg-dark`, `--radius-md`) — reuse these rather than hardcoding values. `index.html` additionally overrides a subset under `:root[data-theme="light"]` for its light-mode variant.
