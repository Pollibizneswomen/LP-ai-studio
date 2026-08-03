import { reviews } from "../data/reviews.js";
import { createReviewCard } from "../components/review-card.js";

export function initReviews() {
  const slider = document.querySelector("[data-reviews-slider]");

  if (!slider) {
    return;
  }

  const viewport = slider.querySelector("[data-reviews-viewport]");
  const previousButton = slider.querySelector("[data-reviews-previous]");
  const nextButton = slider.querySelector("[data-reviews-next]");
  const currentLabel = slider.querySelector("[data-reviews-current]");
  const totalLabel = slider.querySelector("[data-reviews-total]");
  const dots = slider.querySelector("[data-reviews-dots]");

  let currentIndex = 0;

  const renderDots = () => {
    dots.innerHTML = reviews
      .map(
        (_, index) => `
          <button
            class="reviews-slider__dot ${
              index === currentIndex ? "is-active" : ""
            }"
            type="button"
            aria-label="Показать отзыв ${index + 1}"
            data-review-dot="${index}"
          ></button>
        `
      )
      .join("");
  };

  const renderReview = () => {
    viewport.innerHTML = "";
    viewport.append(createReviewCard(reviews[currentIndex]));

    currentLabel.textContent = String(currentIndex + 1).padStart(2, "0");
    totalLabel.textContent = String(reviews.length).padStart(2, "0");

    renderDots();
  };

  const showPrevious = () => {
    currentIndex =
      (currentIndex - 1 + reviews.length) % reviews.length;

    renderReview();
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % reviews.length;

    renderReview();
  };

  previousButton?.addEventListener("click", showPrevious);
  nextButton?.addEventListener("click", showNext);

  dots?.addEventListener("click", (event) => {
    const dot = event.target.closest("[data-review-dot]");

    if (!dot) {
      return;
    }

    currentIndex = Number(dot.dataset.reviewDot);
    renderReview();
  });

  renderReview();
}