/* ============================================================
   ROSS DMELLO - PROJECT FLOW ENGINE (v3.0)
   Project wires keep moving for as long as their diagram is in
   view. The browser pauses them offscreen, in hidden tabs, and
   whenever reduced motion is requested. CSS owns the animation;
   this observer owns only its lifecycle.
   ============================================================ */
(function () {
	'use strict';

	var diagrams = Array.from(document.querySelectorAll('.diagram'));
	if (!diagrams.length) { return; }

	var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	var visible = new Set();

	function sync() {
		var canMove = !document.hidden && !reducedMotion.matches;
		diagrams.forEach(function (diagram) {
			diagram.classList.toggle('is-flowing', canMove && visible.has(diagram));
		});
	}

	if ('IntersectionObserver' in window) {
		var observer = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting && entry.intersectionRatio > 0.03) {
					visible.add(entry.target);
				} else {
					visible.delete(entry.target);
				}
			});
			sync();
		}, {
			rootMargin: '80px 0px 80px',
			threshold: [0, 0.04, 0.15]
		});

		diagrams.forEach(function (diagram) { observer.observe(diagram); });
	} else {
		diagrams.forEach(function (diagram) { visible.add(diagram); });
		sync();
	}

	document.addEventListener('visibilitychange', sync);
	if (reducedMotion.addEventListener) {
		reducedMotion.addEventListener('change', sync);
	} else if (reducedMotion.addListener) {
		reducedMotion.addListener(sync);
	}
})();
