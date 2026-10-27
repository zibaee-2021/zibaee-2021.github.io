const storageKey = 'sz-gallery-tasks-v1';
let saved = {};
let storageAvailable = true;
try {
  const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) saved = parsed;
} catch { storageAvailable = false; }

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(saved));
  } catch {
    storageAvailable = false;
    document.querySelectorAll('.todo-storage').forEach(note => {
      note.textContent = 'Browser storage unavailable. Changes last only for this visit.';
    });
  }
}
function createPanel(figure) {
  const panel = document.createElement('details');
  panel.className = 'todo-panel';
  const title = figure.getAttribute('aria-label') || figure.id;
  const summary = document.createElement('summary');
  summary.textContent = 'to do';
  summary.setAttribute('aria-label', `To do: ${title}`);
  const content = document.createElement('div');
  content.className = 'todo-content';
  const note = document.createElement('p');
  note.className = 'todo-storage';
  note.textContent = storageAvailable ? 'Saved in this browser only.' : 'Browser storage unavailable. Changes last only for this visit.';
  const list = document.createElement('ul');
  list.className = 'todo-list';
  const tasks = Array.isArray(saved[figure.id]) ? saved[figure.id].filter(task => task && typeof task.text === 'string' && typeof task.done === 'boolean') : [];
  saved[figure.id] = tasks;
  function render() {
    list.replaceChildren();
    for (const task of tasks) {
      const row = document.createElement('li');
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', () => { task.done = checkbox.checked; persist(); });
      const text = document.createElement('span');
      text.textContent = task.text;
      label.append(checkbox, text);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Delete task: ${task.text}`);
      remove.addEventListener('click', () => { tasks.splice(tasks.indexOf(task), 1); persist(); render(); input.focus(); });
      row.append(label, remove);
      list.append(row);
    }
  }
  const form = document.createElement('form');
  form.className = 'todo-form';
  const label = document.createElement('label');
  label.textContent = 'new task';
  const input = document.createElement('input');
  input.id = `task-input-${figure.id}`;
  input.maxLength = 300;
  input.required = true;
  label.htmlFor = input.id;
  const add = document.createElement('button');
  add.type = 'submit';
  add.textContent = 'add';
  form.append(label, input, add);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.push({ text, done: false });
    persist(); render(); input.value = ''; input.focus();
  });
  render();
  content.append(note, list, form);
  panel.append(summary, content);
  return panel;
}
const gallery = document.querySelector('.gallery');
const figures = [...gallery.querySelectorAll(':scope > figure:not(.ideas)')];
for (let i = 0; i < figures.length; i += 2) {
  const row = document.createElement('div');
  row.className = 'project-row';
  gallery.insertBefore(row, figures[i]);
  for (const figure of figures.slice(i, i + 2)) row.append(figure, createPanel(figure));
}
