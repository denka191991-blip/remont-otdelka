(() => {
  const catalog = document.getElementById('ceiling-catalog');
  const calculator = document.getElementById('ceiling-calculator');
  const controls = catalog.querySelector('.catalog-controls');
  const search = document.getElementById('catalog-query');
  const category = document.getElementById('catalog-category');
  const count = catalog.querySelector('.catalog-count');
  const empty = catalog.querySelector('.catalog-empty');
  const type = calculator.querySelector('[name="ceiling"]');
  const title = calculator.querySelector('h2');

  const normalize = text => text.toLowerCase().replaceAll('ё', 'е').trim();
  const cards = Array.from(catalog.querySelectorAll('.catalog-card'), card => ({
    card,
    text: normalize(card.textContent),
  }));

  function filterCards() {
    const words = normalize(search.value).split(/\s+/).filter(Boolean);
    let found = 0;
    for (const { card, text } of cards) {
      const matchesCategory = !category.value || card.dataset.category === category.value;
      const matchesQuery = words.every(word => text.includes(word));
      card.hidden = !(matchesCategory && matchesQuery);
      if (!card.hidden) found += 1;
    }
    count.textContent = `Показано ${found} из ${cards.length}`;
    empty.hidden = found !== 0;
  }

  function selectType(value) {
    if (!Array.from(type.options).some(option => option.value === value)) return;
    type.value = value;
    type.dispatchEvent(new Event('input', { bubbles: true }));
  }

  controls.addEventListener('submit', event => event.preventDefault());
  controls.addEventListener('reset', event => {
    event.preventDefault();
    search.value = '';
    category.value = '';
    filterCards();
  });
  search.addEventListener('input', filterCards);
  category.addEventListener('change', filterCards);
  catalog.addEventListener('click', event => {
    const link = event.target.closest('[data-estimate-type]');
    if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    selectType(link.dataset.estimateType);
    if (location.href !== link.href) history.pushState(null, '', link.href);
    title.focus({ preventScroll: true });
    calculator.scrollIntoView();
  });
  window.addEventListener('popstate', () => {
    const requested = new URLSearchParams(location.search).get('type');
    if (requested) selectType(requested);
  });

  filterCards();
  count.hidden = false;
  controls.hidden = false;
})();
