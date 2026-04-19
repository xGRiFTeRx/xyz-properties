// ── Filter tabs ───────────────────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
  });
});

// ── Simple dot sync for collections ──────────────────────────────────────────
const collectionTrack = document.getElementById('collectionsTrack');
const collectionDots  = document.querySelectorAll('#collectionDots .dot');

if (collectionTrack) {
  collectionTrack.addEventListener('scroll', () => {
    const cards = collectionTrack.querySelectorAll('.card--collection');
    const scrollLeft = collectionTrack.scrollLeft;
    const cardWidth  = cards[0]?.offsetWidth + 20 || 220;
    const index = Math.round(scrollLeft / cardWidth);
    collectionDots.forEach((d, i) => d.classList.toggle('dot--active', i === index));
  });
}

// ── Featured carousel arrows ──────────────────────────────────────────────────
const featuredTrack = document.getElementById('featuredTrack');
const prevBtn       = document.getElementById('featuredPrev');
const nextBtn       = document.getElementById('featuredNext');
const featuredDots  = document.querySelectorAll('#featuredDots .dot');

let currentFeatured = 0;
const featuredCards = featuredTrack?.querySelectorAll('.card--featured');

function scrollToFeatured(index) {
  if (!featuredTrack || !featuredCards.length) return;
  const card = featuredCards[index];
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  featuredDots.forEach((d, i) => d.classList.toggle('dot--active', i === index));
  currentFeatured = index;
}

prevBtn?.addEventListener('click', () => {
  const prev = (currentFeatured - 1 + featuredCards.length) % featuredCards.length;
  scrollToFeatured(prev);
});

nextBtn?.addEventListener('click', () => {
  const next = (currentFeatured + 1) % featuredCards.length;
  scrollToFeatured(next);
});

featuredDots.forEach((dot, i) => dot.addEventListener('click', () => scrollToFeatured(i)));
