export function createGalleryCard(item, index) {
  const article = document.createElement("article");

  article.className =
    index === 0 || index === 5
      ? "gallery-card gallery-card--large"
      : "gallery-card";

  article.dataset.galleryCategory = item.category;

  article.innerHTML = `
    <button
      class="gallery-card__button"
      type="button"
      data-gallery-open="${item.id}"
      aria-label="Открыть фотографию: ${item.title}"
    >
      <img
        class="gallery-card__image"
        src="${item.image}"
        alt="${item.title}"
        loading="lazy"
      >

      <span class="gallery-card__overlay"></span>

      <span class="gallery-card__content">
        <span class="gallery-card__category">
          ${getCategoryName(item.category)}
        </span>

        <strong class="gallery-card__title">
          ${item.title}
        </strong>

        <span class="gallery-card__description">
          ${item.description}
        </span>
      </span>

      <span class="gallery-card__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M8 3H3V8"></path>
          <path d="M16 3H21V8"></path>
          <path d="M8 21H3V16"></path>
          <path d="M16 21H21V16"></path>
        </svg>
      </span>
    </button>
  `;

  return article;
}

function getCategoryName(category) {
  const categories = {
    interior: "Интерьер",
    spa: "SPA",
    face: "Уход за лицом",
    hair: "Волосы",
    body: "Уход за телом",
  };

  return categories[category] ?? category;
}