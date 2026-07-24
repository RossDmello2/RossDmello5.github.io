/* ==========================================================
   VAPOUR TITLE SYSTEM
   Each visibly rendered title line is sampled into one canvas,
   dissolves as a complete composition, then reforms before the
   next line begins. No word or terminal-glyph handoff exists.
   ========================================================== */
(function () {
	'use strict';

	var roots = Array.prototype.slice.call(document.querySelectorAll('[data-vapour-title]'));
	if (!roots.length) { return; }

	var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
	var finePointer = window.matchMedia('(pointer: fine)');
	var narrowScreen = window.matchMedia('(max-width: 700px)');
	var states = [];
	var activeState = null;
	var preferredState = null;
	var nextTimer = 0;
	var resizeTimer = 0;

	var RELEASE_WINDOW = 680;
	var PARTICLE_LIFE = 2400;
	var FORM_DURATION = 2050;
	var BETWEEN_LINES = 620;
	var BETWEEN_TITLES = 1600;

	function enabled() {
		return !reduceMotion.matches && finePointer.matches && !narrowScreen.matches;
	}

	function parseRgb(value, fallback) {
		var match = value && value.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
		return match ? { r: +match[1], g: +match[2], b: +match[3] } : fallback;
	}

	function getProfile(root) {
		if (root.id === 'heroTitle') { return 'hero'; }
		if (root.classList.contains('project-name')) { return 'project'; }
		if (root.classList.contains('intern-org')) { return 'organization'; }
		if (root.classList.contains('contact-title')) { return 'contact'; }
		return 'section';
	}

	function makeToken(content) {
		var token = document.createElement('span');
		token.className = 'vapour-title-token';
		var text = document.createElement('span');
		text.className = 'vapour-title-text';
		text.textContent = content;
		token.appendChild(text);
		return token;
	}

	function tokenize(root) {
		var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
			acceptNode: function (node) {
				if (!node.nodeValue || !node.nodeValue.trim()) { return NodeFilter.FILTER_REJECT; }
				if (node.parentElement && node.parentElement.closest('.vapour-title-token, canvas')) {
					return NodeFilter.FILTER_REJECT;
				}
				return NodeFilter.FILTER_ACCEPT;
			}
		});
		var textNodes = [];
		while (walker.nextNode()) { textNodes.push(walker.currentNode); }

		textNodes.forEach(function (node) {
			var fragment = document.createDocumentFragment();
			var parts = node.nodeValue.split(/(\s+)/);
			for (var i = 0; i < parts.length; i += 1) {
				var part = parts[i];
				if (!part) { continue; }
				if (/^\s+$/.test(part)) {
					fragment.appendChild(document.createTextNode(part));
					continue;
				}

				var followingSpace = parts[i + 1];
				var followingMark = parts[i + 2];
				if (
					followingSpace &&
					/^\s+$/.test(followingSpace) &&
					followingMark &&
					/^[\u2013\u2014-]+$/.test(followingMark)
				) {
					part += '\u00a0' + followingMark;
					i += 2;
				}
				fragment.appendChild(makeToken(part));
			}
			node.parentNode.replaceChild(fragment, node);
		});
	}

	function clearCanvas(lineState) {
		if (!lineState.ctx) { return; }
		lineState.ctx.setTransform(1, 0, 0, 1, 0, 0);
		lineState.ctx.clearRect(0, 0, lineState.canvas.width, lineState.canvas.height);
		lineState.canvas.style.opacity = '0';
	}

	function resetLine(lineState) {
		lineState.tokens.forEach(function (tokenState) {
			tokenState.token.classList.remove('is-vapouring', 'is-forming');
		});
		clearCanvas(lineState);
	}

	function removeLines(state) {
		state.lines.forEach(function (lineState) {
			resetLine(lineState);
			lineState.canvas.remove();
		});
		state.lines = [];
	}

	function groupTokensByLine(state) {
		removeLines(state);
		var groups = [];

		state.tokens.forEach(function (tokenState) {
			var rect = tokenState.text.getBoundingClientRect();
			var group = groups.find(function (candidate) {
				return Math.abs(candidate.top - rect.top) <= 2;
			});
			if (!group) {
				group = { top: rect.top, tokens: [] };
				groups.push(group);
			}
			group.tokens.push(tokenState);
		});

		groups.sort(function (a, b) { return a.top - b.top; });
		groups.forEach(function (group, index) {
			var canvas = document.createElement('canvas');
			canvas.className = 'vapour-line-canvas';
			canvas.setAttribute('aria-hidden', 'true');
			state.root.appendChild(canvas);
			state.lines.push({
				index: index,
				tokens: group.tokens,
				canvas: canvas,
				ctx: canvas.getContext('2d', { willReadFrequently: true }),
				particles: [],
				palette: [],
				buckets: [],
				dpr: 1,
				dirty: true
			});
		});
		state.index = 0;
	}

	function sampleLine(lineState) {
		var rootRect = lineState.tokens[0].token.closest('[data-vapour-title]').getBoundingClientRect();
		var rects = lineState.tokens.map(function (tokenState) {
			return tokenState.text.getBoundingClientRect();
		});
		var left = Math.min.apply(null, rects.map(function (rect) { return rect.left; }));
		var top = Math.min.apply(null, rects.map(function (rect) { return rect.top; }));
		var right = Math.max.apply(null, rects.map(function (rect) { return rect.right; }));
		var bottom = Math.max.apply(null, rects.map(function (rect) { return rect.bottom; }));
		var maxFont = Math.max.apply(null, lineState.tokens.map(function (tokenState) {
			return parseFloat(getComputedStyle(tokenState.text).fontSize) || 16;
		}));
		var padX = Math.max(28, maxFont * 0.55);
		var padY = Math.max(24, maxFont * 0.58);
		var cssLeft = left - rootRect.left - padX;
		var cssTop = top - rootRect.top - padY;
		var cssWidth = right - left + padX * 2;
		var cssHeight = bottom - top + padY * 2;
		var dpr = Math.min(1.25, Math.max(1, window.devicePixelRatio || 1));
		var canvas = lineState.canvas;
		var ctx = lineState.ctx;

		canvas.style.left = cssLeft + 'px';
		canvas.style.top = cssTop + 'px';
		canvas.style.width = cssWidth + 'px';
		canvas.style.height = cssHeight + 'px';
		canvas.width = Math.max(1, Math.round(cssWidth * dpr));
		canvas.height = Math.max(1, Math.round(cssHeight * dpr));

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.textAlign = 'left';
		ctx.textBaseline = 'alphabetic';

		lineState.tokens.forEach(function (tokenState) {
			var textRect = tokenState.text.getBoundingClientRect();
			var style = getComputedStyle(tokenState.text);
			var fontSize = parseFloat(style.fontSize);
			var font = [
				style.fontStyle,
				style.fontWeight,
				(fontSize * dpr) + 'px',
				style.fontFamily
			].join(' ');
			var ink = parseRgb(style.color, { r: 241, g: 240, b: 234 });
			var textX = (textRect.left - left + padX) * dpr;

			ctx.font = font;
			ctx.fontKerning = style.fontKerning === 'none' ? 'none' : 'normal';
			if ('letterSpacing' in ctx) {
				ctx.letterSpacing = style.letterSpacing;
			}
			var metrics = ctx.measureText(tokenState.text.textContent);
			var ascent = metrics.actualBoundingBoxAscent || fontSize * dpr * 0.76;
			var descent = metrics.actualBoundingBoxDescent || fontSize * dpr * 0.24;
			var textY = (textRect.top - top + padY) * dpr +
				(textRect.height * dpr + ascent - descent) / 2;
			ctx.fillStyle = 'rgb(' + ink.r + ',' + ink.g + ',' + ink.b + ')';
			ctx.fillText(tokenState.text.textContent, textX, textY);
		});

		var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		var step = 1;
		var particles = [];
		var palette = [];
		var paletteLookup = Object.create(null);
		for (var y = 0; y < canvas.height; y += step) {
			for (var x = 0; x < canvas.width; x += step) {
				var pixelIndex = (y * canvas.width + x) * 4;
				var alpha = pixels[pixelIndex + 3] / 255;
				if (alpha < 0.08) { continue; }
				var seedA = ((x * 17 + y * 29) % 101) / 100;
				var seedB = ((x * 31 + y * 13) % 97) / 96;
				var colorKey = pixels[pixelIndex] + ',' +
					pixels[pixelIndex + 1] + ',' + pixels[pixelIndex + 2];
				var colorIndex = paletteLookup[colorKey];
				if (colorIndex === undefined) {
					colorIndex = palette.length;
					paletteLookup[colorKey] = colorIndex;
					palette.push({
						r: pixels[pixelIndex],
						g: pixels[pixelIndex + 1],
						b: pixels[pixelIndex + 2]
					});
				}
				particles.push({
					x: x / dpr,
					y: y / dpr,
					ox: x / dpr,
					oy: y / dpr,
					r: pixels[pixelIndex],
					g: pixels[pixelIndex + 1],
					b: pixels[pixelIndex + 2],
					colorIndex: colorIndex,
					alpha: alpha,
					opacity: alpha,
					releaseAt: seedA * RELEASE_WINDOW,
					life: PARTICLE_LIFE * (0.9 + seedB * 0.1),
					vx: (seedA - 0.5) * 5,
					vy: -1.6 - seedB * 5,
					released: false
				});
			}
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		lineState.dpr = dpr;
		lineState.particles = particles;
		lineState.palette = palette;
		lineState.buckets = palette.map(function () {
			return Array.from({ length: 21 }, function () { return []; });
		});
		lineState.dirty = false;
		return particles.length > 0;
	}

	function renderLine(lineState) {
		var ctx = lineState.ctx;
		var dpr = lineState.dpr;
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, lineState.canvas.width, lineState.canvas.height);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		lineState.buckets.forEach(function (colorBuckets) {
			for (var alphaIndex = 1; alphaIndex <= 20; alphaIndex += 1) {
				colorBuckets[alphaIndex].length = 0;
			}
		});
		for (var i = 0; i < lineState.particles.length; i += 1) {
			var particle = lineState.particles[i];
			if (particle.opacity <= 0.01) { continue; }
			var alphaStep = Math.max(1, Math.min(20, Math.round(particle.opacity * 20)));
			lineState.buckets[particle.colorIndex][alphaStep].push(particle);
		}

		lineState.buckets.forEach(function (colorBuckets, colorIndex) {
			var color = lineState.palette[colorIndex];
			for (var alphaIndex = 1; alphaIndex <= 20; alphaIndex += 1) {
				var bucket = colorBuckets[alphaIndex];
				if (!bucket.length) { continue; }
				ctx.fillStyle = 'rgba(' +
					color.r + ',' + color.g + ',' + color.b + ',' + (alphaIndex / 20).toFixed(3) + ')';
				ctx.beginPath();
				for (var particleIndex = 0; particleIndex < bucket.length; particleIndex += 1) {
					var particle = bucket[particleIndex];
					ctx.rect(particle.x, particle.y, 1.08, 1.08);
				}
				ctx.fill();
			}
		});
	}

	function clearTimers() {
		if (nextTimer) {
			clearTimeout(nextTimer);
			nextTimer = 0;
		}
	}

	function stopState(state) {
		if (state.frameId) {
			cancelAnimationFrame(state.frameId);
			state.frameId = 0;
		}
		if (state.lineTimer) {
			clearTimeout(state.lineTimer);
			state.lineTimer = 0;
		}
		state.lines.forEach(resetLine);
		state.running = false;
		state.index = 0;
		if (activeState === state) { activeState = null; }
	}

	function chooseNextState() {
		if (preferredState && preferredState.visible) {
			var preferred = preferredState;
			preferredState = null;
			return preferred;
		}
		var visible = states.filter(function (state) {
			return state.visible && state.lines.length;
		});
		if (!visible.length) { return null; }
		visible.sort(function (a, b) {
			if (a.lastCompleted !== b.lastCompleted) { return a.lastCompleted - b.lastCompleted; }
			return states.indexOf(a) - states.indexOf(b);
		});
		return visible[0];
	}

	function scheduleNext(delay) {
		clearTimers();
		if (activeState || document.hidden || !enabled()) { return; }
		nextTimer = window.setTimeout(function () {
			nextTimer = 0;
			var next = chooseNextState();
			if (next) { startState(next); }
		}, delay);
	}

	function finishState(state) {
		state.lastCompleted = Date.now();
		stopState(state);
		scheduleNext(BETWEEN_TITLES);
	}

	function finishLine(state) {
		resetLine(state.lines[state.index]);
		state.frameId = 0;
		state.index += 1;
		if (state.index >= state.lines.length) {
			finishState(state);
			return;
		}
		state.lineTimer = window.setTimeout(function () {
			state.lineTimer = 0;
			beginLine(state);
		}, BETWEEN_LINES);
	}

	function beginLine(state) {
		if (activeState !== state || !state.visible || document.hidden || !enabled()) {
			stopState(state);
			scheduleNext(240);
			return;
		}

		var lineState = state.lines[state.index];
		if (lineState.dirty && !sampleLine(lineState)) {
			state.index += 1;
			if (state.index >= state.lines.length) { finishState(state); }
			else { beginLine(state); }
			return;
		}

		lineState.particles.forEach(function (particle) {
			particle.x = particle.ox;
			particle.y = particle.oy;
			particle.opacity = particle.alpha;
			particle.released = false;
		});
		lineState.tokens.forEach(function (tokenState) {
			tokenState.token.classList.add('is-vapouring');
		});
		lineState.canvas.style.opacity = '1';
		state.phase = 'dissolving';
		state.phaseStarted = performance.now();

		state.frameId = requestAnimationFrame(function tick(now) {
			state.frameId = 0;
			if (activeState !== state || !state.visible || document.hidden || !enabled()) {
				stopState(state);
				scheduleNext(240);
				return;
			}

			var elapsed = now - state.phaseStarted;
			if (state.phase === 'dissolving') {
				var totalDissolve = RELEASE_WINDOW + PARTICLE_LIFE;
				lineState.particles.forEach(function (particle) {
					if (!particle.released && elapsed >= particle.releaseAt) {
						particle.released = true;
					}
					if (particle.released) {
						var age = Math.max(0, elapsed - particle.releaseAt);
						var ageSeconds = age / 1000;
						particle.x = particle.ox + particle.vx * ageSeconds;
						particle.y = particle.oy + particle.vy * ageSeconds - 0.16 * ageSeconds * ageSeconds;
						particle.opacity = particle.alpha * Math.pow(
							Math.max(0, 1 - age / particle.life),
							0.82
						);
					}
				});
				renderLine(lineState);

				if (elapsed >= totalDissolve) {
					state.phase = 'forming';
					state.phaseStarted = now;
					lineState.tokens.forEach(function (tokenState) {
						tokenState.token.classList.add('is-forming');
					});
					lineState.particles.forEach(function (particle) {
						particle.x = particle.ox;
						particle.y = particle.oy;
						particle.opacity = 0;
						particle.released = false;
					});
				}
			} else {
				var formProgress = Math.min(1, elapsed / FORM_DURATION);
				var eased = formProgress * formProgress * (3 - 2 * formProgress);
				lineState.particles.forEach(function (particle) {
					particle.opacity = particle.alpha * eased;
				});
				renderLine(lineState);
				if (formProgress >= 1) {
					finishLine(state);
					return;
				}
			}

			state.frameId = requestAnimationFrame(tick);
		});
	}

	function startState(state) {
		if (activeState || !state.visible || !state.lines.length || document.hidden || !enabled()) {
			return;
		}
		clearTimers();
		activeState = state;
		state.running = true;
		state.index = 0;
		beginLine(state);
	}

	roots.forEach(function (root) {
		var profile = getProfile(root);
		root.setAttribute('data-vapour-profile', profile);
		tokenize(root);
		var state = {
			root: root,
			profile: profile,
			tokens: Array.prototype.slice.call(root.querySelectorAll('.vapour-title-token')).map(function (token) {
				return {
					token: token,
					text: token.querySelector('.vapour-title-text')
				};
			}),
			lines: [],
			visible: false,
			running: false,
			index: 0,
			phase: 'static',
			phaseStarted: 0,
			lastCompleted: 0,
			frameId: 0,
			lineTimer: 0
		};
		states.push(state);

		root.addEventListener('pointerenter', function () {
			if (!state.visible || !enabled()) { return; }
			preferredState = state;
			if (!activeState) { scheduleNext(0); }
		});
	});

	var observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			var state = states.find(function (candidate) { return candidate.root === entry.target; });
			if (!state) { return; }
			state.visible = entry.isIntersecting;
			if (!state.visible && activeState === state) { stopState(state); }
		});
		if (!activeState) {
			scheduleNext(roots[0].getBoundingClientRect().top < innerHeight ? 650 : 280);
		}
	}, { threshold: 0.12, rootMargin: '48px' });
	states.forEach(function (state) { observer.observe(state.root); });

	function rebuildLines() {
		clearTimers();
		if (activeState) { stopState(activeState); }
		states.forEach(function (state) { groupTokensByLine(state); });
		if (enabled()) { scheduleNext(320); }
	}

	function invalidate() {
		clearTimeout(resizeTimer);
		resizeTimer = window.setTimeout(rebuildLines, 150);
	}

	window.addEventListener('resize', invalidate, { passive: true });
	window.addEventListener('rd:theme', invalidate);
	document.addEventListener('visibilitychange', function () {
		if (document.hidden) {
			clearTimers();
			if (activeState) { stopState(activeState); }
		} else {
			scheduleNext(320);
		}
	});

	[reduceMotion, finePointer, narrowScreen].forEach(function (query) {
		if (query.addEventListener) { query.addEventListener('change', invalidate); }
		else if (query.addListener) { query.addListener(invalidate); }
	});

	if (document.fonts && document.fonts.ready) {
		document.fonts.ready.then(rebuildLines);
	} else {
		rebuildLines();
	}
})();
