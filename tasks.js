import { createRepositoryPanel } from './repository-tasks.js?v=4';

const sources = {
  'salsa-app': 'https://salsa-maru.onrender.com/public/todo.md',
  'ada-app': 'https://ada-khcz.onrender.com/api/public-todo',
  'lagtime-app': 'https://lagtime-estimator.onrender.com/public/todo.md',
  'amyloid-experiments': 'https://salsa-maru.onrender.com/public/amyloid-experiments.md',
  'helical-experiments': 'https://salsa-maru.onrender.com/public/helical-experiments.md',
  'salsa-manuscript': './tasks/manuscripts/salsa-webapp.md',
  'ada-manuscript': './tasks/manuscripts/ada.md',
  'lagtime-manuscript': './tasks/manuscripts/lagtime-calculator.md',
  'amyloid-manuscript': './tasks/manuscripts/amyloid-beta-sheet-contiguity.md',
  'helical-manuscript': './tasks/manuscripts/salsa-helical-amphipathicity.md',
  'ideas': './TodoList/thought-experiments.md',
};
const localPreview = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
for (const figure of document.querySelectorAll('.gallery figure')) {
  const source = localPreview ? `/__preview/tasks/${figure.id}.md` : sources[figure.id];
  if (!sources[figure.id]) continue;
  figure.querySelector('.panel-caption').prepend(createRepositoryPanel(figure, source));
}

function closeTaskPanelsOutside(target) {
  for (const panel of document.querySelectorAll('.todo-panel[open]')) {
    if (!panel.contains(target)) panel.open = false;
  }
}
// Capture also handles outside controls that stop click propagation.
document.addEventListener('click', event => closeTaskPanelsOutside(event.target), true);
// Clicks inside embedded apps do not bubble to this document. When focus
// enters an iframe, dismiss the gallery panels without blocking the app.
window.addEventListener('blur', () => {
  setTimeout(() => {
    if (document.activeElement instanceof HTMLIFrameElement) {
      closeTaskPanelsOutside(document.activeElement);
    }
  }, 0);
});
