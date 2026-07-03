
/* ==========================================================
     SCRIPT · PART 2 — the three motion engines
       A · hero gradient-mesh canvas (ambient, noise-driven)
       B · pipeline packet simulation (the philosophy, animated)
       C · terminal log replay (frame-by-frame, like a recording)
     Shared rules: DPR capped at 2, pause when tab hidden or
     element offscreen, debounced resize, reduced-motion exits
     before any rAF starts.
     ========================================================== */
(function () {
	'use strict';

	var shared = window.__rd || {};
	var reduceMotion = shared.reduceMotion || window.matchMedia('(prefers-reduced-motion: reduce)');
	var cssVar = shared.cssVar || function (n, f) {
		var v = getComputedStyle(document.documentElement).getPropertyValue(n).trim();
		return v || f;
	};

	function sizeCanvas(canvas, ctx) {
		var dpr = Math.min(2, window.devicePixelRatio || 1);
		var rect = canvas.getBoundingClientRect();
		if (rect.width === 0 || rect.height === 0) { return false; }
		canvas.width = Math.round(rect.width * dpr);
		canvas.height = Math.round(rect.height * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		return true;
	}

	function debounce(fn, ms) {
		var t = null;
		return function () {
			clearTimeout(t);
			t = setTimeout(fn, ms);
		};
	}

	/* observe visibility so engines sleep when scrolled away */
	function whenVisible(el, onChange) {
		if (!('IntersectionObserver' in window)) { onChange(true); return; }
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) { onChange(entry.isIntersecting); });
		}, { threshold: 0.05 });
		io.observe(el);
	}

	/* ----------------------------------------------------------
	   A · HERO GRADIENT MESH
	   Five warm radial blobs drift on smooth pseudo-noise paths
	   (sums of incommensurate sine waves — organic, never
	   repeating visibly). Painted with 'lighter'-free simple
	   compositing so light and dark palettes both stay soft.
	   ---------------------------------------------------------- */
	function initHeroMesh() {
		var canvas = document.getElementById('heroCanvas');
		if (!canvas || reduceMotion.matches) { return; } /* static .hero-fallback stays */
		var ctx = canvas.getContext('2d');
		if (!ctx) { return; }

		var running = true;
		var visible = true;
		var raf = null;

		/* blob field: phase offsets chosen so paths never sync */
		var blobs = [
			{ r: 0.52, sx: 0.23, sy: 0.31, fx: 0.061, fy: 0.043, px: 0.0, py: 2.1, a: 0.55 },
			{ r: 0.44, sx: 0.71, sy: 0.22, fx: 0.049, fy: 0.067, px: 1.3, py: 0.4, a: 0.42 },
			{ r: 0.38, sx: 0.55, sy: 0.72, fx: 0.073, fy: 0.052, px: 2.9, py: 1.7, a: 0.38 },
			{ r: 0.60, sx: 0.85, sy: 0.65, fx: 0.041, fy: 0.058, px: 4.2, py: 3.3, a: 0.30 },
			{ r: 0.33, sx: 0.12, sy: 0.78, fx: 0.056, fy: 0.071, px: 5.6, py: 0.9, a: 0.34 }
		];

		var palette = { blob: '201, 100, 66', wash: '201, 100, 66' };

		function readPalette() {
			palette.blob = cssVar('--accent-rgb', '201, 100, 66');
		}
		readPalette();
		window.addEventListener('rd:theme', readPalette);

		function frame(ts) {
			raf = null;
			if (!running || !visible || document.hidden) { return; }
			var w = canvas.getBoundingClientRect().width;
			var h = canvas.getBoundingClientRect().height;
			var t = ts * 0.001;

			ctx.clearRect(0, 0, w, h);

			for (var i = 0; i < blobs.length; i++) {
				var b = blobs[i];
				/* two-octave sine drift — smooth, organic wander */
				var x = (b.sx + 0.16 * Math.sin(t * b.fx * 6.28 + b.px) + 0.07 * Math.sin(t * b.fx * 15.1 + b.py)) * w;
				var y = (b.sy + 0.14 * Math.cos(t * b.fy * 6.28 + b.py) + 0.06 * Math.cos(t * b.fy * 13.7 + b.px)) * h;
				var radius = b.r * Math.min(w, h) * (1 + 0.06 * Math.sin(t * 0.35 + i));
				var g = ctx.createRadialGradient(x, y, 0, x, y, radius);
				g.addColorStop(0, 'rgba(' + palette.blob + ',' + (0.14 * b.a).toFixed(3) + ')');
				g.addColorStop(0.55, 'rgba(' + palette.blob + ',' + (0.05 * b.a).toFixed(3) + ')');
				g.addColorStop(1, 'rgba(' + palette.blob + ',0)');
				ctx.fillStyle = g;
				ctx.beginPath();
				ctx.arc(x, y, radius, 0, 6.2832);
				ctx.fill();
			}
			raf = requestAnimationFrame(frame);
		}

		function wake() { if (raf === null) { raf = requestAnimationFrame(frame); } }

		if (!sizeCanvas(canvas, ctx)) { return; }
		window.addEventListener('resize', debounce(function () { sizeCanvas(canvas, ctx); wake(); }, 150));
		document.addEventListener('visibilitychange', function () { if (!document.hidden) { wake(); } });
		whenVisible(canvas, function (v) { visible = v; if (v) { wake(); } });
		wake();
	}

	/* ----------------------------------------------------------
	   B · PIPELINE PACKET SIMULATION
	   Six stations; packets spawn at Trigger and ease station to
	   station. ~1 in 4 packets is malformed: at Validate it turns
	   amber and diverts to the manual-review siding. Valid ones
	   turn green at Persist. This is a tiny discrete-event sim,
	   not a looping GIF — every run is different.
	   ---------------------------------------------------------- */
	function initPipeline() {
		var canvas = document.getElementById('pipelineCanvas');
		if (!canvas) { return; }
		var ctx = canvas.getContext('2d');
		if (!ctx) { return; }

		var STAGES = ['trigger', 'validate', 'route', 'execute', 'persist', 'observe'];
		var visible = true;
		var raf = null;
		var packets = [];
		var spawnAt = 0;
		var layout = null;

		var colors = {
			ink: '#6F6A5E', box: '#F3F0E9', edge: '#CFC9BA',
			valid: '#C96442', bad: '#A9791C', done: '#4E7E5B', label: '#29271F'
		};

		function readPalette() {
			colors.ink = cssVar('--ink-3', colors.ink);
			colors.box = cssVar('--surface', colors.box);
			colors.edge = cssVar('--border-strong', colors.edge);
			colors.label = cssVar('--ink', colors.label);
			colors.valid = cssVar('--accent', colors.valid);
		}
		readPalette();
		window.addEventListener('rd:theme', readPalette);

		function computeLayout() {
			var rect = canvas.getBoundingClientRect();
			var w = rect.width, h = rect.height;
			var compact = w < 640;
			var mainY = compact ? h * 0.30 : h * 0.38;
			var sideY = compact ? h * 0.74 : h * 0.78;
			var pad = compact ? 42 : 84; /* half a box + breathing room so end stations never clip */
			var span = w - pad * 2;
			var xs = STAGES.map(function (_, i) { return pad + span * (i / (STAGES.length - 1)); });
			return { w: w, h: h, mainY: mainY, sideY: sideY, xs: xs, compact: compact,
				boxW: compact ? 54 : 96, boxH: compact ? 30 : 40 };
		}

		function spawn(now) {
			packets.push({
				stage: 0,
				progress: 0,
				speed: 0.35 + Math.random() * 0.25, /* stages per second */
				bad: Math.random() < 0.26,
				diverted: false,
				divertP: 0,
				born: now,
				dead: false
			});
		}

		function drawStation(x, y, label, L) {
			ctx.fillStyle = colors.box;
			ctx.strokeStyle = colors.edge;
			ctx.lineWidth = 1;
			var bw = L.boxW, bh = L.boxH;
			ctx.beginPath();
			if (ctx.roundRect) { ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, 8); }
			else { ctx.rect(x - bw / 2, y - bh / 2, bw, bh); }
			ctx.fill();
			ctx.stroke();
			ctx.fillStyle = colors.label;
			ctx.font = (L.compact ? '8.5' : '11') + 'px ui-monospace, Menlo, monospace';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(label, x, y);
		}

		function frame(now) {
			raf = null;
			if (!visible || document.hidden) { return; }
			var L = layout;
			if (!L) { return; }
			ctx.clearRect(0, 0, L.w, L.h);

			/* rails */
			ctx.strokeStyle = colors.edge;
			ctx.lineWidth = 1.2;
			ctx.setLineDash([5, 5]);
			ctx.beginPath();
			ctx.moveTo(L.xs[0], L.mainY);
			ctx.lineTo(L.xs[5], L.mainY);
			ctx.stroke();
			/* diversion rail: validate down to review siding */
			ctx.beginPath();
			ctx.moveTo(L.xs[1], L.mainY);
			ctx.quadraticCurveTo(L.xs[1], L.sideY, L.xs[2], L.sideY);
			ctx.lineTo(L.xs[4], L.sideY);
			ctx.stroke();
			ctx.setLineDash([]);

			/* stations */
			for (var s = 0; s < STAGES.length; s++) { drawStation(L.xs[s], L.mainY, STAGES[s], L); }
			ctx.fillStyle = colors.ink;
			ctx.font = (L.compact ? '8.5' : '11') + 'px ui-monospace, Menlo, monospace';
			ctx.textAlign = 'center';
			ctx.fillText('manual review', (L.xs[2] + L.xs[4]) / 2, L.sideY + (L.compact ? 18 : 26));

			/* spawn cadence */
			if (now > spawnAt) {
				spawn(now);
				spawnAt = now + 700 + Math.random() * 900;
			}

			/* advance + draw packets */
			var dt = 1 / 60;
			for (var i = 0; i < packets.length; i++) {
				var p = packets[i];
				if (p.dead) { continue; }

				var x, y;
				if (p.diverted) {
					p.divertP += dt * p.speed * 0.9;
					if (p.divertP >= 1) { p.dead = true; continue; }
					/* follow the curve then the siding */
					var k = p.divertP;
					if (k < 0.4) {
						var q = k / 0.4;
						var mt = 1 - q;
						x = mt * mt * L.xs[1] + 2 * mt * q * L.xs[1] + q * q * L.xs[2];
						y = mt * mt * L.mainY + 2 * mt * q * L.sideY + q * q * L.sideY;
					} else {
						var q2 = (k - 0.4) / 0.6;
						x = L.xs[2] + (L.xs[4] - L.xs[2]) * q2;
						y = L.sideY;
					}
				} else {
					p.progress += dt * p.speed;
					if (p.progress >= 1) {
						p.progress = 0;
						p.stage += 1;
						if (p.stage === 1 && p.bad) { p.diverted = true; }
						if (p.stage >= STAGES.length - 1) { p.stage = STAGES.length - 1; }
					}
					if (p.stage >= STAGES.length - 1 && p.progress > 0.5) { p.dead = true; continue; }
					var a = L.xs[Math.min(p.stage, 5)];
					var b = L.xs[Math.min(p.stage + 1, 5)];
					/* easeInOut between stations so packets pause at boxes */
					var e = p.progress < 0.5 ? 2 * p.progress * p.progress : 1 - Math.pow(-2 * p.progress + 2, 2) / 2;
					x = a + (b - a) * e;
					y = L.mainY + Math.sin(now * 0.004 + p.born) * 1.5; /* faint bob */
				}

				var color = p.diverted ? colors.bad : (p.stage >= 4 ? colors.done : colors.valid);
				ctx.fillStyle = color;
				ctx.beginPath();
				ctx.arc(x, y, L.compact ? 3 : 4, 0, 6.2832);
				ctx.fill();
				/* motion trail */
				ctx.globalAlpha = 0.25;
				ctx.beginPath();
				ctx.arc(x - 7, y, L.compact ? 2 : 2.6, 0, 6.2832);
				ctx.fill();
				ctx.globalAlpha = 1;
			}

			/* prune dead packets occasionally */
			if (packets.length > 40) {
				packets = packets.filter(function (p) { return !p.dead; });
			}

			raf = requestAnimationFrame(frame);
		}

		function wake() { if (raf === null) { raf = requestAnimationFrame(frame); } }

		function setup() {
			if (!sizeCanvas(canvas, ctx)) { return; }
			layout = computeLayout();
		}

		setup();

		if (reduceMotion.matches) {
			/* static diagram: stations + rails, no packets, no loop */
			if (layout) {
				ctx.strokeStyle = colors.edge;
				ctx.setLineDash([5, 5]);
				ctx.beginPath();
				ctx.moveTo(layout.xs[0], layout.mainY);
				ctx.lineTo(layout.xs[5], layout.mainY);
				ctx.stroke();
				ctx.setLineDash([]);
				for (var s = 0; s < STAGES.length; s++) { drawStation(layout.xs[s], layout.mainY, STAGES[s], layout); }
			}
			return;
		}

		window.addEventListener('resize', debounce(function () { setup(); wake(); }, 150));
		document.addEventListener('visibilitychange', function () { if (!document.hidden) { wake(); } });
		whenVisible(canvas, function (v) { visible = v; if (v) { wake(); } });
		wake();
	}

	/* ----------------------------------------------------------
	   C · TERMINAL LOG REPLAY
	   Replays a real workflow-log shape frame by frame — typed
	   commands, then log lines appearing on a timed schedule,
	   like watching a screen recording. Loops with a clear pause.
	   Starts only when scrolled into view; reduced-motion gets
	   the full log printed instantly.
	   ---------------------------------------------------------- */
	function initTerminal() {
		var body = document.getElementById('terminalBody');
		if (!body) { return; }

		/* [delayMs, cssClass, text, typed?] */
		var SCRIPT = [
			[0,    't-cmd',  '$ n8n execute --workflow experience-extractor', true],
			[500,  't-dim',  'execution 4c9f · started ' , false],
			[350,  't-ok',   '[ingest]   42 PDFs matched to application rows', false],
			[420,  't-ok',   '[extract]  pdf_text ok on 39 files', false],
			[380,  't-warn', '[extract]  low-text detected on 3 files → status: manual_review', false],
			[420,  't-ok',   '[llm]      structured JSON extraction · schema validated · 0 free-text', false],
			[380,  't-ok',   '[persist]  spreadsheet updated · 39 auto-filled · 3 flagged for review', false],
			[420,  't-dim',  '[observe]  execution log archived · health check green', false],
			[500,  't-ok',   '[done]     0 confident-but-wrong outputs shipped', false],
			[900,  't-dim',  ' ', false],
			[0,    't-cmd',  '$ grep -c "manual_review" output.log', true],
			[450,  't-warn', '3   # humans see these — the pipeline does not guess', false]
		];

		function renderInstant() {
			body.textContent = '';
			SCRIPT.forEach(function (row) {
				var div = document.createElement('div');
				div.className = 't-line ' + row[1];
				div.textContent = row[2];
				body.appendChild(div);
			});
		}

		if (reduceMotion.matches) { renderInstant(); return; }

		var playing = false;

		function play() {
			if (playing) { return; }
			playing = true;
			body.textContent = '';
			var i = 0;

			function nextLine() {
				if (document.hidden) { setTimeout(nextLine, 600); return; } /* wait out hidden tabs */
				if (i >= SCRIPT.length) {
					/* hold the finished log, then replay */
					setTimeout(function () { playing = false; play(); }, 6000);
					return;
				}
				var row = SCRIPT[i];
				i += 1;
				var div = document.createElement('div');
				div.className = 't-line ' + row[1];
				body.appendChild(div);

				if (row[3]) {
					/* typed: character by character with a caret */
					var caret = document.createElement('span');
					caret.className = 'terminal-caret';
					div.appendChild(caret);
					var text = row[2];
					var c = 0;
					(function typeChar() {
						if (c < text.length) {
							div.insertBefore(document.createTextNode(text[c]), caret);
							c += 1;
							setTimeout(typeChar, 24 + Math.random() * 40);
						} else {
							div.removeChild(caret);
							setTimeout(nextLine, SCRIPT[i] ? SCRIPT[i][0] : 400);
						}
					})();
				} else {
					div.textContent = row[2];
					body.scrollTop = body.scrollHeight;
					setTimeout(nextLine, SCRIPT[i] ? SCRIPT[i][0] : 400);
				}
			}
			nextLine();
		}

		if ('IntersectionObserver' in window) {
			var io = new IntersectionObserver(function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						play();
						io.unobserve(body);
					}
				});
			}, { threshold: 0.3 });
			io.observe(body);
		} else {
			play();
		}
	}

	initHeroMesh();
	initPipeline();
	initTerminal();
})();

