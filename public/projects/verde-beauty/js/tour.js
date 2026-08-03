const tourSlides = [
  {
    title: "Зона приветствия",
    description:
      "Светлое пространство с натуральным камнем, мягким освещением и ароматами зелёного чая встречает гостей Verde.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1800&q=90",
  },
  {
    title: "SPA-комнаты",
    description:
      "Приватные кабинеты для массажа и ухода созданы для тишины, глубокого расслабления и полного восстановления.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1800&q=90",
  },
  {
    title: "Beauty Lounge",
    description:
      "Просторная зона красоты с профессиональным оборудованием, природными оттенками и вниманием к каждой детали.",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1800&q=90",
  },
  {
    title: "Комната отдыха",
    description:
      "После процедуры гости могут остаться в тихой lounge-зоне, выпить травяной чай и продлить ощущение спокойствия.",
    image:
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1800&q=90",
  },
];

export function initTour() {
  const modal = document.querySelector("[data-tour-modal]");

  if (!modal) {
    return;
  }

  const openButtons = document.querySelectorAll(
    "[data-open-tour], [data-tour-button]"
  );

  const closeButtons = modal.querySelectorAll("[data-close-tour]");
  const previousButton = modal.querySelector("[data-tour-previous]");
  const nextButton = modal.querySelector("[data-tour-next]");
  const navigation = modal.querySelector("[data-tour-navigation]");

  const image = modal.querySelector("[data-tour-image]");
  const title = modal.querySelector("[data-tour-title]");
  const description = modal.querySelector("[data-tour-description]");
  const currentCounter = modal.querySelector("[data-tour-current]");
  const totalCounter = modal.querySelector("[data-tour-total]");

  let currentSlideIndex = 0;
  let lastFocusedElement = null;

  const renderNavigation = () => {
    navigation.innerHTML = tourSlides
      .map(
        (slide, index) => `
          <button
            class="tour-modal__navigation-item ${
              index === currentSlideIndex ? "is-active" : ""
            }"
            type="button"
            data-tour-slide="${index}"
          >
            <span>${String(index + 1).padStart(2, "0")}</span>
            ${slide.title}
          </button>
        `
      )
      .join("");
  };

  const renderSlide = () => {
    const slide = tourSlides[currentSlideIndex];

    image.classList.add("is-changing");

    window.setTimeout(() => {
      image.src = slide.image;
      image.alt = slide.title;

      title.textContent = slide.title;
      description.textContent = slide.description;

      currentCounter.textContent = String(
        currentSlideIndex + 1
      ).padStart(2, "0");

      totalCounter.textContent = String(tourSlides.length).padStart(
        2,
        "0"
      );

      renderNavigation();

      image.classList.remove("is-changing");
    }, 180);
  };

  const openModal = (event) => {
    lastFocusedElement = event?.currentTarget ?? null;

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    renderSlide();

    window.setTimeout(() => {
      modal.querySelector("[data-close-tour]")?.focus();
    }, 100);
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    lastFocusedElement?.focus();
  };

  const showPreviousSlide = () => {
    currentSlideIndex =
      (currentSlideIndex - 1 + tourSlides.length) %
      tourSlides.length;

    renderSlide();
  };

  const showNextSlide = () => {
    currentSlideIndex =
      (currentSlideIndex + 1) % tourSlides.length;

    renderSlide();
  };

  openButtons.forEach((button) => {
    button.addEventListener("click", openModal);
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModal);
  });

  previousButton.addEventListener("click", showPreviousSlide);
  nextButton.addEventListener("click", showNextSlide);

  navigation.addEventListener("click", (event) => {
    const navigationButton = event.target.closest("[data-tour-slide]");

    if (!navigationButton) {
      return;
    }

    currentSlideIndex = Number(navigationButton.dataset.tourSlide);
    renderSlide();
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
    }

    if (event.key === "ArrowLeft") {
      showPreviousSlide();
    }

    if (event.key === "ArrowRight") {
      showNextSlide();
    }
  });

  image.addEventListener("load", () => {
    image.classList.remove("is-changing");
  });
}