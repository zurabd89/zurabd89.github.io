(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.main-nav');

  if (menuButton && navigation) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      navigation.classList.toggle('is-open', !open);
      document.body.classList.toggle('menu-open', !open);
    });
    navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.classList.remove('is-open');
      document.body.classList.remove('menu-open');
    }));
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });
    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // Active navigation marker.
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
  const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-28% 0px -62% 0px', threshold: [0, .2, .5] });
    sections.forEach((section) => navObserver.observe(section));
  }

  // Lightweight count-up on first view.
  document.querySelectorAll('[data-count]').forEach((node) => {
    const target = Number(node.dataset.count || 0);
    if (!target || reducedMotion) return;
    const suffix = node.dataset.suffix || '';
    let started = false;
    const counterObserver = new IntersectionObserver((entries) => {
      if (started || !entries[0].isIntersecting) return;
      started = true;
      const start = performance.now();
      const duration = 1050;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        node.textContent = `${Math.round(target * eased)}${suffix}`;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.disconnect();
    }, { threshold: .5 });
    counterObserver.observe(node);
  });

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy');
      const initialText = button.textContent;
      try { await navigator.clipboard.writeText(value); button.textContent = 'Адрес скопирован'; }
      catch { button.textContent = value; }
      window.setTimeout(() => { button.textContent = initialText; }, 2200);
    });
  });

  const yearNode = document.getElementById('current-year');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());
})();

/* =========================
   YANDEX METRIKA
   После создания счётчика замените 0 на его номер.
   ========================= */
const YANDEX_METRIKA_ID = 0;
if (Number.isInteger(YANDEX_METRIKA_ID) && YANDEX_METRIKA_ID > 0) {
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(let j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r)return;}k=e.createElement(t);a=e.getElementsByTagName(t)[0];k.async=1;k.src=r;a.parentNode.insertBefore(k,a);})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
  window.ym(YANDEX_METRIKA_ID,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
}
