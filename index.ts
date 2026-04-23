import express from "express";
import nunjucks from "nunjucks";
import fs from "fs"; // Import the file system module to read the file

const app = express();
const port = 8080;

// Configure Nunjucks to use the 'client' directory
nunjucks.configure("templates", {
	autoescape: true,
	express: app,
});

// Serve static files from 'client' directory
app.use(express.static("client"));

// Read the projects data from projects.json
let projects: any[] = [];
let featured: any[] = [];
let experience: any[] = [];
let education: any[] = [];
try {
	projects = JSON.parse(fs.readFileSync("projects.json", "utf8"));
	featured = JSON.parse(fs.readFileSync("featured.json", "utf8"));
	experience = JSON.parse(fs.readFileSync("experience.json", "utf8"));
	education = JSON.parse(fs.readFileSync("education.json", "utf8"));
} catch (err) {
	console.error("Error reading data files:", err);
}

app.get("/", (req, res) => {
	const recentProjects = projects.slice(0, 3);
	res.render("index.html", {
		projects,
		featured,
		experience,
		education,
		recentProjects,
	});
});

// Dynamic route for individual projects
app.get("/projects/:projectName", (req, res) => {
	const projectName = req.params.projectName.removeSuffix(".html");
	const project = projects.find((p) => p.title === projectName);

	if (project) {
		res.render("project.html", { project: project });
	} else {
		res.status(404).send("Project not found");
	}
});

// Start Express server
app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port} !`);
});

/*
Projects to add:
- [ ] Split Aardvark up into it's separate parts: Original, Bytecode, 1.0 Interpretter, and 1.0 Compiler.
- [ ] Add my custom LLM library.
- [ ] Add the rest of my CS50 projects.
*/
