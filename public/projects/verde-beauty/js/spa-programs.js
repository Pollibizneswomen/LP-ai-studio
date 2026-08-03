import { spaPrograms } from "../data/spa-programs.js";
import { createSpaProgramCard } from "../components/spa-program-card.js";

export function initSpaPrograms() {
  const grid = document.querySelector("[data-spa-programs-grid]");

  if (!grid) {
    return;
  }

  grid.innerHTML = "";

  spaPrograms.forEach((program) => {
    grid.append(createSpaProgramCard(program));
  });
}