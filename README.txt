ROSS DMELLO — PORTFOLIO
=======================

Structure
---------
index.html        page structure + schema.org JSON-LD (machine-readable resume data)
css/styles.css    complete design system: tokens, light/dark themes, all animation
js/main.js        theme engine, scroll effects, reveals, counters, cursor, tilt,
                  command palette (Cmd/Ctrl+K or /), FAQ, toasts, konami easter egg
js/engines.js     three canvas engines: hero gradient mesh, pipeline packet
                  simulation, terminal log replay

Visual assets
----------------------------
The project architecture diagrams are hand-drawn SVG and the hero, pipeline,
and terminal visuals use live canvas. The portrait is the one local raster
asset; the remaining visuals re-color themselves when the theme changes.

Running it
----------
Open index.html in any modern browser — no build step, no server, no
dependencies. Works from a file:// URL. To deploy, upload the folder as-is
(GitHub Pages, Netlify, any static host).

Notes
-----
- Theme: auto-follows OS light/dark; the toggle persists your choice.
- All motion collapses to static equivalents under prefers-reduced-motion.
- Keyboard: Cmd/Ctrl+K or / opens the command palette; Tab reveals a skip link.

=====================================================================
V2.0 — CONTROL-ROOM / BLUEPRINT REDESIGN (July 2026)
=====================================================================

Dark-first redesign. Light "cool paper" theme remains via the toggle.

FILES
  index.html          structure + content (evidence tiers unchanged)
  css/styles.css      v1 foundation: layout, motion, responsive rules
  css/theme.css       token sheet override — obsidian blueprint palette,
                      Fraunces / Space Grotesk / JetBrains Mono, grid
                      canvas, component re-skins (nav, buttons, cursor
                      reticle, marquee, corner registration marks)
  css/blueprint.css   new components: brand sigil, hero HUD, portrait
                      module, flow packets, reserved project slot
  js/main.js          v1 engines: theme, reveals, cursor, tilt, palette
  js/engines.js       hero mesh · pipeline packet sim · terminal replay
  js/brand.js         animated favicon (orbiting dashed ring, sleeps
                      when tab hidden, static under reduced motion)
  js/flow.js          packets riding every project diagram wire
                      (IntersectionObserver-slept, reduced-motion off)
  assets/ross-portrait.png

NOTES
  - All engines read CSS custom properties at draw time; both themes
    recolor every canvas live.
  - The only external request is Google Fonts; the design degrades
    gracefully to Georgia / system stacks without it.
  - Project grid ends with a reserved 07 slot — future projects dock
    there without layout changes.
