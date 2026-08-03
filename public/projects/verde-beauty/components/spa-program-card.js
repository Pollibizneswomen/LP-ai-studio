export function createSpaProgramCard(program) {
  const article = document.createElement("article");

  article.className = program.featured
    ? "spa-program spa-program--featured"
    : "spa-program";

  article.dataset.spaProgram = program.id;

  article.innerHTML = `
    <div class="spa-program__image-wrapper">
      <img
        class="spa-program__image"
        src="${program.image}"
        alt="${program.title}"
        loading="lazy"
      >

      <div class="spa-program__overlay"></div>

      <span class="spa-program__number">
        ${program.number}
      </span>

      ${
        program.featured
          ? `
            <span class="spa-program__badge">
              Signature Verde
            </span>
          `
          : ""
      }

      <div class="spa-program__image-content">
        <p class="spa-program__label">
          ${program.label}
        </p>

        <h3 class="spa-program__title">
          ${program.title}
        </h3>
      </div>
    </div>

    <div class="spa-program__content">
      <p class="spa-program__description">
        ${program.description}
      </p>

      <ul class="spa-program__benefits">
        ${program.benefits
          .map(
            (benefit) => `
              <li>
                <span></span>
                ${benefit}
              </li>
            `
          )
          .join("")}
      </ul>

      <div class="spa-program__footer">
        <div class="spa-program__meta">
          <span>${program.duration}</span>
          <strong>${program.price}</strong>
        </div>

        <a
          class="spa-program__booking"
          href="#booking"
          data-spa-booking="${program.id}"
        >
          Выбрать программу

          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12H19M14 7L19 12L14 17"></path>
          </svg>
        </a>
      </div>
    </div>
  `;

  return article;
}