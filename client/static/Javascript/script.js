/* -------------------------------------------------------------------------
 * Mobile navigation: click-to-toggle drawer, Escape to close, backdrop/link
 * taps close, auto-close on viewport resize above the mobile breakpoint.
 * Visual state is driven by [data-nav-open] on <body> (see style.css).
 * ------------------------------------------------------------------------- */
(function () {
	const toggle = document.querySelector(".nav-toggle");
	const drawer = document.getElementById("mobile-nav");
	const backdrop = document.querySelector(".nav-backdrop");
	if (!toggle || !drawer) return;

	const body = document.body;
	const desktop = window.matchMedia("(min-width: 800px)");

	function setOpen(open) {
		body.dataset.navOpen = open ? "true" : "false";
		toggle.setAttribute("aria-expanded", open ? "true" : "false");
		toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
	}

	function close() {
		setOpen(false);
	}

	toggle.addEventListener("click", function () {
		const isOpen = toggle.getAttribute("aria-expanded") === "true";
		setOpen(!isOpen);
	});

	if (backdrop) backdrop.addEventListener("click", close);

	drawer.querySelectorAll("a").forEach(function (link) {
		link.addEventListener("click", close);
	});

	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") close();
	});

	// Close if the viewport grows past the mobile breakpoint while the drawer
	// is open, otherwise the scroll lock would persist on desktop.
	function handleViewportChange(e) {
		if (e.matches) close();
	}
	if (typeof desktop.addEventListener === "function") {
		desktop.addEventListener("change", handleViewportChange);
	} else if (typeof desktop.addListener === "function") {
		desktop.addListener(handleViewportChange);
	}

	// Initialize cleanly.
	setOpen(false);
})();

/* -------------------------------------------------------------------------
 * Archive search: filters static project cards by title, description, or
 * tag text and keeps the query reflected in ?q= for shareable links.
 * ------------------------------------------------------------------------- */
(function () {
	const input = document.getElementById("archive-search");
	const sortSelect = document.getElementById("archive-sort");
	const summary = document.getElementById("archive-search-summary");
	const emptyState = document.getElementById("archive-empty-state");
	const list = document.getElementById("projects-list-wrapper");
	const cards = Array.from(document.querySelectorAll(".archive-card"));
	if (!input || !sortSelect || !summary || !list || cards.length === 0) return;

	const validSorts = new Set([
		"relevance",
		"newest",
		"oldest",
		"title-asc",
		"title-desc",
	]);

	const indexedCards = cards.map(function (card) {
		const titleElement = card.querySelector(".card-title");
		const descriptionElement = card.querySelector(".project-description");
		const title = titleElement ? titleElement.textContent.trim() : "";
		const description = descriptionElement
			? descriptionElement.textContent.trim()
			: "";
		const tags = card.dataset.searchTags ?? "";
		const titleLower = title.toLowerCase();
		const descriptionLower = description.toLowerCase();
		const tagsLower = tags.toLowerCase();

		return {
			card,
			title,
			titleLower,
			descriptionLower,
			tagsLower,
			searchText: `${title} ${description} ${tags}`.toLowerCase(),
			originalIndex: cards.indexOf(card),
		};
	});

	const total = indexedCards.length;
	const params = new URLSearchParams(window.location.search);
	const initialQuery = (params.get("q") ?? "").trim();
	const initialSort = validSorts.has(params.get("sort"))
		? params.get("sort")
		: "relevance";
	input.value = initialQuery;
	sortSelect.value = initialSort;

	function syncUrl(query, sort) {
		try {
			const url = new URL(window.location.href);
			if (query) {
				url.searchParams.set("q", query);
			} else {
				url.searchParams.delete("q");
			}
			if (sort && sort !== "relevance") {
				url.searchParams.set("sort", sort);
			} else {
				url.searchParams.delete("sort");
			}
			window.history.replaceState(
				{},
				"",
				`${url.pathname}${url.search}${url.hash}`,
			);
		} catch (error) {
			// Keep search functional even when the current URL cannot be rewritten.
		}
	}

	function updateSummary(visibleCount, query) {
		if (query) {
			summary.textContent = `Showing ${visibleCount} of ${total} projects for "${query}"`;
			return;
		}
		summary.textContent = `Showing all ${total} projects`;
	}

	function tokenize(query) {
		return query
			.toLowerCase()
			.split(/\s+/)
			.map(function (token) {
				return token.trim();
			})
			.filter(Boolean);
	}

	function matchesQuery(entry, normalizedQuery, tokens) {
		if (!normalizedQuery) return true;
		if (entry.searchText.includes(normalizedQuery)) return true;
		return tokens.every(function (token) {
			return entry.searchText.includes(token);
		});
	}

	function getRelevanceScore(entry, normalizedQuery, tokens) {
		if (!normalizedQuery) return 0;

		let score = 0;
		if (entry.titleLower === normalizedQuery) score += 1200;
		if (entry.titleLower.startsWith(normalizedQuery)) score += 450;
		if (entry.titleLower.includes(normalizedQuery)) score += 250;
		if (entry.tagsLower.includes(normalizedQuery)) score += 180;
		if (entry.descriptionLower.includes(normalizedQuery)) score += 90;

		tokens.forEach(function (token) {
			if (entry.titleLower.includes(token)) score += 70;
			if (entry.tagsLower.includes(token)) score += 35;
			if (entry.descriptionLower.includes(token)) score += 18;
		});

		return score;
	}

	function sortEntries(entries, sort, normalizedQuery, tokens) {
		return entries.sort(function (a, b) {
			if (sort === "oldest") {
				return b.originalIndex - a.originalIndex;
			}
			if (sort === "title-asc") {
				return a.title.localeCompare(b.title);
			}
			if (sort === "title-desc") {
				return b.title.localeCompare(a.title);
			}
			if (sort === "relevance" && normalizedQuery) {
				const scoreDiff =
					getRelevanceScore(b, normalizedQuery, tokens) -
					getRelevanceScore(a, normalizedQuery, tokens);
				if (scoreDiff !== 0) return scoreDiff;
			}
			return a.originalIndex - b.originalIndex;
		});
	}

	function render(query, sort) {
		const normalized = query.trim().toLowerCase();
		const tokens = tokenize(query);
		const matched = [];

		indexedCards.forEach(function (entry) {
			const matches = matchesQuery(entry, normalized, tokens);
			entry.card.hidden = !matches;
			if (matches) matched.push(entry);
		});

		sortEntries(matched, sort, normalized, tokens).forEach(function (entry) {
			list.appendChild(entry.card);
		});

		updateSummary(matched.length, query.trim());
		if (emptyState) emptyState.hidden = matched.length !== 0;
		syncUrl(query.trim(), sort);
	}

	input.addEventListener("input", function () {
		render(input.value, sortSelect.value);
	});

	sortSelect.addEventListener("change", function () {
		render(input.value, sortSelect.value);
	});

	render(initialQuery, initialSort);
})();
