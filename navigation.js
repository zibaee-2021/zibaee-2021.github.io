const menu = document.getElementById('page-index');
const nav = document.getElementById('index-links');
const sections = [...document.querySelectorAll('[data-index-group][data-index-label][id]')];
const compact = matchMedia('(max-width: 1199px)');

const links = [...nav.querySelectorAll('a')];
let active = '';
let pendingTarget = '';
let scrollTimer;
let highlightTarget = '';
function highlight(id) {
  const preview = document.getElementById(id)?.querySelector('.preview');
  if (!preview) return;
  preview.classList.remove('index-highlight');
  void preview.offsetWidth;
  preview.classList.add('index-highlight');
  preview.addEventListener('animationend', () => preview.classList.remove('index-highlight'), { once: true });
}
function settleScroll() {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => {
    if (highlightTarget) { highlight(highlightTarget); highlightTarget = ''; }
    pendingTarget = '';
    scheduleUpdate();
  }, 180);
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
  highlightTarget = pendingTarget;
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

// Reinforce the paper margin only beside the first-level subsection labels.
function updateMarginSegments() {
  menu.querySelectorAll('.margin-segment').forEach(segment => segment.remove());
  if (!menu.open) return;
  const origin = menu.getBoundingClientRect();
  const rows = nav.querySelectorAll('.contents-list > li > details > ul > li > a, .contents-list > li > details > ul > li > .index-pending, .contents-list > li > details > ul > li > details > summary');
  for (const row of rows) {
    if (!row.checkVisibility()) continue;
    const rect = row.getBoundingClientRect();
    const segment = document.createElement('span');
    segment.className = 'margin-segment';
    segment.setAttribute('aria-hidden', 'true');
    segment.style.top = `${rect.top - origin.top + menu.scrollTop}px`;
    segment.style.height = `${rect.height}px`;
    menu.append(segment);
  }
}
menu.addEventListener('toggle', updateMarginSegments, true);
window.addEventListener('resize', updateMarginSegments);
document.fonts.ready.then(updateMarginSegments);
updateMarginSegments();
