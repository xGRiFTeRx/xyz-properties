// ── Helpers ───────────────────────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Mobile menu ───────────────────────────────────────────────────────────────
const hamburger   = $('.hamburger');
const mobileMenu  = $('.mobile-menu');
const menuClose   = $('.mobile-menu__close');

hamburger?.addEventListener('click', () => mobileMenu?.classList.add('open'));
menuClose?.addEventListener('click', () => mobileMenu?.classList.remove('open'));

// ── Active nav link ───────────────────────────────────────────────────────────
const currentPage = location.pathname.split('/').pop() || 'index.html';
$$('.navbar__links a, .mobile-menu a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

// ── Favorite toggle ───────────────────────────────────────────────────────────
$$('.property-card__favorite').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    btn.classList.toggle('active');
    showToast(btn.classList.contains('active') ? '❤️ Added to favorites' : 'Removed from favorites');
  });
});

// ── Filter tabs (properties page) ─────────────────────────────────────────────
$$('.type-card').forEach(card => {
  card.addEventListener('click', () => {
    $$('.type-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  });
});

// ── Property filters ──────────────────────────────────────────────────────────
const filterForm = $('.filters-bar');
filterForm?.addEventListener('submit', e => e.preventDefault());

// ── Gallery (property detail page) ────────────────────────────────────────────
const mainImg    = $('.gallery-main img');
const thumbs     = $$('.gallery-thumb');

thumbs.forEach((thumb, i) => {
  thumb.addEventListener('click', () => {
    if (mainImg) mainImg.src = thumb.querySelector('img').src;
    thumbs.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  });
});

// ── Mortgage calculator ───────────────────────────────────────────────────────
const calcBtn    = $('#calcBtn');
const calcResult = $('#calcResult');

calcBtn?.addEventListener('click', () => {
  const price    = parseFloat($('#calcPrice')?.value) || 0;
  const down     = parseFloat($('#calcDown')?.value)  || 0;
  const rate     = parseFloat($('#calcRate')?.value)   || 0;
  const years    = parseFloat($('#calcYears')?.value)  || 0;

  const principal = price - down;
  const monthly   = rate / 100 / 12;
  const payments  = years * 12;

  if (principal <= 0 || monthly <= 0 || payments <= 0) {
    if (calcResult) calcResult.textContent = '—';
    return;
  }

  const payment = principal * (monthly * Math.pow(1 + monthly, payments)) / (Math.pow(1 + monthly, payments) - 1);
  if (calcResult) calcResult.textContent = '$' + payment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
});

// ── Animated stat counters ────────────────────────────────────────────────────
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start).toLocaleString() + (el.dataset.suffix || '');
  }, 16);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      $$('.stat-item__number').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target), 1800);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsBar = $('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// ── Contact / inquiry form submit ─────────────────────────────────────────────
$$('form').forEach(form => {
  if (form.id === 'contactForm') return;
  if (form.id === 'heroSearchForm') return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    showToast('✅ Message sent! We\'ll be in touch soon.', 'success');
    form.reset();
  });
});

// ── Toast notification ────────────────────────────────────────────────────────
function showToast(msg, type = '') {
  let toast = $('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'toast' + (type ? ' toast--' + type : '');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Search form (hero) ────────────────────────────────────────────────────────
const heroSearch = document.getElementById('heroSearchForm') || $('.hero__search form');
heroSearch?.addEventListener('submit', e => {
  e.preventDefault();
  const params = new URLSearchParams();
  const type     = document.getElementById('heroType')?.value;
  const status   = document.getElementById('heroStatus')?.value;
  const location = document.getElementById('heroLocation')?.value;
  const budget   = document.getElementById('heroBudget')?.value;
  if (type)     params.set('type', type);
  if (status)   params.set('status', status);
  if (location) params.set('location', location);
  if (budget)   params.set('price', budget);
  window.location.href = 'properties.html' + (params.toString() ? '?' + params.toString() : '');
});
