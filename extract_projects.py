#!/usr/bin/env python3
import json

# Read projects.json
with open('projects.json', 'r') as f:
    projects = json.load(f)

# Generate markdown
markdown_lines = []

for project in projects:
    title = project.get('title', 'N/A')
    age = project.get('myAge', 'N/A')
    short_desc = project.get('shortDescription') or 'N/A'
    long_desc = project.get('fullDescription') or 'N/A'
    tags = project.get('tags', [])
    link = project.get('link') or 'N/A'
    
    markdown_lines.append(f"# {title}")
    markdown_lines.append(f"**Age:** {age}")
    markdown_lines.append(f"**Link:** {link}")
    markdown_lines.append(f"**Tags:** {', '.join(tags) if tags else 'N/A'}")
    markdown_lines.append("")
    markdown_lines.append(f"**Short Description:**")
    markdown_lines.append(short_desc)
    markdown_lines.append("")
    markdown_lines.append(f"**Long Description:**")
    markdown_lines.append(long_desc)
    markdown_lines.append("")
    markdown_lines.append("---")
    markdown_lines.append("")

# Write to markdown file
with open('projects.md', 'w') as f:
    f.write('\n'.join(markdown_lines))

print(f"Extracted {len(projects)} projects to projects.md")
