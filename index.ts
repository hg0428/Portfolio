import express from 'express';
import nunjucks from 'nunjucks';
import fs from 'fs'; // Import the file system module to read the file

const app = express();
const port = 8080;

// Configure Nunjucks to use the 'client' directory
nunjucks.configure('templates', {
  autoescape: true,
  express: app,
});

// Serve static files from 'client' directory
app.use(express.static('client'));

// Read the projects data from projects.json
let projects = [];
try {
  const data = fs.readFileSync('projects.json', 'utf8');
  projects = JSON.parse(data);
  // Transform each project by adding link and code fields with placeholder values
  // projects = projects.map(project => ({
  //   ...project,
  //   youtube: null
  // }));
  // // Write the transformed projects back to the projects.json file
  // fs.writeFileSync('projects.json', JSON.stringify(projects, null, 2), 'utf8');
} catch (err) {
  console.error('Error reading or writing projects.json:', err);
}

app.get('/', (req, res) => {
  res.render('index.html', { projects: projects }); // Pass the projects variable to the template
});

// Dynamic route for individual projects
app.get('/projects/:projectName', (req, res) => {
  const projectName = req.params.projectName;
  const project = projects.find(p => p.title === projectName);

  if (project) {
    res.render('project.html', { project: project });
  } else {
    res.status(404).send('Project not found');
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