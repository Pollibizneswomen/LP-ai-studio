const REVEAL_SELECTORS = [
  ".section-title",
  ".eyebrow",
  ".advantages__item",
  ".service-card",
  ".quiz",
  ".about__gallery",
  ".about__content",
  ".about-stat",
  ".master-card",
  ".gallery-card",
  ".comparison-card",
  ".before-after__info",
  ".spa-program",
  ".certificate-builder__step",
  ".certificate-preview-wrapper",
  ".booking-widget",
  ".reviews__content",
  ".reviews-slider",
  ".contact-item",
  ".contacts__schedule",
  ".contacts__map",
  ".contact-form-wrapper",
  ".footer__column",
];

const STAGGER_CONTAINERS = [
  ".advantages__grid",
  ".services__grid",
  ".about__stats",
  ".masters__grid",
  ".gallery__grid",
  ".spa-programs__grid",
  ".contacts__details",
  ".footer__grid",
];

function addRevealClasses() {
  const elements = document.querySelectorAll(
    REVEAL_SELECTORS.join(",")
  );

  elements.forEach((element) => {
    if (element.closest(".tour-modal, .gallery-modal")) {
      return;
    }

    element.classList.add("reveal");
  });
}

function addStaggerDelays() {
  STAGGER_CONTAINERS.forEach((selector) => {
    const container = document.querySelector(selector);

    if (!container) {
      return;
    }

    Array.from(container.children).forEach((child, index) => {
      child.style.setProperty(
        "--reveal-delay",
        `${Math.min(index * 80, 400)}ms`
      );
    });
  });
}

function observeRevealElements() {
  const elements = document.querySelectorAll(".reveal");

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    elements.forEach((element) => {
      element.classList.add("is-visible");
    });

    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -55px",
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}

function observeDynamicContent() {
  if (!("MutationObserver" in window)) {
    return;
  }

  const dynamicContainers = document.querySelectorAll(
    [
      "[data-services-grid]",
      "[data-masters-grid]",
      "[data-gallery-grid]",
      "[data-spa-programs-grid]",
      "[data-reviews-viewport]",
      "[data-booking-content]",
    ].join(",")
  );

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) {
          return;
        }

        node.classList.add("dynamic-reveal");

        requestAnimationFrame(() => {
          node.classList.add("is-visible");
        });
      });
    });
  });

  dynamicContainers.forEach((container) => {
    observer.observe(container, {
      childList: true,
      subtree: false,
    });
  });
}

export function initAnimations() {
  addRevealClasses();
  addStaggerDelays();
  observeRevealElements();
  observeDynamicContent();
}