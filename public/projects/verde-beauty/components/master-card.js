export function createMasterCard(master) {
  const article = document.createElement("article");

  article.className = master.featured
    ? "master-card master-card--featured"
    : "master-card";

  article.dataset.masterCategory = master.category;
  article.dataset.masterId = master.id;

  article.innerHTML = `
    <div class="master-card__image-wrapper">
      <img
        class="master-card__image"
        src="${master.image}"
        alt="${master.name}, ${master.role}"
        loading="lazy"
      >

      <div class="master-card__overlay"></div>

      ${
        master.featured
          ? `
            <span class="master-card__badge">
              Эксперт Verde
            </span>
          `
          : ""
      }

      <div class="master-card__actions">
        <a
          class="master-card__booking"
          href="#booking"
          data-master-booking="${master.id}"
        >
          Записаться

          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12H19M14 7L19 12L14 17"></path>
          </svg>
        </a>
      </div>
    </div>

    <div class="master-card__content">
      <p class="master-card__role">
        ${master.role}
      </p>

      <h3 class="master-card__name">
        ${master.name}
      </h3>

      <p class="master-card__experience">
        ${master.experience}
      </p>

      <p class="master-card__description">
        ${master.description}
      </p>

      <a
        class="master-card__link"
        href="#booking"
        data-master-booking="${master.id}"
      >
        Выбрать мастера

        <span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12H19M14 7L19 12L14 17"></path>
          </svg>
        </span>
      </a>
    </div>
  `;

  return article;
}