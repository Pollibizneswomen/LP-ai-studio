import { masters } from "../data/masters.js";
import { createMasterCard } from "../components/master-card.js";

export function initMasters() {
  const grid = document.querySelector("[data-masters-grid]");
  const filters = document.querySelector("[data-master-filters]");

  if (!grid) {
    return;
  }

  let activeCategory = "all";

  const renderMasters = () => {
    const visibleMasters =
      activeCategory === "all"
        ? masters
        : masters.filter(
            (master) => master.category === activeCategory
          );

    grid.innerHTML = "";

    visibleMasters.forEach((master) => {
      grid.append(createMasterCard(master));
    });
  };

  filters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-master-filter]");

    if (!button) {
      return;
    }

    activeCategory = button.dataset.masterFilter;

    filters
      .querySelectorAll("[data-master-filter]")
      .forEach((filterButton) => {
        filterButton.classList.toggle(
          "is-active",
          filterButton === button
        );
      });

    renderMasters();
  });

  renderMasters();
}