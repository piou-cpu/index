const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const projectsDir = path.join(__dirname, 'projects');
const outputPath = path.join(__dirname, 'manifest.json');

const files = fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'));

const projects = files.map(file => {
  const raw = fs.readFileSync(path.join(projectsDir, file), 'utf8');
  const { data, content } = matter(raw);

  // parse comma-separated string or array for categories
  const categories = typeof data.categories === 'string'
    ? data.categories.split(',').map(t => t.trim()).filter(Boolean)
    : Array.isArray(data.categories)
    ? data.categories.map(t => String(t).trim())
    : [];

  // parse comma-separated string or array for anchors
  const anchors = typeof data.anchors === 'string'
    ? data.anchors.split(',').map(t => t.trim()).filter(Boolean)
    : Array.isArray(data.anchors)
    ? data.anchors.map(t => String(t).trim())
    : [];

  const images = Array.isArray(data.images)
    ? data.images.map(i => String(i).trim())
    : [];

  const cover = data.cover ? String(data.cover).trim() : null;

  return {
    id: file.replace('.md', ''),
    title: data.title || file.replace('.md', ''),
    date: data.date ? String(data.date) : '',
    client: data.client || '',
    categories,
    anchors,
    images,
    cover,
    body: content.trim()
  };
});

fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));
console.log(`Generated manifest with ${projects.length} projects.`);
