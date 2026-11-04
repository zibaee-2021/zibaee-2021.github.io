// Shahin's completion estimates, from 0 to 10. null means not yet rated.
const completion = {
  'salsa-app': 9,
  'salsa-manuscript': 1,
  'lagtime-app': 4,
  'lagtime-manuscript': 0,
  'ada-app': 6,
  'ada-manuscript': 1,
  'amyloid-experiments': 0,
  'amyloid-manuscript': 0,
  'helical-experiments': 0,
  'helical-manuscript': 0,
  'ideas': null,
};

for (const item of document.querySelectorAll('.gallery figure')) {
  let caption = item.querySelector('.panel-caption');
  if (!caption) {
    caption = document.createElement('figcaption');
    caption.className = 'panel-caption';
    item.prepend(caption);
  }
  caption.removeAttribute('aria-hidden');
  const score = completion[item.id];
  const rated = Number.isInteger(score) && score >= 0 && score <= 10;
  const indicator = document.createElement('span');
  indicator.className = 'completion-segments';
  indicator.setAttribute('role', 'img');
  const description = rated ? `~${score}/10 complete` : 'Completion not yet rated';
  indicator.setAttribute('aria-label', description);
  indicator.tabIndex = 0;
  indicator.dataset.label = description;
  for (let dot = 1; dot <= 10; dot++) {
    const light = document.createElement('span');
    light.className = 'completion-segment' + (rated && dot <= score ? ' is-lit' : '');
    light.setAttribute('aria-hidden', 'true');
    indicator.append(light);
  }
  caption.prepend(indicator);
}
