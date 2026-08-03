import { quizResults } from "../data/quiz-results.js";

const quizQuestions = [
  {
    title: "Что вы хотите подарить себе сегодня?",
    description:
      "Выберите главное направление, на котором нам стоит сосредоточиться.",
    options: [
      {
        value: "face",
        label: "Сияние и уход за лицом",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M20 25C20 15 25 10 32 10C39 10 44 15 44 25V34C44 46 39 54 32 54C25 54 20 46 20 34V25Z"/>
            <path d="M26 30H27M37 30H38"/>
            <path d="M27 42C30 44 34 44 37 42"/>
          </svg>
        `,
      },
      {
        value: "relax",
        label: "Глубокое расслабление",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M12 38C18 26 25 20 32 20C39 20 46 26 52 38"/>
            <path d="M18 38C22 46 27 50 32 50C37 50 42 46 46 38"/>
            <circle cx="32" cy="34" r="5"/>
          </svg>
        `,
      },
      {
        value: "body",
        label: "Обновление кожи тела",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M25 11C20 19 19 27 21 35L17 52"/>
            <path d="M39 11C44 19 45 27 43 35L47 52"/>
            <path d="M25 11C27 16 29 18 32 18C35 18 37 16 39 11"/>
            <path d="M21 35C27 39 37 39 43 35"/>
          </svg>
        `,
      },
      {
        value: "hair",
        label: "Восстановление волос",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M18 50C17 37 17 25 22 17C26 10 38 10 42 17C47 25 47 37 46 50"/>
            <path d="M24 20C25 31 23 41 20 50"/>
            <path d="M32 17V50"/>
            <path d="M40 20C39 31 41 41 44 50"/>
          </svg>
        `,
      },
    ],
  },

  {
    title: "Как вы чувствуете себя в последнее время?",
    description:
      "Это поможет подобрать интенсивность и формат будущего ритуала.",
    options: [
      {
        value: "tired",
        label: "Чувствую усталость",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="21"/>
            <path d="M23 27L28 28M36 28L41 27"/>
            <path d="M25 42C29 39 35 39 39 42"/>
          </svg>
        `,
      },
      {
        value: "stress",
        label: "Много напряжения",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M31 9L24 26H34L28 55L43 31H33L41 9"/>
          </svg>
        `,
      },
      {
        value: "balanced",
        label: "Хочу поддержать баланс",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 10V54"/>
            <path d="M14 23H50"/>
            <path d="M20 23L13 38H27L20 23Z"/>
            <path d="M44 23L37 38H51L44 23Z"/>
          </svg>
        `,
      },
      {
        value: "special",
        label: "Готовлюсь к важному событию",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 8L37 24L54 24L40 34L45 51L32 41L19 51L24 34L10 24L27 24L32 8Z"/>
          </svg>
        `,
      },
    ],
  },

  {
    title: "Сколько времени вы готовы посвятить себе?",
    description:
      "Подберём программу, которая комфортно впишется в ваш день.",
    options: [
      {
        value: "short",
        label: "До 60 минут",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="34" r="20"/>
            <path d="M32 34V21M32 34L42 39"/>
            <path d="M25 8H39M32 8V14"/>
          </svg>
        `,
      },
      {
        value: "medium",
        label: "60–90 минут",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="34" r="20"/>
            <path d="M32 34V20M32 34L22 42"/>
            <path d="M25 8H39M32 8V14"/>
          </svg>
        `,
      },
      {
        value: "long",
        label: "90–120 минут",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="34" r="20"/>
            <path d="M32 34V19M32 34L43 26"/>
            <path d="M25 8H39M32 8V14"/>
          </svg>
        `,
      },
      {
        value: "unlimited",
        label: "Хочу полноценный SPA-день",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="11"/>
            <path d="M32 6V14M32 50V58M6 32H14M50 32H58"/>
            <path d="M13 13L19 19M45 45L51 51M51 13L45 19M19 45L13 51"/>
          </svg>
        `,
      },
    ],
  },

  {
    title: "Какой результат для вас сейчас важнее всего?",
    description:
      "Последний шаг — и мы покажем персональную рекомендацию Verde.",
    options: [
      {
        value: "glow",
        label: "Свежий и сияющий вид",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="11"/>
            <path d="M32 7V15M32 49V57M7 32H15M49 32H57"/>
            <path d="M14 14L20 20M44 44L50 50M50 14L44 20M20 44L14 50"/>
          </svg>
        `,
      },
      {
        value: "calm",
        label: "Спокойствие и лёгкость",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M12 39C20 26 26 20 32 20C38 20 44 26 52 39"/>
            <path d="M18 39C22 46 27 50 32 50C37 50 42 46 46 39"/>
          </svg>
        `,
      },
      {
        value: "renewal",
        label: "Глубокое восстановление",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 54V18"/>
            <path d="M32 31C24 31 18 26 16 18C25 18 30 22 32 31Z"/>
            <path d="M32 40C41 40 47 34 49 25C40 25 34 30 32 40Z"/>
          </svg>
        `,
      },
      {
        value: "complete",
        label: "Комплексная трансформация",
        icon: `
          <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="20"/>
            <path d="M32 17L36 27L47 28L39 35L41 46L32 40L23 46L25 35L17 28L28 27L32 17Z"/>
          </svg>
        `,
      },
    ],
  },
];

function calculateResult(answers) {
  const [focus, feeling, duration, result] = answers;

  if (
    duration === "unlimited" ||
    result === "complete" ||
    feeling === "special"
  ) {
    return quizResults.signature;
  }

  if (focus === "hair") {
    return quizResults.hair;
  }

  if (focus === "body" || result === "renewal") {
    return quizResults.body;
  }

  if (
    focus === "relax" ||
    feeling === "stress" ||
    result === "calm"
  ) {
    return quizResults.relax;
  }

  return quizResults.face;
}

export function initQuiz() {
  const quiz = document.querySelector("[data-quiz]");

  if (!quiz) {
    return;
  }

  const questionContainer = quiz.querySelector("[data-quiz-question]");
  const progressCurrent = quiz.querySelector("[data-quiz-current]");
  const progressBar = quiz.querySelector("[data-quiz-progress]");
  const previousButton = quiz.querySelector("[data-quiz-previous]");
  const restartButton = quiz.querySelector("[data-quiz-restart]");

  let currentQuestionIndex = 0;
  let answers = [];

  const renderQuestion = () => {
    const question = quizQuestions[currentQuestionIndex];
    const progress =
      ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

    progressCurrent.textContent = String(currentQuestionIndex + 1).padStart(
      2,
      "0"
    );

    progressBar.style.width = `${progress}%`;

    previousButton.disabled = currentQuestionIndex === 0;

    questionContainer.innerHTML = `
      <div class="quiz-question">
        <p class="quiz-question__step">
          Вопрос ${currentQuestionIndex + 1} из ${quizQuestions.length}
        </p>

        <h3 class="quiz-question__title">
          ${question.title}
        </h3>

        <p class="quiz-question__description">
          ${question.description}
        </p>

        <div class="quiz-question__options">
          ${question.options
            .map(
              (option) => `
                <button
                  class="quiz-option"
                  type="button"
                  data-quiz-option="${option.value}"
                >
                  <span class="quiz-option__icon">
                    ${option.icon}
                  </span>

                  <span class="quiz-option__label">
                    ${option.label}
                  </span>

                  <span class="quiz-option__arrow">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12h14M14 7l5 5-5 5"/>
                    </svg>
                  </span>
                </button>
              `
            )
            .join("")}
        </div>
      </div>
    `;
  };

  const renderResult = () => {
    const result = calculateResult(answers);

    progressCurrent.textContent = "04";
    progressBar.style.width = "100%";
    previousButton.hidden = true;
    restartButton.hidden = false;

    questionContainer.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result__image-wrapper">
          <img
            class="quiz-result__image"
            src="${result.image}"
            alt="${result.title}"
          >

          <div class="quiz-result__image-overlay"></div>

          <span class="quiz-result__badge">
            Персональная рекомендация
          </span>
        </div>

        <div class="quiz-result__content">
          <p class="quiz-result__eyebrow">
            ${result.category}
          </p>

          <h3 class="quiz-result__title">
            ${result.title}
          </h3>

          <p class="quiz-result__description">
            ${result.description}
          </p>

          <div class="quiz-result__meta">
            <div>
              <span>Продолжительность</span>
              <strong>${result.duration}</strong>
            </div>

            <div>
              <span>Стоимость</span>
              <strong>${result.price}</strong>
            </div>
          </div>

          <div class="quiz-result__actions">
            <a
              class="button button--gold"
              href="#booking"
              data-quiz-booking="${result.title}"
            >
              Записаться на процедуру

              <svg
                class="button__icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M5 12h14M14 7l5 5-5 5"/>
              </svg>
            </a>

            <button
              class="quiz-result__restart"
              type="button"
              data-quiz-result-restart
            >
              Пройти заново
            </button>
          </div>
        </div>
      </div>
    `;
  };

  questionContainer.addEventListener("click", (event) => {
    const option = event.target.closest("[data-quiz-option]");

    if (option) {
      answers[currentQuestionIndex] = option.dataset.quizOption;

      if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex += 1;
        renderQuestion();
      } else {
        renderResult();
      }

      return;
    }

    const resultRestart = event.target.closest(
      "[data-quiz-result-restart]"
    );

    if (resultRestart) {
      currentQuestionIndex = 0;
      answers = [];
      previousButton.hidden = false;
      restartButton.hidden = true;
      renderQuestion();
    }
  });

  previousButton.addEventListener("click", () => {
    if (currentQuestionIndex === 0) {
      return;
    }

    currentQuestionIndex -= 1;
    answers = answers.slice(0, currentQuestionIndex);
    renderQuestion();
  });

  restartButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    answers = [];
    previousButton.hidden = false;
    restartButton.hidden = true;
    renderQuestion();
  });

  renderQuestion();
}