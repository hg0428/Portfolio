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
	desktop.addEventListener("change", function (e) {
		if (e.matches) close();
	});

	// Initialize cleanly.
	setOpen(false);
})();
