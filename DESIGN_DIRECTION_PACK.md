# GPT Taste v3 Design Direction Pack

## Design Read

Design Read: a portfolio and personal-brand experience for technical recruiters, engineering leaders, and collaborators, aiming for fast credibility and memorable systems thinking, using cinematic editorial blueprint language with one scroll-authored evidence thread and quiet supporting motion.

## 1. Brief inference and target audience

### User goal

Transform Ross Dmello's portfolio into a premium, cinematic, editorial experience authored around one engineering belief: every claim should travel through an evidence pipeline.

### Audience

1. Technical recruiters who need to understand role fit, graduation status, availability, and proof within the first minute.
2. Engineering leaders who inspect architecture, reliability posture, and honesty boundaries.
3. Potential collaborators who want direct access to public repositories and contact channels.
4. Accessibility, performance, and frontend reviewers who may inspect the portfolio as an engineering artifact.

### Content and conversion priority

1. Establish Ross as a backend-minded AI engineer and GenAI developer.
2. Make the "refuse to guess" philosophy legible before spectacle.
3. Demonstrate how the philosophy appears in HPCL experience and public projects.
4. Preserve evidence tiers and public evidence boundaries.
5. Make project repositories and contact channels easy to reach.

### Existing assets and constraints

- Authentic 1254 by 1254 portrait.
- Six hand-authored SVG architecture diagrams.
- HPCL terminal replay with a meaningful static base state.
- Animated validation pipeline with a reduced-motion fallback.
- Dark and light themes.
- Command palette.
- Existing section anchors, repository links, contact links, FAQ, JSON-LD, and evidence-tier language.
- Hand-written HTML, CSS, and JavaScript with no build step and no runtime dependency.
- Google Fonts is the only external visual request.

### Reference qualities to adopt

- Editorial hierarchy that makes one idea dominant at a time.
- Obsidian blueprint atmosphere with cool-paper light mode.
- Ember-orange as the single brand accent.
- Serif display voice against monospaced evidence metadata.
- Architecture diagrams treated as proof.
- Carefully bounded cinematic pacing.

### Reference qualities to reject

- Generic Awwwards page structure.
- Sci-fi dashboard chrome.
- Fake operating-system windows.
- Card grids without hierarchy.
- Decorative WebGL, fake product evidence, gradient text, excessive pills, or repeated marquees.
- Motion that delays essential content or competes with the evidence thread.

## 2. One-sentence visual thesis

Verified Systems feels like an engineering case file printed on obsidian blueprint stock, expressed through decisive serif statements, mono evidence annotations, open editorial compositions, an authentic portrait, and one ember validation thread that turns scrolling into a readable proof sequence.

## 3. Surface classification and final design dials

| Dial | Value | Reason |
| --- | ---: | --- |
| Surface | Portfolio and personal brand | The page must communicate identity, judgment, proof, and role fit. |
| Mode | Redesign-preserve with structural overhaul | Content truth, anchors, links, and recognizable brand material stay fixed while hierarchy and composition change materially. |
| Design variance | 9/10 | The project storytelling needs strongly differentiated layout families and a memorable narrative system. |
| Motion intensity | 7/10 | One authored scroll sequence is justified, but the rest of the page must become quieter. |
| Visual density | 4/10 | Technical evidence remains available without making the page feel like an application dashboard. |
| Reduced motion | 1/10 | The same narrative is rendered as a complete static sequence with no scrub, pinning, parallax, or autoplay. |
| Mobile motion | 3/10 | Mobile uses brief state transitions and a lightly animated packet marker with no pinning. |

## 4. Design-system map

### Typography

- Display: retain Fraunces because it is already a recognizable portfolio signature and supports the authored editorial tone. Use 400 and 500 weights. Avoid scattered italic styling. Italic is reserved for the single philosophical stress phrase.
- Body: retain Space Grotesk for open counters, readable technical prose, and compact controls.
- Metadata: retain JetBrains Mono for evidence tiers, process stages, dates, commands, and architectural labels.
- Desktop hero: clamp between 64 and 112 px, no more than three lines.
- Mobile hero: clamp between 44 and 58 px, no more than four short lines.
- Body text: 16 to 19 px with 1.55 to 1.7 line height and a 68 character maximum line.
- Headline wrapping is authored with short spans, not accidental `<br>` duplication.

