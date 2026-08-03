import { initMobileMenu } from "./menu.js";
import { initServices } from "./services.js";
import { initQuiz } from "./quiz.js";
import { initTour } from "./tour.js";
import { initMasters } from "./masters.js";
import { initGallery } from "./gallery.js";
import { initBeforeAfter } from "./before-after.js";
import { initSpaPrograms } from "./spa-programs.js";
import { initCertificate } from "./certificate.js";
import { initBooking } from "./booking.js";
import { initReviews } from "./reviews.js";
import { initAnimations } from "./animations.js";
import { initForms } from "./forms.js";

function initHeader() {
  const header = document.querySelector("[data-header]");

  if (!header) {
    return;
  }

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 30);
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, {
    passive: true,
  });
}

function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (!href || href === "#") {
        event.preventDefault();
        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  });
}

function initActiveNavigation() {
  const links = Array.from(
    document.querySelectorAll(".navigation__link")
  );

  if (!links.length) {
    return;
  }

  const sections = links
    .map((link) => {
      const href = link.getAttribute("href");

      if (!href?.startsWith("#")) {
        return null;
      }

      return document.querySelector(href);
    })
    .filter(Boolean);

  if (!("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (firstEntry, secondEntry) =>
            secondEntry.intersectionRatio -
            firstEntry.intersectionRatio
        );

      const currentSection = visibleEntries[0]?.target;

      if (!currentSection) {
        return;
      }

      links.forEach((link) => {
        link.classList.toggle(
          "is-active",
          link.getAttribute("href") ===
            `#${currentSection.id}`
        );
      });
    },
    {
      rootMargin: "-25% 0px -60%",
      threshold: [0.1, 0.25, 0.5],
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

function initScrollTop() {
  const button = document.querySelector("[data-scroll-top]");

  if (!button) {
    return;
  }

  const updateButton = () => {
    button.classList.toggle(
      "is-visible",
      window.scrollY > 700
    );
  };

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  updateButton();

  window.addEventListener("scroll", updateButton, {
    passive: true,
  });
}

function initApp() {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavigation();

  initServices();
  initQuiz();
  initTour();
  initMasters();
  initGallery();
  initBeforeAfter();
  initSpaPrograms();
  initCertificate();
  initBooking();
  initReviews();

  initForms();
  initAnimations();
  initScrollTop();
}

document.addEventListener("DOMContentLoaded", initApp);