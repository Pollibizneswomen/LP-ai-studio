export function initBeforeAfter() {
  const comparisons = document.querySelectorAll("[data-before-after]");

  comparisons.forEach((comparison) => {
    const range = comparison.querySelector("[data-before-after-range]");
    const afterLayer = comparison.querySelector("[data-after-layer]");
    const handle = comparison.querySelector("[data-before-after-handle]");
    const valueLabel = comparison.querySelector(
      "[data-before-after-value]"
    );

    if (!range || !afterLayer || !handle) {
      return;
    }

    const updateComparison = () => {
      const value = Number(range.value);

      afterLayer.style.clipPath = `inset(0 ${100 - value}% 0 0)`;
      handle.style.left = `${value}%`;

      if (valueLabel) {
        valueLabel.textContent = `${value}%`;
      }
    };

    range.addEventListener("input", updateComparison);

    updateComparison();
  });
}