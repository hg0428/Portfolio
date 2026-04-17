import { ClientRequest } from "http";
import { spawnSync } from "node:child_process";

const nunjucks = require("nunjucks");
const fs = require("fs");
const path = require("path");

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

// Add encodedTitle for URL-safe linking
projects = projects.map((project: any) => ({
	...project,
	encodedTitle: project.title.replaceAll(" ", "-"),
}));

// Render a file template with data
nunjucks.render("templates/index.html", { projects }, function (err, res) {
	if (err) {
		console.error(err);
	} else {
		fs.writeFileSync("client/index.html", res);
	}
});
function makeDir(dir: string) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir);
	}
}
makeDir("client/projects");
for (let project of projects) {
	nunjucks.render("templates/project.html", { project }, (err, res) => {
		if (err) {
			console.error(err);
		} else {
			let f = `client/projects/${project.title.replaceAll(" ", "-")}.html`;
			fs.writeFileSync(f, res);
		}
	});
}
