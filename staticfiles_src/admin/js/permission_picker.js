(() => {
  function initialize() {
    document.querySelectorAll('[data-permission-picker]').forEach((picker) => {
      if (picker.dataset.initialized) return;
      picker.dataset.initialized = 'true';
      const search = picker.querySelector('[data-permission-search]');
      const features = [...picker.querySelectorAll('[data-permission-feature]')];
      const updateCount = () => {
        picker.querySelector('[data-permission-count]').textContent =
          `${picker.querySelectorAll('input[type="checkbox"]:checked').length} selected`;
      };
      search.addEventListener('input', () => {
        const query = search.value.trim().toLocaleLowerCase();
        features.forEach((feature) => {
          feature.hidden = !feature.textContent.toLocaleLowerCase().includes(query);
        });
        picker.querySelector('[data-permission-empty]').hidden = features.some((feature) => !feature.hidden);
      });
      picker.addEventListener('change', updateCount);
      updateCount();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
})();
