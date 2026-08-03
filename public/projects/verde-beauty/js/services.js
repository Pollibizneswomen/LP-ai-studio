import { services } from "../data/services.js";
import { createServiceCard } from "../components/service-card.js";

export function initServices() {
  const servicesGrid = document.querySelector("[data-services-grid]");
  const loadMoreButton = document.querySelector("[data-services-more]");

  if (!servicesGrid) {
    return;
  }

  const initialVisibleCount = 3;
  let visibleCount = initialVisibleCount;

  const renderServices = () => {
    servicesGrid.innerHTML = "";

    const visibleServices = services.slice(0, visibleCount);

    visibleServices.forEach((service) => {
      servicesGrid.append(createServiceCard(service));
    });

    if (!loadMoreButton) {
      return;
    }

    const allServicesVisible = visibleCount >= services.length;

    loadMoreButton.hidden = allServicesVisible;
  };

  loadMoreButton?.addEventListener("click", () => {
    visibleCount = services.length;
    renderServices();
  });

  renderServices();
}

