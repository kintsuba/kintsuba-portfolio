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

  return {
    ...data,
    description: match[2].trim().replace(/\s+/g, ' '),
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function projectCard(project, index) {
  const hostname = new URL(project.url).hostname;
  const delay = `${140 + index * 90}ms`;

  return `
    <article class="project-card reveal" style="--delay: ${delay}">
      <a
        class="project-link"
        href="${escapeHtml(project.url)}"
        target="_blank"
        rel="noreferrer"
        aria-label="${escapeHtml(project.title)}を開く（新しいタブ）"
      >
        <span class="project-meta">
          <span class="status"><span class="status-dot"></span>Live project</span>
          <span class="domain">${escapeHtml(hostname)}</span>
        </span>
        <span class="project-main">
          <span>
            <span class="project-title">${escapeHtml(project.title)}</span>
            <span class="project-description">${escapeHtml(project.description)}</span>
          </span>
          <span class="arrow" aria-hidden="true">↗</span>
        </span>
        <span class="route" aria-hidden="true"><span class="route-dot"></span></span>
      </a>
    </article>
  `;
}

const projects = Object.entries(projectFiles)
  .map(([filename, source]) => parseFrontmatter(source, filename))
  .sort((a, b) => a.order - b.order);

document.querySelector('#app').innerHTML = `
  <div class="page-shell">
    <header class="site-header reveal" style="--delay: 20ms">
      <a class="wordmark" href="./" aria-label="kintsuba works トップ">
        <span class="wordmark-mark" aria-hidden="true">k</span>
        <span>kintsuba / works</span>
      </a>
      <a class="github-link" href="https://github.com/kintsuba" target="_blank" rel="noreferrer">
        GitHub <span aria-hidden="true">↗</span>
      </a>
    </header>

    <main>
      <section class="hero" aria-labelledby="page-title">
        <p class="eyebrow reveal" style="--delay: 60ms">Personal software collection</p>
        <h1 id="page-title" class="reveal" style="--delay: 90ms">
          つくったものを、<br />
          <span>使える場所へ。</span>
        </h1>
        <div class="hero-foot reveal" style="--delay: 120ms">
          <p>公開中の個人制作をまとめています。</p>
          <p class="project-count"><strong>${projects.length}</strong> projects, and counting.</p>
        </div>
      </section>

      <section class="projects" aria-labelledby="projects-title">
        <div class="section-heading reveal" style="--delay: 140ms">
          <h2 id="projects-title">Projects</h2>
          <span>Open on the web</span>
        </div>
        <div class="project-list">
          ${projects.map(projectCard).join('')}
        </div>
      </section>
    </main>

    <footer class="site-footer reveal" style="--delay: 320ms">
      <span>© ${new Date().getFullYear()} kintsuba</span>
      <span>Built for the open web.</span>
    </footer>
  </div>
`;
