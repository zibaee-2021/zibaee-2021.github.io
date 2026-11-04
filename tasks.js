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
// Preserve existing flat lists while normalising saved nested tasks.
function normaliseTasks(value) {
  if (!Array.isArray(value)) return [];
  return value.filter(task => task && typeof task.text === 'string' && typeof task.done === 'boolean')
    .map(task => ({ text: task.text, done: task.done, children: normaliseTasks(task.children) }));
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
  const tasks = normaliseTasks(saved[figure.id]);
  saved[figure.id] = tasks;
  let parentTask = null;
  function resetTarget() {
    parentTask = null;
    label.textContent = 'new task';
    cancel.hidden = true;
  }
  function renderTasks(items, container) {
    for (const task of items) {
      const entry = document.createElement('li');
      const row = document.createElement('div');
      row.className = 'todo-row';
      const taskLabel = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.done;
      checkbox.addEventListener('change', () => { task.done = checkbox.checked; persist(); });
      const text = document.createElement('span');
      text.textContent = task.text;
      taskLabel.append(checkbox, text);
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Delete task: ${task.text}`);
      remove.addEventListener('click', () => {
        if (task.children.length && !confirm('Delete this task and all its subtasks?')) return;
        items.splice(items.indexOf(task), 1);
        resetTarget(); persist(); render(); input.focus();
      });
      row.append(taskLabel, remove);
      const subtask = document.createElement('button');
      subtask.type = 'button';
      subtask.className = 'todo-add-subtask';
      subtask.textContent = '+ subtask';
      subtask.setAttribute('aria-label', `Add subtask to: ${task.text}`);
      subtask.addEventListener('click', () => {
        parentTask = task;
        label.textContent = `new subtask for: ${task.text}`;
        cancel.hidden = false;
        input.focus();
      });
      entry.append(row, subtask);
      if (task.children.length) {
        const children = document.createElement('ul');
        children.className = 'todo-list todo-subtasks';
        renderTasks(task.children, children);
        entry.append(children);
      }
      container.append(entry);
    }
  }
  function render() {
    list.replaceChildren();
    renderTasks(tasks, list);
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
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.textContent = 'cancel subtask';
  cancel.hidden = true;
  cancel.addEventListener('click', () => { resetTarget(); input.focus(); });
  form.append(label, input, add, cancel);
  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    (parentTask ? parentTask.children : tasks).push({ text, done: false, children: [] });
    persist(); render(); input.value = ''; input.focus();
  });
  render();
  content.append(note, list, form);
  panel.append(summary, content);
  return panel;
}
for (const figure of document.querySelectorAll('.gallery figure:not(.ideas)')) {
  figure.querySelector('.panel-caption').prepend(createPanel(figure));
}
