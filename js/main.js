
/* ==========================================================
     SCRIPT · PART 1 — theme, chrome, reveals, hero
     Every routine below is hand-written for this page.
     Global conventions:
       · all modules are init functions called at the bottom
       · all rAF loops pause when document.hidden
       · all pointer-decoration honors (pointer:fine) and
         prefers-reduced-motion
     ========================================================== */
(function () {
	'use strict';

	var docEl = document.documentElement;
	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	var finePointer = window.matchMedia('(pointer: fine)');

	/* ----------------------------------------------------------
	   1 · THEME ENGINE
	   Three states: auto (follow OS), light, dark.
	   · stored choice wins; "auto" listens to the OS live
	   · toggle cycles resolved appearance (light ↔ dark)
	   · storage access wrapped: private-mode Safari throws
	   ---------------------------------------------------------- */
	var THEME_KEY = 'rd-theme';

	function readStoredTheme() {
		try { return localStorage.getItem(THEME_KEY); } catch (err) { return null; }
	}

	function writeStoredTheme(value) {
		try { localStorage.setItem(THEME_KEY, value); } catch (err) { /* storage unavailable: theme still works for this visit */ }
	}

	var osDark = window.matchMedia('(prefers-color-scheme: dark)');

	function resolvedIsDark() {
		var mode = docEl.getAttribute('data-theme') || 'auto';
		if (mode === 'dark') { return true; }
		if (mode === 'light') { return false; }
		return osDark.matches;
	}

	function applyThemeClass() {
		var dark = resolvedIsDark();
		var toggle = document.getElementById('themeToggle');
		docEl.classList.toggle('is-dark', dark);
		if (toggle) {
			toggle.classList.toggle('is-dark', dark);
			toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
		}
		/* let canvases re-read palette on next frame */
		window.dispatchEvent(new CustomEvent('rd:theme'));
	}

	function initTheme() {
		var stored = readStoredTheme();
		if (stored === 'light' || stored === 'dark') {
			docEl.setAttribute('data-theme', stored);
		}
		applyThemeClass();

		var onOsChange = function () {
			if ((docEl.getAttribute('data-theme') || 'auto') === 'auto') { applyThemeClass(); }
		};
		if (osDark.addEventListener) { osDark.addEventListener('change', onOsChange); }
		else if (osDark.addListener) { osDark.addListener(onOsChange); } /* older Safari */

		var toggle = document.getElementById('themeToggle');
		if (toggle) {
			toggle.addEventListener('click', function () {
				var next = resolvedIsDark() ? 'light' : 'dark';
				docEl.setAttribute('data-theme', next);
				writeStoredTheme(next);
				applyThemeClass();
			});
		}
	}

	/* ----------------------------------------------------------
	   2 · PALETTE READER
	   Canvas engines read CSS custom properties at draw time so
	   both themes render correctly without duplicated constants.
	   ---------------------------------------------------------- */
	function cssVar(name, fallback) {
		var v = getComputedStyle(docEl).getPropertyValue(name).trim();
		return v || fallback;
	}

	/* ----------------------------------------------------------
	   3 · NAV: shrink on scroll, hide on scroll-down,
	      scroll progress bar — one passive scroll listener,
	      work batched into rAF.
	   ---------------------------------------------------------- */
	function initNavAndProgress() {
		var nav = document.getElementById('nav');
		var bar = document.getElementById('scrollProgress');
		var lastY = window.scrollY;
		var ticking = false;

		function update() {
			ticking = false;
			var y = window.scrollY;
			var max = docEl.scrollHeight - window.innerHeight;
			if (bar) {
				var p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
				bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
			}
			if (nav) {
				nav.classList.toggle('is-scrolled', y > 24);
				/* hide only when moving down, past the hero, and menu closed */
				var goingDown = y > lastY + 4;
				var goingUp = y < lastY - 4;
				if (goingDown && y > window.innerHeight * 0.9 && !document.body.classList.contains('menu-open')) {
					nav.classList.add('is-hidden');
				} else if (goingUp || y <= window.innerHeight * 0.9) {
					nav.classList.remove('is-hidden');
				}
			}
			lastY = y;
		}

		window.addEventListener('scroll', function () {
			if (!ticking) { ticking = true; requestAnimationFrame(update); }
		}, { passive: true });
		update();
	}

	/* ----------------------------------------------------------
	   4 · MOBILE MENU
	   · burger toggles; any link click closes
	   · Escape closes and returns focus to the burger
	   ---------------------------------------------------------- */
	function initMobileMenu() {
		var burger = document.getElementById('navBurger');
		var menu = document.getElementById('mobileMenu');
		if (!burger || !menu) { return; }

		function setOpen(open) {
			document.body.classList.toggle('menu-open', open);
			menu.classList.toggle('is-open', open);
			menu.setAttribute('aria-hidden', open ? 'false' : 'true');
			if ('inert' in menu) { menu.inert = !open; }
			burger.setAttribute('aria-expanded', open ? 'true' : 'false');
			burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
			if (open) {
				var firstLink = menu.querySelector('a');
				if (firstLink) {
					setTimeout(function () {
						if (document.body.classList.contains('menu-open')) {
							firstLink.focus({ preventScroll: true });
						}
					}, 50);
				}
			}
		}

		menu.setAttribute('aria-hidden', 'true');
		if ('inert' in menu) { menu.inert = true; }

		burger.addEventListener('click', function () {
			setOpen(!document.body.classList.contains('menu-open'));
		});
		menu.addEventListener('click', function (e) {
			if (e.target.closest('a')) { setOpen(false); }
		});
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && document.body.classList.contains('menu-open')) {
				setOpen(false);
				burger.focus();
			}
		});
	}

	/* ----------------------------------------------------------
	   5 · REVEAL SYSTEM + ACTIVE NAV + COUNTERS + TIMELINE DOTS
	   One IntersectionObserver per concern; all disconnect-safe.
	   ---------------------------------------------------------- */
	function initReveals() {
		var targets = document.querySelectorAll('.reveal, .reveal-scale, .reveal-line, .reveal-draw');
		if (!('IntersectionObserver' in window)) {
			targets.forEach(function (el) { el.classList.add('is-in'); });
			return;
		}
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-in');
					io.unobserve(entry.target); /* reveal once; never re-hide content */
				}
			});
		}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
		targets.forEach(function (el) { io.observe(el); });
	}

	function initActiveNav() {
		var sections = document.querySelectorAll('main section[id]');
		var links = document.querySelectorAll('.nav-link');
		if (!sections.length || !links.length || !('IntersectionObserver' in window)) { return; }
		var current = null;
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) { current = entry.target.id; }
			});
			links.forEach(function (link) {
				var href = link.getAttribute('href') || '';
				link.classList.toggle('is-active', href === '#' + current);
			});
		}, { rootMargin: '-40% 0px -55% 0px' });
		sections.forEach(function (s) { io.observe(s); });
	}

	function initCounters() {
		var counters = document.querySelectorAll('[data-count]');
		if (!counters.length) { return; }
		function animate(el) {
			var target = parseInt(el.getAttribute('data-count'), 10) || 0;
			if (reduceMotion.matches) { el.textContent = String(target); return; }
			var t0 = null;
			var dur = 1400;
			function step(ts) {
				if (t0 === null) { t0 = ts; }
				var k = Math.min(1, (ts - t0) / dur);
				/* easeOutQuart — fast start, gentle settle */
				var eased = 1 - Math.pow(1 - k, 4);
				el.textContent = String(Math.round(target * eased));
				if (k < 1) { requestAnimationFrame(step); }
			}
			requestAnimationFrame(step);
		}
		if (!('IntersectionObserver' in window)) {
			counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
			return;
		}
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					animate(entry.target);
					io.unobserve(entry.target);
				}
			});
		}, { threshold: 0.6 });
		counters.forEach(function (el) { io.observe(el); });
	}

	function initTimeline() {
		var timeline = document.getElementById('timeline');
		if (!timeline) { return; }
		var items = timeline.querySelectorAll('.timeline-item');
		var ticking = false;

		function update() {
			ticking = false;
			var rect = timeline.getBoundingClientRect();
			var vh = window.innerHeight;
			/* spine fill tracks how far the viewport centre has travelled through the block */
			var progress = (vh * 0.55 - rect.top) / rect.height;
			progress = Math.min(1, Math.max(0, progress));
			timeline.style.setProperty('--spine', (progress * 100).toFixed(2));
			items.forEach(function (item) {
				var r = item.getBoundingClientRect();
				item.classList.toggle('is-lit', r.top < vh * 0.55);
			});
		}

		window.addEventListener('scroll', function () {
			if (!ticking) { ticking = true; requestAnimationFrame(update); }
		}, { passive: true });
		update();
	}

	/* ----------------------------------------------------------
	   5b · EVIDENCE THREAD
	   One scroll-owned progress value drives the signature story.
	   Mobile and reduced-motion layouts remain fully static.
	   ---------------------------------------------------------- */
	function initEvidenceThread() {
		var story = document.getElementById('evidenceStory');
		if (!story) { return; }
		var steps = story.querySelectorAll('[data-evidence-step]');
		var compact = window.matchMedia('(max-width: 900px)');
		var ticking = false;

		function renderStatic() {
			story.style.setProperty('--evidence-progress', '1');
			steps.forEach(function (step) { step.classList.add('is-active'); });
		}

		function update() {
			ticking = false;
			if (reduceMotion.matches || compact.matches) {
				renderStatic();
				return;
			}
			var rect = story.getBoundingClientRect();
			var travel = Math.max(1, rect.height - window.innerHeight * 0.5);
			var progress = (window.innerHeight * 0.68 - rect.top) / travel;
			progress = Math.min(1, Math.max(0, progress));
			story.style.setProperty('--evidence-progress', progress.toFixed(4));
			var active = Math.min(steps.length - 1, Math.floor(progress * steps.length));
			steps.forEach(function (step, index) {
				step.classList.toggle('is-active', index <= active);
			});
		}

		window.addEventListener('scroll', function () {
			if (!ticking) { ticking = true; requestAnimationFrame(update); }
		}, { passive: true });
		window.addEventListener('resize', update);
		if (compact.addEventListener) { compact.addEventListener('change', update); }
		update();
	}

	/* ----------------------------------------------------------
	   6 · HERO TITLE
	   Header text stays in its authored DOM shape. Motion is intentionally
	   disabled so the complete title is present immediately.
	   ---------------------------------------------------------- */
	function initHeroTitle() {
		var title = document.getElementById('heroTitle');
		if (!title) { return; }
		title.setAttribute('aria-label', title.textContent.replace(/\s+/g, ' ').trim());
		/* Header motion is intentionally disabled. Keep the authored text in its
		   original DOM shape so it renders immediately and remains selectable. */
	}

	/* ----------------------------------------------------------
	   7 · HERO TICKER
	   Vertical reel; last item duplicates the first so the reset
	   jump is invisible.
	   ---------------------------------------------------------- */
	function initTicker() {
		var reel = document.getElementById('tickerReel');
		if (!reel || reduceMotion.matches) { return; }
		var items = reel.children.length; /* includes the duplicated first item */
		var index = 0;
		setInterval(function () {
			if (document.hidden) { return; }
			index += 1;
			if (index >= items) {
				/* snap back to 0 without transition, then resume */
				reel.style.transition = 'none';
				reel.style.transform = 'translateY(0)';
				index = 1;
				/* force reflow so the next transition animates */
				void reel.offsetHeight;
				reel.style.transition = '';
			}
			reel.style.transform = 'translateY(-' + (index * 100 / items) + '%)';
		}, 2600);
	}

	/* ----------------------------------------------------------
	   8 · MAGNETIC BUTTONS + 3D TILT CARDS (pointer:fine only)
	   Transform math done per-frame from the latest pointer
	   event; both reset cleanly on pointerleave.
	   ---------------------------------------------------------- */
	function initMagnetic() {
		if (!finePointer.matches || reduceMotion.matches) { return; }
		document.querySelectorAll('[data-magnetic]').forEach(function (el) {
			el.addEventListener('pointermove', function (e) {
				var r = el.getBoundingClientRect();
				var dx = e.clientX - (r.left + r.width / 2);
				var dy = e.clientY - (r.top + r.height / 2);
				el.style.transform = 'translate(' + (dx * 0.18).toFixed(1) + 'px,' + (dy * 0.22).toFixed(1) + 'px)';
			});
			el.addEventListener('pointerleave', function () {
				el.style.transform = '';
			});
		});
	}

	function initTilt() {
		if (!finePointer.matches || reduceMotion.matches) { return; }
		var MAX_DEG = 8;
		var activeCard = null;
		var resetters = new Map();

		document.querySelectorAll('[data-tilt]').forEach(function (card) {
			var rect = null;

			card.addEventListener('pointerenter', function () {
				rect = card.getBoundingClientRect();
				card.classList.add('is-tilting');
			});

			card.addEventListener('pointermove', function (e) {
				if (activeCard && activeCard !== card) {
					var previousReset = resetters.get(activeCard);
					if (previousReset) { previousReset(); }
				}
				activeCard = card;
				card.classList.add('is-tilting');
				if (!rect) { rect = card.getBoundingClientRect(); }
				var px = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
				var py = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
				var rx = (0.5 - py) * MAX_DEG * 2;
				var ry = (px - 0.5) * MAX_DEG * 2;
				card.style.transform =
					'rotateX(' + rx.toFixed(2) + 'deg) ' +
					'rotateY(' + ry.toFixed(2) + 'deg) ' +
					'scale(1.012)';
				card.style.setProperty('--glare-x', (px * 100).toFixed(1) + '%');
				card.style.setProperty('--glare-y', (py * 100).toFixed(1) + '%');
			});

			function reset() {
				rect = null;
				if (activeCard === card) { activeCard = null; }
				card.classList.remove('is-tilting');
				card.style.transform = '';
				card.style.setProperty('--glare-x', '50%');
				card.style.setProperty('--glare-y', '50%');
			}

			card.addEventListener('pointerleave', reset);
			card.addEventListener('pointercancel', reset);
			resetters.set(card, reset);
			window.addEventListener('resize', function () { rect = null; }, { passive: true });
		});

		document.addEventListener('pointermove', function (e) {
			if (activeCard && !e.target.closest('[data-tilt]')) {
				var reset = resetters.get(activeCard);
				if (reset) { reset(); }
			}
		}, { passive: true });

		document.addEventListener('visibilitychange', function () {
			if (!document.hidden || !activeCard) { return; }
			var reset = resetters.get(activeCard);
			if (reset) { reset(); }
		});
	}

	/* expose shared helpers to part 2 of the script */
	window.__rd = {
		cssVar: cssVar,
		reduceMotion: reduceMotion,
		finePointer: finePointer
	};

	/* boot — order matters: theme first so first paint is correct */
	initTheme();
	initNavAndProgress();
	initMobileMenu();
	initReveals();
	initTilt();
	initActiveNav();
	initCounters();
	initTimeline();
	initEvidenceThread();
})();