### Color

- Dark canvas: `#090B10`.
- Dark elevated field: `#10141B`.
- Dark rule: `#252C38`.
- Primary dark ink: `#F1F0EA`.
- Secondary dark ink: `#A7ADBA`.
- Light canvas: `#F2F1EC`.
- Light elevated field: `#FBFAF6`.
- Light rule: `#CDD1D8`.
- Primary light ink: `#11141A`.
- Accent: ember `#FF6840` in dark mode and `#D94B24` in light mode.
- Success: restrained green only for persisted or verified state.
- Warning: amber only for manual review or claimed evidence.
- Information blue remains restricted to artifact evidence.
- No gradient text. Soft radial color may appear only as material atmosphere behind the evidence thread.

### Grid

- Maximum content width: 1240 px.
- Desktop: 12 columns with 24 px gutters.
- Tablet: 8 columns.
- Mobile: 4 columns with 18 to 22 px outer gutters.
- Long-form prose aligns to 5 to 7 columns.
- Diagrams align to the same grid and never float as arbitrary cards.

### Spacing

- Core unit: 8 px.
- Micro: 4, 8, 12.
- Control: 16, 20, 24.
- Component: 32, 40, 48.
- Section: 80, 112, 152.
- Mobile section spacing compresses to 64 to 88 px.
- Dense proof sequences alternate with quiet editorial pauses.

### Shape

- Small radius: 4 px.
- Medium radius: 10 px.
- Large radius: 18 px only for the portrait and command palette.
- Evidence modules use clipped or open corners rather than rounded wrappers everywhere.
- Pills remain only where they express a true compact state, such as evidence tier.

### Borders

- One-pixel rules.
- Dashed rules only for unverified, reserved, or in-transit state.
- Solid rules for verified or persisted state.
- Registration corners appear only on the hero evidence field, flagship diagram, and HPCL terminal.

### Shadows

- No generic floating-card shadows.
- Use a short cool ambient shadow only for overlays and the portrait.
- Use ember bloom only around the moving evidence packet and verified terminal state.

### Materials

- Fine static grain at very low opacity.
- Blueprint grid becomes locally responsive to sections instead of a full-page competing pattern.
- Obsidian and cool-paper surfaces use subtle tonal separation, not glass panels.
- No large-area backdrop blur except the fixed navigation and command palette.

### Imagery

- The authentic portrait is the only person image.
- The six architecture diagrams remain primary evidence.
- Generated frames are design references only.
- No generated production image is planned unless the reference-frame review reveals a composition that cannot be built convincingly with CSS, SVG, canvas, the portrait, and existing diagrams.
- Portrait crop: 4:5 desktop, 1:1 or 5:6 mobile, face centered with room for evidence caption.
- Diagrams: variable editorial frames, always labeled and readable.

### Iconography

- Retain the existing line icon posture.
- Use one stroke family with 1.5 to 2 px optical weight.
- Icons are functional only: theme, external link, palette search, awards, and navigation.
- Remove decorative emoji from diagram labels.

### Theme

- Dark remains the default brand expression.
- Light is a complete cool-paper equivalent, not an inversion.
- Explicit user choice persists.
- Canvas, diagrams, terminal accents, evidence thread, focus rings, and browser theme color all update from the same token source.

## 5. Page rhythm and responsive composition

### Hero: Claim intake

- Purpose: establish identity, role, philosophy, availability, and the primary project path within one viewport.
- Layout family: asymmetrical editorial opening with copy on the left and an evidence intake field on the right.
- Primary focal point: "Engineering AI systems that refuse to guess."
- Content priority: headline, biography summary, primary CTA, availability.
- Media role: an abstract code-native evidence packet and route field, not a generated dashboard.
- Desktop: 7 columns of copy, 5 columns of evidence-thread field.
- Mobile: headline first, primary CTA visible inside the initial 844 px viewport, compact process strip below. Secondary CTA remains visible without pushing the primary action below the fold.

### Signature narrative: Evidence pipeline

- Purpose: show how a claim travels through validate, retrieve, execute, persist, and observe, with unsupported input routed to manual review.
- Layout family: bounded sticky editorial sequence on desktop with a static five-step route and three content chapters. No more than one viewport of pinning.
- Primary focal point: one ember packet moving along a single path.
- Content priority: philosophy, failure behavior, evidence tier, then implementation examples.
- Media role: code-native SVG and DOM lines.
- Mobile: normal vertical flow with no pinning. Each stage remains readable and the path becomes a left-side rule.

