const menu = document.getElementById('page-index');
const nav = document.getElementById('index-links');
const sections = [...document.querySelectorAll('[data-index-group][data-index-label][id]')];
const compact = matchMedia('(max-width: 1199px)');

// New gallery entries automatically join the appropriate index group.
const groups = new Map();
nav.replaceChildren();
for (const name of ['Apps', 'Experiments', 'Manuscripts']) {
  const group = document.createElement('div');
  group.className = 'index-group';
  const heading = document.createElement('h2');
  heading.textContent = name;
  group.append(heading);
  nav.append(group);
  const entries = document.createElement('div');
  if (name === 'Experiments') entries.className = 'index-subsections';
  group.append(entries);
  groups.set(name, entries);
}
for (const section of sections) {
  const group = groups.get(section.dataset.indexGroup);
  if (!group) continue;
  const link = document.createElement('a');
  link.href = `#${section.id}`;
  link.textContent = section.dataset.indexLabel;
  group.append(link);
}
// Computational experiments currently use the shared SALSA application.
const computational = document.createElement('a');
computational.href = '#salsa-app';
const italic = document.createElement('em');
italic.textContent = 'in silico';
computational.append(italic);
groups.get('Experiments').append(computational);
const links = [...nav.querySelectorAll('a')];
let active = '';
let pendingTarget = '';
let scrollTimer;
function settleScroll() {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => { pendingTarget = ''; scheduleUpdate(); }, 180);
}
function select(id) {
  active = id;
  for (const link of links) {
    if (link.hash === `#${id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
function syncLayout() { menu.open = !compact.matches; }
syncLayout();
compact.addEventListener('change', syncLayout);
nav.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  pendingTarget = link.hash.slice(1);
  select(pendingTarget);
  settleScroll();
  if (compact.matches) menu.open = false;
});
function readHash() {
  const id = location.hash.slice(1);
  if (sections.some(section => section.id === id)) {
    pendingTarget = id;
    select(id);
    settleScroll();
  }
}
window.addEventListener('hashchange', readHash);
readHash();
let scheduled = false;
function update() {
  scheduled = false;
  if (pendingTarget) { select(pendingTarget); return; }
  const offset = compact.matches ? 64 : 28;
  const visible = sections.map(section => ({ section, rect: section.getBoundingClientRect() }))
    .filter(({ rect }) => rect.bottom > offset && rect.top < innerHeight);
  if (!visible.length) return;
  visible.sort((a, b) => {
    const distance = Math.abs(a.rect.top - offset) - Math.abs(b.rect.top - offset);
    if (Math.abs(distance) > 1) return distance;
    // Side-by-side app and manuscript share a position: retain the selected one.
    return Number(b.section.id === active) - Number(a.section.id === active);
  });
  if (scrollY > 0 && Math.ceil(scrollY + innerHeight) >= document.documentElement.scrollHeight - 2) {
    select(sections.filter(section => visible.some(item => item.section === section)).at(-1).id);
  } else select(visible[0].section.id);
}
function scheduleUpdate() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
}
window.addEventListener('scroll', () => {
  if (pendingTarget) settleScroll();
  scheduleUpdate();
}, { passive: true });
window.addEventListener('resize', scheduleUpdate);
window.addEventListener('load', scheduleUpdate);
update();
