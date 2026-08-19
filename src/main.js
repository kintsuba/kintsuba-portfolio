import './style.css';

const projectFiles = import.meta.glob('./content/projects/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

function parseFrontmatter(source, filename) {
  const normalized = source.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    throw new Error(`${filename}: frontmatter が見つかりません。`);
  }

  const data = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    data[key] = key === 'order' ? Number(value) : value;
  }

  if (!data.title || !data.url || !Number.isFinite(data.order)) {
    throw new Error(`${filename}: title、url、order は必須です。`);
  }

  return data;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function projectItem(project) {
  return `
    <li class="project-item">
      <a
        class="project-link"
        href="${escapeHtml(project.url)}"
        target="_blank"
        rel="noreferrer"
        aria-label="${escapeHtml(project.title)}を開く（新しいタブ）"
      >
        <span class="project-copy">
          <span class="project-title">${escapeHtml(project.title)}</span>
          <span class="project-url">${escapeHtml(project.url)}</span>
        </span>
        <span class="arrow" aria-hidden="true">↗</span>
      </a>
    </li>
  `;
}

const projects = Object.entries(projectFiles)
  .map(([filename, source]) => parseFrontmatter(source, filename))
  .sort((a, b) => a.order - b.order);

document.querySelector('#app').innerHTML = `
  <div class="page-shell">
    <header class="site-header">
      <a class="site-title" href="./">Portfolio</a>
      <a class="github-link" href="https://github.com/kintsuba" target="_blank" rel="noreferrer">
        GitHub <span aria-hidden="true">↗</span>
      </a>
    </header>

    <main>
      <section class="projects" aria-labelledby="projects-title">
        <h1 id="projects-title">Projects</h1>
        <ul class="project-list">
          ${projects.map(projectItem).join('')}
        </ul>
      </section>
    </main>
  </div>
`;
