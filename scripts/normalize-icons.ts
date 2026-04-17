/**
 * Normalize profile icons so every SVG's viewBox tightly hugs its content
 * and every PNG has its transparent padding trimmed. After normalization
 * every icon can be sized with one uniform CSS rule and will appear at the
 * same optical size regardless of the original authoring conventions.
 *
 * Design principles:
 *   - Source files are NEVER modified. Originals stay immutable in their
 *     source directories.
 *   - Outputs are written to a separate "normalized" directory. Templates
 *     reference the normalized copies.
 *   - Re-running is always safe: the script reads from sources and writes
 *     deterministic outputs, so it cannot accumulate drift across runs.
 *
 * Strategy:
 *   - SVG: render to PNG at high density with sharp, alpha-trim to find the
 *     tight pixel bbox, map it back to SVG user-units using the original
 *     viewBox, then write a copy with a rewritten viewBox.
 *   - PNG: alpha-trim with sharp and write a copy.
 */

import { promises as fs } from "node:fs";
import { join, basename, dirname, relative } from "node:path";
import sharp from "sharp";

const REPO_ROOT = new URL("..", import.meta.url).pathname;

// Source directories containing profile/brand icons to normalize.
const ICON_ROOTS = [
	"client/static/Media/images/logos",
	"client/static/Media/images/simple-logos",
];

// Individual source icon files outside the icon roots.
const ICON_FILES = [
	"client/static/Media/images/envelope-fill.svg",
	"client/static/Media/images/telephone-fill.svg",
];

// All normalized outputs land here, preserving the filename from the source.
const OUTPUT_DIR = "client/static/Media/images/icons";

// Pixel dimensions used for SVG bbox detection. Fixed absolute size so the
// detection resolution does not depend on the authored SVG's viewBox. 512px
// gives sub-pixel precision for typical icon viewBoxes while keeping the
// raster step fast.
const RENDER_PIXELS = 512;

// Trim only fully transparent pixels. Non-transparent brand artwork such as
// LinkedIn's solid blue background must not be cropped into.
const TRIM_OPTS = {
	background: { r: 0, g: 0, b: 0, alpha: 0 },
	threshold: 0,
} as const;

type ViewBox = { minX: number; minY: number; w: number; h: number };

function parseViewBox(xml: string): ViewBox | null {
	const vbMatch = xml.match(/viewBox\s*=\s*"([^"]+)"/);
	if (vbMatch) {
		const parts = vbMatch[1]
			.trim()
			.split(/[\s,]+/)
			.map(Number);
		if (
			parts.length === 4 &&
			parts.every((n) => Number.isFinite(n)) &&
			parts[2] > 0 &&
			parts[3] > 0
		) {
			return { minX: parts[0], minY: parts[1], w: parts[2], h: parts[3] };
		}
	}
	const w = xml.match(/\bwidth\s*=\s*"([^"]+?)"/)?.[1];
	const h = xml.match(/\bheight\s*=\s*"([^"]+?)"/)?.[1];
	const parseNum = (s: string) => parseFloat(s.replace(/px|pt|mm|cm|in/gi, ""));
	if (w && h) {
		const wn = parseNum(w);
		const hn = parseNum(h);
		if (Number.isFinite(wn) && Number.isFinite(hn) && wn > 0 && hn > 0) {
			return { minX: 0, minY: 0, w: wn, h: hn };
		}
	}
	return null;
}

function setViewBox(xml: string, vb: string): string {
	if (/viewBox\s*=\s*"[^"]*"/.test(xml)) {
		return xml.replace(/viewBox\s*=\s*"[^"]*"/, `viewBox="${vb}"`);
	}
	return xml.replace(/<svg\b([^>]*)>/, `<svg$1 viewBox="${vb}">`);
}

function round(n: number, precision = 4): number {
	return Number(n.toFixed(precision));
}