/* ==========================================================
     SCRIPT · PART 1b — command palette, FAQ accordion,
     copy-to-clipboard toast, Konami confetti.
     Depends only on the DOM; runs after part 1.
     ========================================================== */
(function () {
	'use strict';

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

	/* ----------------------------------------------------------
	   10 · TOAST
	   Single element reused for every notification; timer
	   resets if a new message lands while one is visible.
	   ---------------------------------------------------------- */
	var toastEl = document.getElementById('toast');
	var toastText = document.getElementById('toastText');
	var toastTimer = null;

	function toast(message) {
		if (!toastEl || !toastText) { return; }
		toastText.textContent = message;
		toastEl.classList.add('is-on');
		clearTimeout(toastTimer);
		toastTimer = setTimeout(function () {
			toastEl.classList.remove('is-on');
		}, 2600);
	}

	/* ----------------------------------------------------------
	   11 · COPY EMAIL
	   Clipboard API with a hidden-textarea fallback for older
	   browsers / non-secure contexts.
	   ---------------------------------------------------------- */
	var EMAIL = 'rossdmello896@gmail.com';

	function copyEmail() {
		function done() { toast('Email copied — ' + EMAIL); }
		function fallback() {
			var ta = document.createElement('textarea');
			ta.value = EMAIL;
			ta.setAttribute('readonly', '');
			ta.style.position = 'fixed';
			ta.style.opacity = '0';
			document.body.appendChild(ta);
			ta.select();
			try { document.execCommand('copy'); done(); }
			catch (err) { toast('Copy failed — email is ' + EMAIL); }
			document.body.removeChild(ta);
		}
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(EMAIL).then(done, fallback);
		} else {
			fallback();
		}
	}

	/* ----------------------------------------------------------
	   12 · FAQ ACCORDION
	   Native <details> handles open/close; this only enforces
	   one-open-at-a-time so the list stays scannable.
	   ---------------------------------------------------------- */
	function initFaq() {
		var items = document.querySelectorAll('.faq-item');
		items.forEach(function (item) {
			item.addEventListener('toggle', function () {
				if (!item.open) { return; }
				items.forEach(function (other) {
					if (other !== item && other.open) { other.open = false; }
				});
			});
		});
	}

	/* ----------------------------------------------------------
	   13 · COMMAND PALETTE
	   · registry of commands, each { label, kind, hint, run }
	   · subsequence fuzzy match with highlighted letters
	   · full keyboard support; focus returns to the trigger
	     element on close
	   ---------------------------------------------------------- */
	var backdrop = document.getElementById('paletteBackdrop');
	var input = document.getElementById('paletteInput');
	var list = document.getElementById('paletteList');

	function goTo(hash) {
		return function () {
			var target = document.querySelector(hash);
			if (target) {
				target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
			}
		};
	}

	function openUrl(url) {
		return function () {
			window.open(url, '_blank', 'noopener,noreferrer');
		};
	}

	var COMMANDS = [
		{ label: 'Go to About', kind: 'section', run: goTo('#about') },
		{ label: 'Go to Experience (HPCL)', kind: 'section', run: goTo('#internship') },
		{ label: 'Go to Philosophy & pipeline', kind: 'section', run: goTo('#philosophy') },
		{ label: 'Go to Projects', kind: 'section', run: goTo('#projects') },
		{ label: 'Go to Questions (FAQ)', kind: 'section', run: goTo('#faq') },
		{ label: 'Go to Colophon', kind: 'section', run: goTo('#colophon') },
		{ label: 'Go to Skills', kind: 'section', run: goTo('#skills') },
		{ label: 'Go to Achievements', kind: 'section', run: goTo('#achievements') },
		{ label: 'Go to Contact', kind: 'section', run: goTo('#contact') },
		{ label: 'Back to top', kind: 'section', run: goTo('#top') },
		{ label: 'Toggle dark / light theme', kind: 'action', run: function () {
			var toggle = document.getElementById('themeToggle');
			if (toggle) { toggle.click(); }
		} },
		{ label: 'Copy email address', kind: 'action', run: copyEmail },
		{ label: 'Open GitHub profile', kind: 'link', run: openUrl('https://github.com/RossDmello2') },
		{ label: 'Open LinkedIn profile', kind: 'link', run: openUrl('https://www.linkedin.com/in/ross-dmello-4a9035330') },
		{ label: 'Repo: HPCL Agentic Chatbot', kind: 'link', run: openUrl('https://github.com/RossDmello2/HPCL-Configurable-Agentic-Chatbot') },
		{ label: 'Repo: VoiceRAG assistant', kind: 'link', run: openUrl('https://github.com/RossDmello2/voice-rag-assistant') },
		{ label: 'Repo: VisoRAG (visualdocqa-kit)', kind: 'link', run: openUrl('https://github.com/RossDmello2/visualdocqa-kit') },
		{ label: 'Repo: n8n automation workflows', kind: 'link', run: openUrl('https://github.com/RossDmello2/n8n-automation-workflows') },
		{ label: 'Repo: local-doc-rag', kind: 'link', run: openUrl('https://github.com/RossDmello2/local-doc-rag') },
		{ label: 'Repo: Verbatim transcriber', kind: 'link', run: openUrl('https://github.com/RossDmello2/verbatim-browser-transcriber') }
	];

	/* subsequence fuzzy match; returns matched indices or null.
	   Contiguous runs score better so 'proj' prefers 'Projects'. */
	function fuzzy(query, text) {
		var q = query.toLowerCase();
		var t = text.toLowerCase();
		var indices = [];
		var ti = 0;
		var score = 0;
		var streak = 0;
		for (var qi = 0; qi < q.length; qi++) {
			var found = t.indexOf(q[qi], ti);
			if (found === -1) { return null; }
			streak = (found === ti) ? streak + 1 : 1;
			score += streak * 2 - (found - ti); /* reward runs, punish gaps */
			indices.push(found);
			ti = found + 1;
		}
		return { indices: indices, score: score };
	}

	function highlight(text, indices) {
		var out = '';
		var set = {};
		indices.forEach(function (i) { set[i] = true; });
		for (var i = 0; i < text.length; i++) {
			var ch = text[i].replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;');
			out += set[i] ? '<mark>' + ch + '</mark>' : ch;
		}
		return out;
	}

	var filtered = COMMANDS.slice();
	var selected = 0;
	var lastFocus = null;

	function render() {
		if (!list) { return; }
		list.innerHTML = '';
		if (!filtered.length) {
			var empty = document.createElement('li');
			empty.className = 'palette-empty';
			empty.textContent = 'No matching command — try “github”, “theme”, or a section name.';
			list.appendChild(empty);
			return;
		}
		filtered.forEach(function (entry, i) {
			var li = document.createElement('li');
			li.setAttribute('role', 'presentation');
			var btn = document.createElement('button');
			btn.type = 'button';
			btn.className = 'palette-item' + (i === selected ? ' is-selected' : '');
			btn.setAttribute('role', 'option');
			btn.setAttribute('aria-selected', i === selected ? 'true' : 'false');
			var icon = '<svg class="p-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
				(entry.kind === 'section'
					? '<path d="M5 12h14M13 6l6 6-6 6"/>'
					: entry.kind === 'action'
						? '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>'
						: '<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5"/>') +
				'</svg>';
			btn.innerHTML = icon +
				'<span>' + (entry.match ? highlight(entry.label, entry.match) : entry.label) + '</span>' +
				'<span class="p-kind">' + entry.kind + '</span>';
			btn.addEventListener('click', function () {
				run(entry);
			});
			btn.addEventListener('pointerenter', function () {
				selected = i;
				paintSelection();
			});
			li.appendChild(btn);
			list.appendChild(li);
		});
	}

	function paintSelection() {
		if (!list) { return; }
		var items = list.querySelectorAll('.palette-item');
		items.forEach(function (el, i) {
			el.classList.toggle('is-selected', i === selected);
			el.setAttribute('aria-selected', i === selected ? 'true' : 'false');
		});
		var active = items[selected];
		if (active && active.scrollIntoView) {
			active.scrollIntoView({ block: 'nearest' });
		}
	}

	function applyFilter() {
		var q = (input && input.value || '').trim();
		if (!q) {
			filtered = COMMANDS.map(function (c) { c.match = null; return c; });
		} else {
			filtered = [];
			COMMANDS.forEach(function (c) {
				var m = fuzzy(q, c.label);
				if (m) {
					c.match = m.indices;
					c.score = m.score;
					filtered.push(c);
				}
			});
			filtered.sort(function (a, b) { return b.score - a.score; });
		}
		selected = 0;
		render();
	}

	function isOpen() {
		return backdrop && backdrop.classList.contains('is-open');
	}

	function openPalette() {
		if (!backdrop || !input) { return; }
		lastFocus = document.activeElement;
		if (!lastFocus || lastFocus === document.body || backdrop.contains(lastFocus)) {
			lastFocus = document.getElementById('themeToggle') || document.querySelector('.nav-brand');
		}
		backdrop.setAttribute('aria-hidden', 'false');
		if ('inert' in backdrop) { backdrop.inert = false; }
		backdrop.classList.add('is-open');
		input.value = '';
		applyFilter();
		setTimeout(function () {
			if (isOpen()) { input.focus({ preventScroll: true }); }
		}, 50);
	}

	function closePalette() {
		if (!backdrop) { return; }
		backdrop.classList.remove('is-open');
		backdrop.setAttribute('aria-hidden', 'true');
		if ('inert' in backdrop) { backdrop.inert = true; }
		var fallback = document.getElementById('themeToggle') || document.querySelector('.nav-brand');
		var target = lastFocus && lastFocus.isConnected && !backdrop.contains(lastFocus) ? lastFocus : fallback;
		if (target && target.focus) { target.focus(); }
	}

	function run(entry) {
		closePalette();
		/* run after the close paint so smooth-scroll isn't fighting the overlay */
		setTimeout(entry.run, 30);
	}

	function initPalette() {
		if (!backdrop || !input || !list) { return; }
		backdrop.setAttribute('aria-hidden', 'true');
		if ('inert' in backdrop) { backdrop.inert = true; }

		document.addEventListener('keydown', function (e) {
			var inField = /^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement || {}).tagName || '') ||
				(document.activeElement && document.activeElement.isContentEditable);

			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
				e.preventDefault();
				isOpen() ? closePalette() : openPalette();
				return;
			}
			if (e.key === '/' && !isOpen() && !inField) {
				e.preventDefault();
				openPalette();
				return;
			}
			if (!isOpen()) { return; }
			if (e.key === 'Escape') {
				e.preventDefault();
				closePalette();
			} else if (e.key === 'Tab') {
				var focusable = Array.prototype.slice.call(backdrop.querySelectorAll('input, button:not([disabled]), a[href]'))
					.filter(function (el) { return el.getClientRects().length > 0; });
				if (!focusable.length) { return; }
				var first = focusable[0];
				var last = focusable[focusable.length - 1];
				if (e.shiftKey && document.activeElement === first) {
					e.preventDefault();
					last.focus();
				} else if (!e.shiftKey && document.activeElement === last) {
					e.preventDefault();
					first.focus();
				}
			} else if (e.key === 'ArrowDown') {
				e.preventDefault();
				if (filtered.length) { selected = (selected + 1) % filtered.length; paintSelection(); }
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				if (filtered.length) { selected = (selected - 1 + filtered.length) % filtered.length; paintSelection(); }
			} else if (e.key === 'Enter') {
				e.preventDefault();
				if (filtered[selected]) { run(filtered[selected]); }
			}
		});

		input.addEventListener('input', applyFilter);

		backdrop.addEventListener('click', function (e) {
			if (e.target === backdrop) { closePalette(); }
		});
	}

	/* ----------------------------------------------------------
	   14 · KONAMI CONFETTI
	   ↑↑↓↓←→←→BA — a burst of palette-colored rectangles with
	   simple gravity physics. The canvas is cleared and the loop
	   fully stops when the last particle falls off screen.
	   ---------------------------------------------------------- */
	function initKonami() {
		var canvas = document.getElementById('confettiCanvas');
		if (!canvas || reduceMotion.matches) { return; }
		var SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
		var pos = 0;
		var busy = false;

		document.addEventListener('keydown', function (e) {
			var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
			pos = (key === SEQUENCE[pos]) ? pos + 1 : (key === SEQUENCE[0] ? 1 : 0);
			if (pos === SEQUENCE.length) {
				pos = 0;
				if (!busy) { burst(); }
			}
		});

		function burst() {
			var ctx = canvas.getContext('2d');
			if (!ctx) { return; }
			busy = true;
			var dpr = Math.min(2, window.devicePixelRatio || 1);
			var w = window.innerWidth;
			var h = window.innerHeight;
			canvas.width = w * dpr;
			canvas.height = h * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

			var colors = ['#C96442', '#E08D6D', '#4E7E5B', '#A9791C', '#29271F'];
			var parts = [];
			for (var i = 0; i < 140; i++) {
				parts.push({
					x: w / 2 + (Math.random() - 0.5) * 120,
					y: h * 0.35,
					vx: (Math.random() - 0.5) * 11,
					vy: -(4 + Math.random() * 9),
					size: 4 + Math.random() * 6,
					rot: Math.random() * 6.28,
					vr: (Math.random() - 0.5) * 0.3,
					color: colors[i % colors.length]
				});
			}

			toast('Audit passed. Have some confetti — validated, of course.');

			function frame() {
				ctx.clearRect(0, 0, w, h);
				var alive = 0;
				parts.forEach(function (p) {
					p.vy += 0.22;             /* gravity */
					p.vx *= 0.992;            /* drag */
					p.x += p.vx;
					p.y += p.vy;
					p.rot += p.vr;
					if (p.y < h + 24) {
						alive += 1;
						ctx.save();
						ctx.translate(p.x, p.y);
						ctx.rotate(p.rot);
						ctx.fillStyle = p.color;
						ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
						ctx.restore();
					}
				});
				if (alive > 0 && !document.hidden) {
					requestAnimationFrame(frame);
				} else {
					ctx.clearRect(0, 0, w, h);
					busy = false;
				}
			}
			requestAnimationFrame(frame);
		}
	}

	initFaq();
	initPalette();
	initKonami();
})();
