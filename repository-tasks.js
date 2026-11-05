// Deliberately support only Markdown task lists; render task text as plain text.
export function parseTaskMarkdown(markdown) {
  const tasks = [];
  const stack = [{ indent: -1, children: tasks }];
  let fenced = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) { fenced = !fenced; continue; }
    if (fenced) continue;
    const match = line.match(/^(\s*)(?:[-*+] |\d+\. )\[([ xX])\]\s+(.+?)\s*$/);
    if (!match) continue;
    const indent = match[1].replace(/\t/g, '  ').length;
    while (stack.length > 1 && indent <= stack.at(-1).indent) stack.pop();
    const task = { text: match[3], done: match[2].toLowerCase() === 'x', children: [] };
    stack.at(-1).children.push(task);
    stack.push({ indent, children: task.children });
  }
  return tasks;
}

function renderTasks(tasks, container, prefix = '') {
  tasks.forEach((task, index) => {
    const number = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
    const entry = document.createElement('li');
    const row = document.createElement('div');
    row.className = 'todo-numbered-row';
    const marker = document.createElement('span');
    marker.textContent = `${number}.`;
    const text = document.createElement('span');
    text.textContent = task.text;
    if (task.done) {
      text.className = 'todo-completed';
      entry.setAttribute('aria-label', `${number}. Completed: ${task.text}`);
    }
    row.append(marker, text);
    entry.append(row);
    if (task.children.length) {
      const children = document.createElement('ol');
      children.className = 'todo-numbered';
      renderTasks(task.children, children, number);
      entry.append(children);
    }
    container.append(entry);
  });
}

export function createRepositoryPanel(figure, source) {
  const local = source.startsWith('/__preview/');
  const panel = document.createElement('details');
  panel.className = 'todo-panel';
  const summary = document.createElement('summary');
  summary.textContent = 'to do';
  summary.setAttribute('aria-label', `To do: ${figure.getAttribute('aria-label') || figure.id}`);
  const content = document.createElement('div');
  content.className = 'todo-content';
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  const list = document.createElement('ol');
  list.className = 'todo-numbered';
  content.append(status, list);
  panel.append(summary, content);
  let loading = false;
  let hasLoaded = false;
  async function load() {
    if (loading) return;
    loading = true;
    status.hidden = false;
    status.textContent = local ? 'Loading local tasks…' : 'Loading tasks… the app may need a moment to wake up.';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch(source, { cache: 'no-store', credentials: 'omit', signal: controller.signal });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const markdown = await response.text();
      // An HTML error/login page must not be mistaken for an empty task list.
      if (/^\s*</.test(markdown)) throw new Error('Expected Markdown');
      const tasks = parseTaskMarkdown(markdown);
      list.replaceChildren();
      renderTasks(tasks, list);
      hasLoaded = true;
      status.textContent = tasks.length ? '' : 'No tasks listed yet.';
      status.hidden = Boolean(tasks.length);
    } catch {
      status.textContent = hasLoaded
        ? 'Could not refresh. Showing the last list loaded in this view; close and reopen the list to try again.'
        : (local
          ? 'Local tasks are unavailable. Check the project Markdown file and restart the local preview server.'
          : 'Published tasks are unavailable. The app may be waking up, or its task-list update may not be deployed yet. Close and reopen the list to try again.');
    } finally {
      clearTimeout(timeout);
      loading = false;
    }
  }
  panel.addEventListener('toggle', () => { if (panel.open) load(); });
  return panel;
}
