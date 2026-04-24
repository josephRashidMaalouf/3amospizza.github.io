# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static website for a fictional Swedish pizza restaurant called **3amos pizza**, hosted on GitHub Pages. No build tools, package manager, or test framework — all files are served directly.

## Running Locally

Serve the root directory with any static file server, e.g.:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Or open any `.html` file directly in a browser. Note that `weather.js` uses `fetch()` and requires a server (not `file://`) due to CORS.

## Architecture

### Pages and Their Scripts/Styles

| Page | Script | Page-specific CSS |
|------|--------|-------------------|
| `index.html` | `scripts/weather.js` | `styles/home-page-style.css` |
| `order.html` | `scripts/shop.js` | `styles/order-page-style.css` |
| `about.html` | — | `styles/about-page-styles.css` |

`styles/general.css` is shared across all pages (nav, footer, body background, typography).

### shop.js — Menu and Cart

All menu items are declared in the `plates` array at the top of `scripts/shop.js`. Each item has `name`, `price`, `picURL`, `modalTag`, and `description`. Adding a new menu item means adding an object to that array — the rest (card DOM, modal DOM, cart logic) is generated dynamically from it.

Bootstrap's offcanvas component serves as the cart sidebar; Bootstrap modals show item detail popups. Cart state lives in the module-level `cart` array and is not persisted.

### weather.js — Contextual Promotion

Fetches current weather for Göteborg (lat 57.7072, lon 11.9668) from the open-meteo.com API and renders a promotional message into `#weatherMessage` on the home page. The message varies based on temperature, rain, cloud cover, and whether it's day or night.

## Conventions

### Language
All UI text is in **Swedish**. Keep new user-facing strings in Swedish.

### Styling
- Bootstrap 5.3.2 is loaded from CDN; use its utility classes and components before writing custom CSS.
- The color palette is documented in `styles/colors.txt`. Primary colors: Raisin Black `#312827` (background), Buff `#DAA68D` (text/nav links), Chestnut `#844836` (hover background).
- Custom CSS goes in the appropriate page stylesheet or `general.css` for shared rules.

### Images
Each image has both an original (`.jpg`/`.png`) and an optimized `.webp` version. Always reference `.webp` in HTML/JS; the originals are source files only.