### About: Human dossier

- Purpose: connect the systems philosophy to Ross as a person.
- Layout family: portrait-led dossier with open prose, evidence-tier legend, and compact factual definitions.
- Primary focal point: authentic portrait.
- Content priority: graduate status, degree, college, location, focus, evidence policy.
- Media role: authentic portrait with a quiet evidence caption.
- Mobile: portrait follows the opening paragraph, then facts and countable statistics.

### HPCL experience: Verified field report

- Purpose: make the six-month enterprise context and reliability work concrete.
- Layout family: timeline ledger plus terminal field report.
- Primary focal point: role, date, location, and verified completion tier.
- Content priority: enterprise constraints, work scope, reliability controls, governed chatbot boundary, completion.
- Media role: terminal replay remains a functional proof metaphor.
- Mobile: role metadata stacks before the points. Terminal becomes horizontally safe and its log remains readable.

### Projects: Authored system chapters

- Purpose: preserve all six systems while replacing the repeated zigzag.
- Layout family:
  1. Full-width flagship HPCL case study with diagram integrated into the evidence thread.
  2. Paired Voice and Vision chapter with two distinct diagrams sharing one editorial spread.
  3. Workflow systems chapter for n8n with a wide process diagram and numbered proof ledger.
  4. Compact local-first engineering chapter pairing local-doc-rag and Verbatim.
  5. Restrained reserved slot for the next system.
- Primary focal point: flagship architecture.
- Content priority: project boundary, architecture, reliability behavior, repository.
- Media role: diagrams are evidence and remain legible at all widths.
- Mobile: all chapters become a single reading order without alternating reordering.

### Skills: Evidence index

- Purpose: show technologies only where shipped work supports them.
- Layout family: three open typographic columns separated by rules.
- Primary focal point: category titles and evidence notes.
- Mobile: vertical disclosure without pill overload.

### Recognition: Record and timeline

- Purpose: preserve achievements, certifications, and chronology.
- Layout family: awards lead, timeline follows as a compact ledger.
- Primary focal point: SIH 2024 and HackSpear 2025.
- Mobile: awards and credentials become a single chronological stack.

### FAQ and colophon: Audit appendix

- Purpose: answer recruiter questions and explain the page's own engineering choices.
- Layout family: restrained two-column appendix on desktop.
- Primary focal point: honest answers.
- Mobile: FAQ first, colophon second. Native details behavior remains.

### Contact: Final handoff

- Purpose: provide direct action after evidence has been established.
- Layout family: one strong statement plus three open channels.
- Primary focal point: email.
- Mobile: channels remain 44 px minimum targets and wrap safely.

## 6. Section-by-section restructuring plan

1. Keep every existing anchor and external URL.
2. Keep the hero claim and biography meaning while reducing telemetry clutter.
3. Introduce an evidence packet in the hero that visually continues into the philosophy pipeline.
4. Convert Philosophy into the single signature narrative.
5. Recompose About as a portrait dossier.
6. Recompose HPCL as a verified field report with the terminal as a purposeful second beat.
7. Replace six alternating project rows with four authored chapters plus the reserved slot.
8. Turn skills into an evidence index rather than three bordered tag containers.
9. Pair Recognition and its timeline more tightly.
10. Treat FAQ and Colophon as an audit appendix.
11. End with a direct, uncluttered contact handoff.
12. Preserve structured data and all visible factual information.

## 7. Motion choreography and ownership map

