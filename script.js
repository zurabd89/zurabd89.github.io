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

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        navigation.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.getAttribute('data-copy');
      const initialText = button.textContent;
      try {
        await navigator.clipboard.writeText(value);
        button.textContent = 'Адрес скопирован';
      } catch (error) {
        button.textContent = value;
      }
      window.setTimeout(() => {
        button.textContent = initialText;
      }, 2200);
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
  (function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for (let j=0; j<document.scripts.length; j++) {
      if (document.scripts[j].src === r) return;
    }
    k=e.createElement(t); a=e.getElementsByTagName(t)[0];
    k.async=1; k.src=r; a.parentNode.insertBefore(k,a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  window.ym(YANDEX_METRIKA_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true
  });
}
