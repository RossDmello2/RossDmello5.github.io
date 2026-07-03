/* ============================================================
   ROSS DMELLO — BRAND ENGINE
   Animated favicon: the RD tab icon carries a slowly orbiting
   dashed ring in the live accent color. Sleeps when the tab
   hides, collapses to a static icon under reduced motion, and
   re-reads the palette on every theme change.
   ============================================================ */
(function () {
	'use strict';

	var link = document.querySelector('link[rel="icon"]');
	if (!link) { return; }

	var canvas = document.createElement('canvas');
	canvas.width = 64;
	canvas.height = 64;
	var ctx = canvas.getContext('2d');
	if (!ctx) { return; }

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	var docEl = document.documentElement;
	var offset = 0;
	var timer = null;

	function cssVar(name, fallback) {
		var v = getComputedStyle(docEl).getPropertyValue(name).trim();
		return v || fallback;
	}

	function draw() {
		var accent = cssVar('--accent', '#FF6A3C');
		var ink = cssVar('--ink', '#E9ECF4');
		var bg = cssVar('--canvas', '#0B0D12');

		ctx.clearRect(0, 0, 64, 64);

		/* plate */
		ctx.beginPath();
		if (ctx.roundRect) { ctx.roundRect(6, 6, 52, 52, 14); }
		else { ctx.rect(6, 6, 52, 52); }
		ctx.fillStyle = bg;
		ctx.fill();

		/* monogram */
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.font = '700 24px "JetBrains Mono", Menlo, monospace';
		ctx.fillStyle = ink;
		ctx.fillText('R', 25, 34);
		ctx.fillStyle = accent;
		ctx.fillText('D', 42, 34);

		/* orbiting dashed ring */
		ctx.strokeStyle = accent;
		ctx.lineWidth = 3.5;
		ctx.setLineDash([7, 8]);
		ctx.lineDashOffset = -offset;
		ctx.beginPath();
		ctx.arc(32, 32, 27, 0, Math.PI * 2);
		ctx.stroke();
		ctx.setLineDash([]);

		try { link.href = canvas.toDataURL('image/png'); } catch (err) { stop(); }
	}

	function tick() {
		offset = (offset + 2.5) % 60;
		draw();
	}

	function start() {
		if (timer || reduceMotion.matches) { return; }
		timer = window.setInterval(tick, 160);
	}

	function stop() {
		if (timer) { window.clearInterval(timer); timer = null; }
	}

	document.addEventListener('visibilitychange', function () {
		if (document.hidden) { stop(); } else { draw(); start(); }
	});

	window.addEventListener('rd:theme', draw);

	draw();
	start();
})();
