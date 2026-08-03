import { galleryItems } from "../data/gallery.js";
import { createGalleryCard } from "../components/gallery-card.js";

export function initGallery() {
  const grid = document.querySelector("[data-gallery-grid]");
  const filters = document.querySelector("[data-gallery-filters]");
  const modal = document.querySelector("[data-gallery-modal]");

  if (!grid || !modal) {
    return;
  }

  const modalImage = modal.querySelector("[data-gallery-modal-image]");
  const modalTitle = modal.querySelector("[data-gallery-modal-title]");
  const modalDescription = modal.querySelector(
    "[data-gallery-modal-description]"
  );

  const modalCurrent = modal.querySelector("[data-gallery-modal-current]");
  const modalTotal = modal.querySelector("[data-gallery-modal-total]");

  const previousButton = modal.querySelector("[data-gallery-previous]");
  const nextButton = modal.querySelector("[data-gallery-next]");
  const closeButtons = modal.querySelectorAll("[data-gallery-close]");

  let activeCategory = "all";
  let visibleItems = [...galleryItems];
  let currentIndex = 0;
  let lastFocusedElement = null;

  const renderGallery = () => {
    visibleItems =
      activeCategory === "all"
        ? [...galleryItems]
        : galleryItems.filter(
            (item) => item.category === activeCategory
          );

    grid.innerHTML = "";

    visibleItems.forEach((item, index) => {
      grid.append(createGalleryCard(item, index));
    });
  };

  const renderModal = () => {
    const item = visibleItems[currentIndex];

    if (!item) {
      return;
    }

    modalImage.classList.add("is-changing");

    window.setTimeout(() => {
      modalImage.src = item.image;
      modalImage.alt = item.title;

      modalTitle.textContent = item.title;
      modalDescription.textContent = item.description;

      modalCurrent.textContent = String(currentIndex + 1).padStart(2, "0");
      modalTotal.textContent = String(visibleItems.length).padStart(2, "0");

      modalImage.classList.remove("is-changing");
    }, 160);
  };

  const openModal = (itemId, trigger) => {
    const selectedIndex = visibleItems.findIndex(
      (item) => item.id === itemId
    );

    if (selectedIndex < 0) {
      return;
    }

    currentIndex = selectedIndex;
    lastFocusedElement = trigger;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    renderModal();

    window.setTimeout(() => {
      modal.querySelector("[data-gallery-close]")?.focus();
    }, 100);
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    lastFocusedElement?.focus();
  };

  const showPrevious = () => {
    currentIndex =
      (currentIndex - 1 + visibleItems.length) % visibleItems.length;

    renderModal();
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    renderModal();
  };

  grid.addEventListener("click", (event) => {
    const button = event.target.closest("[data-gallery-open]");

    if (!button) {
      return;
    }

    openModal(button.dataset.galleryOpen, button);
  });

  filters?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-gallery-filter]");

    if (!button) {
      return;
    }

    activeCategory = button.dataset.galleryFilter;

    filters
      .querySelectorAll("[data-gallery-filter]")
      .forEach((filterButton) => {
        filterButton.classList.toggle(
          "is-active",
          filterButton === button
        );
      });

    renderGallery();
  });

  previousButton?.addEventListener("click", showPrevious);
  nextButton?.addEventListener("click", showNext);

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
    }

    if (event.key === "ArrowLeft") {
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      showNext();
    }
  });

  modalImage?.addEventListener("load", () => {
    modalImage.classList.remove("is-changing");
  });

  renderGallery();
}