async function normalizeSvg(
	sourcePath: string,
	outPath: string,
): Promise<void> {
	const xml = await fs.readFile(sourcePath, "utf-8");
	const vb = parseViewBox(xml);
	if (!vb) {
		// No viewBox and no resolvable width/height. Copy through unchanged.
		await fs.writeFile(outPath, xml, "utf-8");
		return;
	}

	// Render to a fixed absolute pixel size proportional to the viewBox aspect
	// ratio. This keeps the detection resolution constant regardless of the
	// source's authored dimensions and prevents feedback loops that depend on
	// sharp's density-based sizing.
	const aspect = vb.w / vb.h;
	const renderW =
		aspect >= 1 ? RENDER_PIXELS : Math.round(RENDER_PIXELS * aspect);
	const renderH =
		aspect >= 1 ? Math.round(RENDER_PIXELS / aspect) : RENDER_PIXELS;

	const rendered = await sharp(Buffer.from(xml, "utf-8"))
		.resize(renderW, renderH, {
			fit: "fill",
			background: { r: 0, g: 0, b: 0, alpha: 0 },
		})
		.png()
		.toBuffer({ resolveWithObject: true });
	const renderedW = rendered.info.width;
	const renderedH = rendered.info.height;

	let px = 0;
	let py = 0;
	let pw = renderedW;
	let ph = renderedH;
	try {
		const trimmed = await sharp(rendered.data)
			.trim(TRIM_OPTS)
			.toBuffer({ resolveWithObject: true });
		// sharp reports trimOffset{Left,Top} as the coordinate shift applied to
		// the image (negative when pixels are removed from the top/left). Negate
		// to recover the actual pixel-offset-from-origin of the trimmed bbox.
		px = -(trimmed.info.trimOffsetLeft ?? 0);
		py = -(trimmed.info.trimOffsetTop ?? 0);
		pw = trimmed.info.width;
		ph = trimmed.info.height;
	} catch {
		// sharp.trim throws for images where nothing can be trimmed or the
		// image is entirely transparent. In either case keep the original box.
		await fs.writeFile(outPath, xml, "utf-8");
		return;
	}

	// Map pixel bbox back to SVG user units via the original viewBox.
	const newMinX = vb.minX + (px / renderedW) * vb.w;
	const newMinY = vb.minY + (py / renderedH) * vb.h;
	const newW = (pw / renderedW) * vb.w;
	const newH = (ph / renderedH) * vb.h;

	// Safety check: refuse to write a degenerate viewBox.
	if (
		newW <= 0 ||
		newH <= 0 ||
		!Number.isFinite(newW) ||
		!Number.isFinite(newH)
	) {
		await fs.writeFile(outPath, xml, "utf-8");
		return;
	}

	const newVB = [newMinX, newMinY, newW, newH].map((n) => round(n)).join(" ");
	const updated = setViewBox(xml, newVB);
	await fs.writeFile(outPath, updated, "utf-8");
}

async function normalizePng(
	sourcePath: string,
	outPath: string,
): Promise<void> {
	const original = await fs.readFile(sourcePath);
	try {
		const trimmed = await sharp(original).trim(TRIM_OPTS).toBuffer();
		await fs.writeFile(outPath, trimmed);
	} catch {
		// Nothing to trim (e.g. image has no transparent border). Copy as-is.
		await fs.writeFile(outPath, original);
	}
}

async function collectSources(): Promise<string[]> {
	const out: string[] = [];
	for (const dir of ICON_ROOTS) {
		const abs = join(REPO_ROOT, dir);
		let entries: string[] = [];
		try {
			entries = await fs.readdir(abs);
		} catch {
			continue;
		}
		for (const name of entries) {
			const p = join(abs, name);
			const st = await fs.stat(p);
			if (st.isFile()) out.push(p);
		}
	}
	for (const file of ICON_FILES) {
		out.push(join(REPO_ROOT, file));
	}
	return out;
}

async function main() {
	const outAbs = join(REPO_ROOT, OUTPUT_DIR);
	await fs.mkdir(outAbs, { recursive: true });

	const sources = await collectSources();
	let wrote = 0;
	let skipped = 0;
	let failed = 0;

	for (const sourcePath of sources) {
		const ext = basename(sourcePath).toLowerCase().split(".").pop();
		if (ext !== "svg" && ext !== "png") {
			skipped++;
			continue;
		}
		const outPath = join(outAbs, basename(sourcePath));
		try {
			if (ext === "svg") {
				await normalizeSvg(sourcePath, outPath);
			} else {
				await normalizePng(sourcePath, outPath);
			}
			wrote++;
		} catch (err) {
			failed++;
			const rel = relative(REPO_ROOT, sourcePath);
			console.error(`  FAILED   ${rel}:`, err);
		}
	}

	console.log(
		`normalize-icons: wrote ${wrote}, skipped ${skipped}, failed ${failed} -> ${OUTPUT_DIR}/`,
	);
	if (failed > 0) process.exit(1);
}

main();