| Motion | Trigger | Target and property | Purpose | Owner | Reduced motion | Mobile and low-power |
| --- | --- | --- | --- | --- | --- | --- |
| Evidence packet journey | Scroll through signature narrative | packet `transform`, path progress, stage state | Storytelling and orientation | one JavaScript evidence-thread controller plus CSS state styles | static path with all stages visible | no pinning, small opacity and color state only |
| Hero entrance | initial load | headline phrase opacity and 16 px translate | hierarchy | CSS | immediate visible state | shorter duration, no staggered characters |
| Editorial reveal | intersection | opacity and 12 px translate on major blocks only | hierarchy | CSS and one observer | immediate visible state | same or disabled |
| Diagram evidence activation | intersection or focus within chapter | path dash offset once | storytelling | CSS | fully drawn static diagram | fully drawn or one short draw |
| Terminal replay | HPCL section visible | text content sequence | storytelling | existing terminal controller, revised to stop when offscreen | full static log | one replay maximum or static on low-power |
| Theme transition | theme control | colors only | state continuity | CSS | instant or near instant | same |
| Hover and pressed | pointer or keyboard | color, border, 2 px translate | feedback | CSS | same, no spatial travel required | visible tap states |
| Command palette | keyboard command | opacity and 8 px scale | state transition | CSS and palette controller | instant opacity | same |

### Motion ownership rules

- No custom cursor.
- No marquee.
- No rotating sigil loop.
- No portrait scan loop.
- No animated favicon loop.
- No repeated project-card tilt.
- No simultaneous hero mesh and evidence-thread canvas.
- The evidence-thread controller is the only scroll-linked system.
- The terminal is the only timed content replay.
- Diagrams animate once and sleep permanently.
- All persistent work pauses on `document.hidden` and when offscreen.

## 8. Image plan and GPT Image prompt ledger

### Asset inventory

| Asset | Type | Status | Use |
| --- | --- | --- | --- |
| `assets/ross-portrait.png` | authentic portrait, 1254 by 1254 | preserve | About dossier and identity proof |
| Six inline SVG architecture diagrams | code-native evidence | preserve and reframe | Project chapters |
| Hero and pipeline canvases | code-native motion | consolidate | Replace with one evidence-thread system |
| HPCL terminal | DOM replay | preserve and refine | Field report |

### Shared reference-frame consistency block

- Brand world: obsidian blueprint editorial case file.
- Palette: `#090B10`, `#F1F0EA`, ember `#FF6840`, restrained green and amber semantic states.
- Lighting: low-key warm edge light with cool technical ambient fill.
- Texture: fine paper grain, etched grid, subtle carbon and ink material.
- Type mood: decisive high-contrast editorial serif plus precise mono evidence notes.
- Truth posture: no fake screenshots, dashboards, documents, metrics, certificates, logos, or corporate material.
- Diagrams: architecture is shown as truthful abstract line work, never fake product UI.

### Prompt ledger

