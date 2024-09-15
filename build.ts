import { ClientRequest } from "http";

const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

let projects = JSON.parse(fs.readFileSync('projects.json', 'utf8'));

// Render a file template with data
nunjucks.render('templates/index.html', { projects }, function(err, res) {
    if (err) {
        console.error(err);
    } else {
        fs.writeFileSync('client/index.html', res);
    }
});
for (let project of projects) {
    nunjucks.render("templates/project.html", {project}, (err, res) => {
        if (err) {
            console.error(err);
        } else {
            fs.writeFileSync(`client/projects/${project.title}.html`, res);
        }
    })
}