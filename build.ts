import { spawnSync } from "node:child_process";

const nunjucks = require("nunjucks");
const fs = require("fs");

// Configure nunjucks with `templates/` as the loader root so that
// {% extends "base.html" %} resolves correctly across all templates.
nunjucks.configure("templates", { autoescape: true });

// Tight-crop profile/brand icons so a single CSS rule can size them uniformly.
// Idempotent: does nothing when every icon is already tight.
const iconNormalize = spawnSync("bun", ["scripts/normalize-icons.ts"], {
	stdio: "inherit",
});
if (iconNormalize.status !== 0) {
	console.error("icon normalization failed");
	process.exit(iconNormalize.status ?? 1);
}

let projects = JSON.parse(fs.readFileSync("projects.json", "utf8"));
const featured = JSON.parse(fs.readFileSync("featured.json", "utf8"));
const experience = JSON.parse(fs.readFileSync("experience.json", "utf8"));
const education = JSON.parse(fs.readFileSync("education.json", "utf8"));

// Add encodedTitle for URL-safe linking
projects = projects.map((project: any) => ({
	...project,
	encodedTitle: project.title.replaceAll(" ", "-"),
}));

// Projects in projects.json are listed newest-first; the homepage shows
// only the first row as a teaser into the full archive.
const recentProjects = projects.slice(0, 3);

// Render static templates synchronously so generated pages always reflect the
// latest template state before the build process exits.
fs.writeFileSync(
	"client/index.html",
	nunjucks.render("index.html", {
		projects,
		featured,
		experience,
		education,
		recentProjects,
	}),
);
function makeDir(dir: string) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}
makeDir("client/archive");
fs.writeFileSync("client/archive/index.html", nunjucks.render("archive.html", { projects }));
makeDir("client/projects");
for (let project of projects) {
	let f = `client/projects/${project.title.replaceAll(" ", "-")}.html`;
	fs.writeFileSync(f, nunjucks.render("project.html", { project }));
}
