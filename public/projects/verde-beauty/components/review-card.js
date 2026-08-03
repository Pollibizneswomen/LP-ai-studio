export function createReviewCard(review) {
  const article = document.createElement("article");

  article.className = "review-card";

  article.innerHTML = `
    <div class="review-card__top">
      <div class="review-card__quote" aria-hidden="true">
        “
      </div>

      <div
        class="review-card__rating"
        aria-label="Оценка ${review.rating} из 5"
      >
        ${"★".repeat(review.rating)}
      </div>
    </div>

    <blockquote class="review-card__text">
      ${review.text}
    </blockquote>

    <div class="review-card__footer">
      <div class="review-card__person">
        <span class="review-card__avatar">
          ${review.initials}
        </span>

        <div>
          <strong>${review.name}</strong>
          <span>${review.service}</span>
        </div>
      </div>

      <time datetime="2026-07-12">
        ${review.date}
      </time>
    </div>
  `;

  return article;
}