| Asset ID | Role | Placement | Ratio | Focal point | Copy-safe area | Prompt direction | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ref-hero-desktop-v1` | reference frame | desktop hero and first narrative transition | 16:10 landscape | editorial headline and one ember packet | left and lower-left for real copy | Premium portfolio hero for an AI engineer. Obsidian blueprint field, authentic engineering case-file mood, one ember packet entering a validation path on the right, serif headline rhythm on the left, quiet mono metadata, first transition visible at the bottom. No fake UI or invented evidence. Desktop crop. | accepted at `design/reference-frames/hero-desktop-reference.png` |
| `ref-projects-desktop-v1` | reference frame | reworked project-storytelling section | 16:10 landscape | flagship architecture diagram | upper-left for chapter title and lower rail for evidence labels | Editorial systems chapter with one full-width flagship, a paired voice and vision spread, a wide workflow chapter, and compact local-first artifacts. Existing diagrams are represented as line-based evidence, not decorative cards. Obsidian and ember palette. No fake product screenshots. Desktop crop. | revised and accepted at `design/reference-frames/projects-desktop-reference.png` |
| `ref-mobile-v1` | reference frame | mobile hero and project composition | 9:16 portrait | headline, visible primary CTA, compact evidence path | central copy-safe column with 20 px gutters | Mobile portfolio reference at 390 by 844. Hero primary action fully visible, evidence packet simplified into a static process strip, project chapters in one clear reading order, authentic editorial typography, obsidian and ember palette. No pinning, clipped copy, fake UI, or oversized telemetry. | corrected and accepted at `design/reference-frames/mobile-reference.png` |

### Reference-frame review

#### Desktop hero

- Accepted qualities: one dominant serif claim, visible primary action, narrow navigation, right-side packet route, and a clear visual handoff into the next narrative.
- Implementation extraction: use a 7 and 5 column hero, keep the route code-native, replace the generated envelope object with an abstract packet, and retain real site copy rather than frame copy.
- Rejected details: generated stage labels and the literal envelope are not production content.

#### Desktop projects

- The first generation was rejected because it resembled a dense dashboard and invented architectural detail.
- The second generation established the correct open composition but introduced confidential-looking "redacted" language.
- The accepted correction preserves the large flagship, shared ember thread, asymmetrical VoiceRAG and VisoRAG spread, and wide workflow continuation while labeling the flagship as a public GitHub scaffold.
- Implementation extraction: use real existing project copy and diagrams only. The frame controls hierarchy, spacing, rule placement, and diagram scale.

#### Mobile

- The first generation established a useful single-column hero but invented a flagship name and generic process labels.
- The accepted correction uses the real HPCL project name, an explicit non-production boundary, and the required validate, retrieve, execute, persist, and observe stages.
- Implementation extraction: keep the visible primary action, 20 px gutters, static vertical process sequence, and full-width flagship flow. Use actual local copy and actual SVG architecture.

### Production image decision

No generated production image is currently justified. The identity already comes from the authentic portrait, blueprint material, architecture diagrams, and the code-native evidence thread. A generated background would risk competing with evidence and weakening the zero-dependency engineering character. This decision may change only if the reference-frame review proves that a restrained texture materially improves composition and can be shipped without misleading content.

## 9. Accessibility and degradation plan

- Keep semantic landmarks, headings, native links, native details, and JSON-LD.
- Keep the skip link and strong visible focus rings.
- Make the mobile menu a real modal navigation region with correct state, Escape behavior, focus movement, and focus return.
- Make the command palette restore focus to a stable fallback trigger when the prior active element is the body.
- Trap focus inside the command palette while open.
- Mark hidden palette and mobile-menu content inert or inaccessible while closed.
- Maintain 44 by 44 px minimum touch targets.
- Keep primary CTA fully visible in the 390 by 844 hero and usable at 320 px.
- Ensure diagram labels remain readable and SVGs have accurate accessible names.
- Preserve canvas or SVG static equivalents when JavaScript is unavailable.
- Under reduced motion: no pinning, scrubbing, parallax, marquee, looping scan, looping sigil, ticker, tilt, custom cursor, or terminal replay. All content is immediately present.
- On touch, narrow screens, or low-power assumptions: no sticky pinning, no continuous ambient loops, and diagram paths render static.
- Preserve native scrolling, anchors, browser history, touch behavior, and scroll restoration.
- Reserve portrait and diagram dimensions.
- Pause all remaining timed work when offscreen or when the document is hidden.

## 10. Anti-template risks

| Risk | Prevention rule |
| --- | --- |
| Generic Awwwards cinematic site | Every spectacle beat must explain the evidence pipeline or be removed. |
| Sci-fi dashboard | Use editorial composition and open rules, not panels of fake telemetry. |
| Card collection | Use section-specific layout families and border only where grouping is real. |
| Repeated zigzag projects | Use flagship, paired, workflow, compact local-first, and reserved layout families. |
| Excessive pills | Reserve pills for evidence state only. Technologies become inline metadata lists. |
| Fake terminal or dashboard | Keep the real HTML terminal concept and truthful architecture diagrams only. |
| Generated evidence theater | Reference frames never ship as proof. No generated screenshot, metric, certificate, or corporate document. |
| Motion showcase | One evidence-thread spectacle, one entrance grammar, one feedback grammar. |
| Giant empty headings | Headline size must preserve a visible action and meaningful content in the initial viewport. |
| Decorative grid overload | Blueprint lines become local compositional structure, not a full-page distraction. |
| Random serif emphasis | Italic appears only on the core "refuse to guess" stress phrase. |
| Custom-cursor friction | Remove the custom cursor and preserve native pointer behavior. |

## 11. Acceptance criteria

1. The Design Direction Pack exists before implementation and every major change maps to it.
2. All existing factual content and meaning remain visible, including biography, HPCL, projects, evidence boundaries, skills, achievements, certifications, FAQ, colophon, accessibility claims, repository links, contact links, and structured data.
3. Desktop page height is materially reduced from the 16,102 px baseline without hiding factual content.
4. The Projects section no longer contains six consecutive alternating split rows.
5. The Projects section uses at least four distinct authored layout families.
6. One evidence-thread narrative begins in the hero and connects philosophy, HPCL, and the flagship project.
7. Desktop uses one bounded scroll-authored sequence. Mobile and reduced motion use normal vertical flow.
8. The primary CTA is fully visible at 390 by 844 and remains usable at 320 px.
9. The mobile menu opens visibly, closes from links and Escape, moves focus appropriately, and returns focus to the burger.
10. The command palette opens, contains focus, closes with Escape or backdrop, and restores focus to a stable visible control.
11. Dark and light themes are complete and persistent.
12. All anchors land reliably below the fixed navigation.
13. No horizontal overflow exists at 1440, 1024, 390, or 320 px.
14. Reduced motion preserves a polished complete composition with no essential content delayed.
15. Expensive or timed effects stop when offscreen or when the page is hidden.
16. Architecture diagrams remain readable evidence.
17. FAQ, counters, theme, navigation, repository links, contact links, and command actions remain functional.
18. No placeholder, TODO, omission marker, fake data, fake dashboard, or unexplained console warning remains.
19. Newly written interface copy contains only regular hyphens.
20. Final Browser screenshots cover hero, signature narrative, project composition, and mobile experience.

## 12. Six-category redesign audit

### 12.1 Brand and visual identity

| Field | Finding |
| --- | --- |
| Evidence | Obsidian blueprint grid, ember accent, Fraunces and JetBrains Mono contrast, authentic portrait, animated RD sigil, hand-drawn diagrams. |
| What works | The color and type contrast feel recognizable. The evidence motif is specific to Ross. The portrait creates authenticity. |
| Friction | Full-page grid, many registration corners, telemetry, grain, spinning sigil, scan line, custom cursor, marquee, and multiple ambient loops compete for attention. |
| Severity | High |
| Disposition | Preserve palette, type contrast, portrait, diagrams, evidence language. Refine material system. Remove competing ambient systems. |
| Recommended change | Concentrate identity into one evidence thread and fewer stronger marks. |
| Verification | Visual comparison in both themes and animation inventory after implementation. |

### 12.2 Information architecture and content

| Field | Finding |
| --- | --- |
| Evidence | Nine anchored sections, six full project narratives, eight FAQ items, colophon, skills, achievements, timeline, contact, JSON-LD. |
| What works | Content is unusually honest, specific, and evidence labeled. Repository and contact paths are direct. |
| Friction | Repeated section introductions and six equal project treatments flatten priority. The live deployment is stale relative to local graduate and HPCL completion facts. |
| Severity | Critical for hierarchy, high for deployment drift |
| Disposition | Preserve all facts and links. Reorder and recompose. Deploy the verified local truth. |
| Recommended change | Build a clear hero, signature pipeline, HPCL field report, flagship project, paired systems chapters, then audit appendix. |
| Verification | Text and href inventory comparison plus live deployment check. |

### 12.3 Layout, hierarchy, and responsiveness

| Field | Finding |
| --- | --- |
| Evidence | 16,102 px desktop page height at 1440 by 900. Projects is 4,459 px. Hero is 917 px at desktop. At 390 by 844, hero is about 973 px, primary CTA exposes only about 47 px, secondary CTA is below the fold. |
| What works | Desktop grid is coherent and there is no baseline horizontal overflow. |
| Friction | Repeated split rows, repeated section-title pattern, long page, oversized mobile hero, clipped mobile status and copy. |
| Severity | Critical |
| Disposition | Replace repeated layout families and recompose mobile. |
| Recommended change | Shorter hero, authored project chapters, tighter section rhythm, responsive editorial grid. |
| Verification | Required viewport measurements and screenshots. |

### 12.4 Interaction, motion, and state

| Field | Finding |
| --- | --- |
| Evidence | Mobile JavaScript toggles `body.menu-open`, while CSS opens `.mobile-menu.is-open`. Repeated 0.9 second reveals. Continuous grain, sigil, marquee, portrait scan, favicon, hero canvas, pipeline canvas, terminal, ticker, cursor, and diagram-wire motion. |
| What works | Theme toggle, FAQ, counters, anchors, command palette open and Escape close, pipeline, static fallbacks, and diagram drawing are functional. |
| Friction | Mobile menu is invisible while marked expanded. Palette can leave focus on the hidden input when prior focus is body. Motion systems compete and some loops add little narrative value. |
| Severity | Critical for menu and focus, high for motion |
| Disposition | Fix menu and focus. Consolidate motion into one signature system. |
| Recommended change | Evidence-thread controller plus quiet CSS transitions. |
| Verification | Keyboard, mobile, touch-oriented, visibility, and reduced-motion Browser tests. |

### 12.5 Accessibility and performance

| Field | Finding |
| --- | --- |
| Evidence | Skip link, semantic sections, native details, alt text, focus-visible styles, reduced-motion media query, canvas DPR cap, and visibility checks are present. No console warnings or errors were observed. |
| What works | Strong base semantics and meaningful static fallbacks. |
| Friction | Menu visibility and palette restoration break keyboard expectations. Full-page grain, large fixed background, and several simultaneous loops add ongoing cost. Body `overflow-x: hidden` can conceal rather than prevent overflow. |
| Severity | Critical for keyboard defects, medium to high for performance |
| Disposition | Preserve semantic base. Repair focus. Remove excess loops. Test real overflow instead of masking it. |
| Recommended change | Inert closed overlays, focus trap, explicit fallback focus, fewer loops, localized texture, and measured overflow checks. |
| Verification | Keyboard-only pass, reduced-motion pass, console check, scroll-width check, and background-tab behavior check. |

### 12.6 Credibility, conversion, and product truth

| Field | Finding |
| --- | --- |
| Evidence | Clear evidence tiers, explicit non-production claim for HPCL chatbot, public repository links, countable metrics only, and honest FAQ answers. |
| What works | Credibility is the strongest part of the current site and must remain untouched in meaning. |
| Friction | The current hierarchy makes users traverse too much repeated structure before seeing the full authored relationship between philosophy, enterprise experience, and flagship project. The stale deployed facts weaken trust. |
| Severity | High |
| Disposition | Preserve every honesty boundary. Improve priority and deploy current facts. |
| Recommended change | Make the evidence pipeline the conversion narrative and surface repository access at each project chapter. |
| Verification | Claim inventory, link inventory, JSON-LD comparison, and live deployment inspection. |

## Audit conclusion

### Recommendation

Full structural redesign with strict content preservation.

### Preservation boundaries

- No factual deletion, invention, exaggeration, or silent weakening.
- Preserve every existing anchor and external URL.
- Preserve authentic portrait, six diagrams, evidence tiers, dark and light themes, command palette, FAQ, JSON-LD, skip link, reduced-motion support, and zero-build character.

### Highest-value first three changes

1. Replace the repeated project zigzag with a flagship and authored chapter hierarchy.
2. Build the single evidence-thread narrative and remove competing ambient motion.
3. Fix the mobile menu, mobile hero, and command-palette focus model.

### Risks

- A sticky narrative can obstruct reading if it is too long. Bound it to one sequence and remove pinning on mobile and reduced motion.
- Generated reference frames can tempt the implementation toward fake interface imagery. Use them only for composition, spacing, material, and rhythm.
- Content preservation can be compromised by restructuring. Use exact text and href inventories before and after.
- The live site is behind the local truth. Deploy only from the new branch after local verification and confirm the resulting URL.

## Implementation trace and final local validation

The implementation follows the direction above without using generated imagery in production. The three approved frames remain design targets only. The authentic portrait, six architecture diagrams, HPCL terminal, evidence tiers, all repository links, command palette, themes, FAQ, JSON-LD, and reserved Project 07 slot remain in the site.

### Direction to implementation map

| Design decision | Implemented result |
| --- | --- |
| One dominant concept | The hero claim packet and philosophy evidence thread use the same validate, retrieve, execute, persist, observe sequence. |
| Flagship hierarchy | HPCL is full width and immersive. VoiceRAG and VisoRAG form a paired chapter. n8n is a wide workflow chapter. local-doc-rag and Verbatim form the compact local-first pair. |
| Quiet supporting motion | After direct interaction review, diagram wires flow continuously while visible, fine-pointer diagram cards use direct cursor-following tilt, and important titles share one globally queued Vapour Text system. Exactly one rendered title line completes its dissolve and re-formation at a time. Each effect has one owner and pauses or flattens offscreen, on touch, and under reduced motion. Ticker motion, marquee motion, portrait scanning, and rotating sigil remain disabled. |
| Native responsive behavior | Native scrolling and anchors remain. The sticky evidence story becomes a static document flow below 900 px and under reduced motion. |
| Honest image strategy | No generated production asset was justified. The real portrait, CSS material, canvas packet, and architecture SVGs carry the identity. |
| Keyboard repair | The mobile overlay synchronizes class, aria-hidden, and inert state. It focuses the first link and returns focus to the menu button. The command palette traps focus and restores it to a stable trigger. |

### Measured local result

| Check | Baseline | Final local result |
| --- | ---: | ---: |
| Desktop document height at 1440 by 900 | 16,102 px | 15,143 px |
| Projects section height at 1440 by 900 | 4,459 px | 3,964 px |
| Desktop hero height | 917 px | 900 px |
| Mobile primary CTA at 390 by 844 | Partially visible, bottom at about 845 px | Fully visible, top 649 px and bottom 699 px |
| Mobile primary CTA at 320 by 844 | Not established | Fully visible, top 611 px and bottom 661 px |
| Horizontal overflow | None at desktop, mobile risk hidden by overflow | None at 1440, 1024, 390, or 320 px |

### Verified local behavior

- Mobile menu opens visibly, sets `aria-hidden="false"`, removes inert, focuses About, closes with Escape, restores focus to the menu button, and reverses the state.
- The command palette opens as a modal dialog with the input focused. Shift+Tab wraps to the last command, Tab from the last command wraps to the input, Escape closes it, and focus returns to the theme control.
- All existing hash links resolve to present targets. The original external URL set is preserved, with the requested phone link added; `css/v3.css` and `js/vapour.js` are the new implementation layers.
- All six GitHub repository URLs returned HTTP 200. The LinkedIn target remains correct but rejects automated HTTP verification with status 999.
- Dark and light themes both render without overflow and persist through the existing control.
- Reduced motion removes hero canvas rendering, grain, packet travel, and smooth scrolling. All five evidence steps remain active, the pipeline legend remains explicit, and the terminal exposes its complete static log.
- Coarse-pointer emulation disables the hero canvas and tilt behavior and renders the terminal without replay.
- Counters settle to 6, 6, 19, and 21.
- Hero and pipeline canvas bitmaps match their measured CSS dimensions at the active device pixel ratio.
- The final console audit contains no warnings or errors.
- JavaScript syntax checks pass for `main.js`, `engines.js`, `brand.js`, `flow.js`, and `vapour.js`.
- `git diff --check` passes.

### User-directed interaction revision

- Vapour Text is a shared title language across the hero, Builder chapter, HPCL experience, philosophy, project chapter, all six project titles, skills, achievements, and contact. It uses compact vanilla-canvas overlays without changing the underlying heading text or adding a dependency.
- A global queue permits exactly one visible title line to animate at a time. Every word, dash, accent, and punctuation mark on that rendered line is sampled into one color-faithful canvas surface, so there is no word boundary or terminal-character handoff.
- The active DOM line becomes fully transparent while the matching particle raster dissolves and reforms. There is no skeleton, outline, or shadow copy under the particles. When re-formation completes, the full DOM line returns in the same frame and the canvas is cleared.
- Every particle uses an absolute wall-clock release age and bounded lifetime, so a dropped frame cannot strand half of a final glyph. Each canvas also carries 28 to 58 px of transparent safety padding on every side, with global canvas width caps explicitly removed so the buffer cannot be silently clipped.
- The evaporation uses a longer high-density particle pass and a slower re-formation curve. Rendering reuses color and opacity buckets, preserving the richer field while maintaining a measured 17.1 ms p95 animation-frame interval on the largest hero line in the in-app Browser audit.
- The Vapour Text queue runs only for visible titles on a fine pointer. It pauses in a background tab and becomes ordinary static text on narrow screens, coarse pointers, reduced motion, or canvas failure.
- Orange dotted diagram routes animate continuously while their diagram is intersecting the viewport. Offscreen and background-tab diagrams stop work, and reduced motion shows the complete static route.
- Diagram cards now track the fine pointer directly across both axes and reset cleanly outside the card. The transform is compositor-only and avoids a second easing loop that would make the response feel delayed.
- The Talk to me section now exposes Ross's email, GitHub, phone number, and exact LinkedIn profile as direct links.
