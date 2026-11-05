const title = document.querySelector('header h1');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (title) {
  const text = title.textContent;
  title.setAttribute('aria-label', text);
  const letters = [];
  title.replaceChildren();
  for (const character of text) {
    const span = document.createElement('span');
    span.textContent = character;
    span.setAttribute('aria-hidden', 'true');
    title.append(span);
    if (/\p{L}/u.test(character)) letters.push(span);
  }
  let animations = [];
  function animateLetters() {
    animations.forEach(animation => animation.cancel());
    animations = [];
    if (reducedMotion.matches) return;
    const blackStep = 400;
    const greyStep = blackStep * 2;
    const lead = 8;
    const duration = Math.max(letters.length * blackStep + 800,
      (letters.length - lead) * greyStep + 1600);
    const base = getComputedStyle(title).color.match(/[\d.]+/g).slice(0, 3).map(Number);
    const grey = [163, 165, 159];
    const pulse = (time, start, length) => {
      const phase = (time - start) / length;
      return phase < 0 || phase > 1 ? 0 : 1 - Math.abs(2 * phase - 1);
    };
    // Combine both passes in one colour timeline so they cannot override
    // each other's inactive frames. Black takes precedence as it overtakes.
    animations = letters.map((letter, index) => {
      const frames = [];
      for (let time = 0; time <= duration; time += 40) {
        const black = pulse(time, index * blackStep, 800);
        const light = pulse(time, (index - lead) * greyStep, 1600);
        const rgb = base.map((value, channel) =>
          Math.round((value + (grey[channel] - value) * light) * (1 - black)));
        frames.push({ color: `rgb(${rgb.join(',')})`, offset: time / duration });
      }
      return letter.animate(frames, { duration, iterations: Infinity, easing: 'linear' });
    });
  }
  animateLetters();
  reducedMotion.addEventListener('change', animateLetters);
}
