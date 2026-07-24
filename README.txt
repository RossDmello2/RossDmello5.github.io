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

=====================================================================
V3.0 - VERIFIED SYSTEMS (July 2026)
=====================================================================

The portfolio is now composed around one continuous evidence pipeline:
validate, retrieve, execute, persist, and observe. Unsupported input routes
to manual review. The same visual logic connects the hero, engineering
philosophy, HPCL experience, and flagship project.

ADDITIONAL FILES
  DESIGN_DIRECTION_PACK.md
                      audited direction, responsive rhythm, motion ownership,
                      prompt ledger, accessibility plan, and acceptance tests
  css/v3.css          final editorial composition and responsive overrides
  design/reference-frames/
                      approved desktop hero, project chapter, and mobile
                      design targets generated before implementation
  design/final-screenshots/
                      verified hero, evidence narrative, authored project
                      composition, and 390 by 844 mobile handoff captures

V3 BEHAVIOR
  - Project 01 is the flagship case study. VoiceRAG and VisoRAG form a paired
    chapter, n8n is a wide workflow chapter, and the two local-first systems
    form the final pair. The reserved Project 07 slot remains.
  - Native scrolling and all original section anchors are preserved.
  - One packet motion sequence is the primary scroll spectacle. Important hero,
    chapter, HPCL, project, skills, achievement, and contact titles share one
    queued Vapour Text language. Exactly one rendered title line dissolves and
    reforms at a time, without an underlying skeleton or terminal-letter
    handoff. Visible diagram wires flow continuously, and fine-pointer diagram
    cards track the cursor with direct 3D tilt. All systems pause or flatten
    when appropriate.
  - Coarse pointers and narrow screens use a static or lightly animated
    composition. Reduced motion removes the animated grain, hero canvas,
    packet travel, and smooth scrolling while keeping the full narrative.
  - The mobile menu now has one synchronized class, aria-hidden, inert, Escape
    close, and first-link focus. The command palette traps focus and restores
    it to a stable trigger after close.

RUN AND VERIFY
  python -m http.server 8765 --bind 127.0.0.1
  Open http://127.0.0.1:8765/

There is still no build step and no application dependency.
