export function createServiceCard(service) {
  const article = document.createElement("article");

  article.className = service.featured
    ? "service-card service-card--featured"
    : "service-card";

  article.dataset.serviceId = service.id;

  article.innerHTML = `
    <div class="service-card__image-wrapper">
      <img
        class="service-card__image"
        src="${service.image}"
        alt="${service.title}"
        loading="lazy"
      >

      <div class="service-card__overlay"></div>

      <span class="service-card__number">
        ${service.number}
      </span>

      ${
        service.featured
          ? `
            <span class="service-card__badge">
              Выбор гостей
            </span>
          `
          : ""
      }

      <a
        class="service-card__arrow"
        href="#booking"
        aria-label="Записаться на ${service.title}"
        data-service-booking="${service.id}"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M14 7l5 5-5 5" />
        </svg>
      </a>
    </div>

    <div class="service-card__content">
      <p class="service-card__category">
        ${service.category}
      </p>

      <h3 class="service-card__title">
        ${service.title}
      </h3>

      <p class="service-card__description">
        ${service.description}
      </p>

      <div class="service-card__meta">
        <span>${service.duration}</span>
        <strong>${service.price}</strong>
      </div>
    </div>
  `;

  return article;
}

