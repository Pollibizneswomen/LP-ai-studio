import { services } from "../data/services.js";
import { masters } from "../data/masters.js";

const availableTimes = [
  "09:00",
  "10:30",
  "12:00",
  "13:30",
  "15:00",
  "16:30",
  "18:00",
  "19:30",
];

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function createAvailableDates() {
  const dates = [];
  const today = new Date();

  for (let index = 1; index <= 14; index += 1) {
    const date = new Date(today);

    date.setDate(today.getDate() + index);

    const value = date.toISOString().split("T")[0];

    dates.push({
      value,
      weekday: new Intl.DateTimeFormat("ru-RU", {
        weekday: "short",
      }).format(date),
      day: new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
      }).format(date),
      month: new Intl.DateTimeFormat("ru-RU", {
        month: "short",
      }).format(date),
    });
  }

  return dates;
}

export function initBooking() {
  const booking = document.querySelector("[data-booking]");
  const successModal = document.querySelector("[data-booking-success]");

  if (!booking || !successModal) {
    return;
  }

  const content = booking.querySelector("[data-booking-content]");
  const backButton = booking.querySelector("[data-booking-back]");
  const nextButton = booking.querySelector("[data-booking-next]");
  const hint = booking.querySelector("[data-booking-hint]");
  const progress = booking.querySelector("[data-booking-progress]");
  const currentStepLabel = booking.querySelector(
    "[data-booking-current-step]"
  );

  const stepIndicators = booking.querySelectorAll(
    "[data-booking-step-indicator]"
  );

  const successService = successModal.querySelector(
    "[data-booking-success-service]"
  );

  const successDate = successModal.querySelector(
    "[data-booking-success-date]"
  );

  const closeButtons = successModal.querySelectorAll(
    "[data-booking-success-close]"
  );

  const availableDates = createAvailableDates();

  let currentStep = 0;
  let lastFocusedElement = null;

  const state = {
    serviceId: "",
    masterId: "",
    date: "",
    time: "",
    name: "",
    phone: "",
    email: "",
    comment: "",
  };

  const getSelectedService = () =>
    services.find((service) => service.id === state.serviceId);

  const getSelectedMaster = () =>
    masters.find((master) => master.id === state.masterId);

  const canContinue = () => {
    if (currentStep === 0) {
      return Boolean(state.serviceId);
    }

    if (currentStep === 1) {
      return Boolean(state.masterId);
    }

    if (currentStep === 2) {
      return Boolean(state.date && state.time);
    }

    if (currentStep === 3) {
      return Boolean(
        state.name.trim() &&
          state.phone.trim().length >= 10 &&
          state.email.trim()
      );
    }

    return true;
  };

  const updateNavigation = () => {
    backButton.disabled = currentStep === 0;
    nextButton.disabled = !canContinue();

    nextButton.innerHTML =
      currentStep === 4
        ? `
          Подтвердить запись

          <svg
            class="button__icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M5 12H19M14 7L19 12L14 17"></path>
          </svg>
        `
        : `
          Продолжить

          <svg
            class="button__icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M5 12H19M14 7L19 12L14 17"></path>
          </svg>
        `;

    const hints = [
      "Выберите одну процедуру",
      "Выберите специалиста",
      "Выберите дату и время",
      "Заполните обязательные поля",
      "Проверьте данные перед подтверждением",
    ];

    hint.textContent = hints[currentStep];
  };

  const updateProgress = () => {
    const percentage = ((currentStep + 1) / 5) * 100;

    progress.style.width = `${percentage}%`;

    currentStepLabel.textContent = String(currentStep + 1).padStart(
      2,
      "0"
    );

    stepIndicators.forEach((indicator, index) => {
      indicator.classList.toggle("is-active", index === currentStep);
      indicator.classList.toggle("is-complete", index < currentStep);
    });
  };

  const renderServiceStep = () => {
    content.innerHTML = `
      <div class="booking-panel">
        <p class="booking-panel__eyebrow">
          Шаг 1
        </p>

        <h3 class="booking-panel__title">
          Какой ритуал вы хотите выбрать?
        </h3>

        <p class="booking-panel__description">
          После выбора услуги мы покажем подходящих специалистов.
        </p>

        <div class="booking-services">
          ${services
            .map(
              (service) => `
                <button
                  class="booking-service ${
                    state.serviceId === service.id ? "is-selected" : ""
                  }"
                  type="button"
                  data-booking-service="${service.id}"
                >
                  <span class="booking-service__image">
                    <img
                      src="${service.image}"
                      alt="${service.title}"
                    >
                  </span>

                  <span class="booking-service__content">
                    <span class="booking-service__category">
                      ${service.category}
                    </span>

                    <strong>${service.title}</strong>

                    <small>
                      ${service.duration} · ${service.price}
                    </small>
                  </span>

                  <span class="booking-service__check">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12L10 17L19 7"></path>
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

  const renderMasterStep = () => {
    content.innerHTML = `
      <div class="booking-panel">
        <p class="booking-panel__eyebrow">
          Шаг 2
        </p>

        <h3 class="booking-panel__title">
          Выберите своего мастера
        </h3>

        <p class="booking-panel__description">
          Все специалисты Verde работают по единым стандартам качества.
        </p>

        <div class="booking-masters">
          ${masters
            .map(
              (master) => `
                <button
                  class="booking-master ${
                    state.masterId === master.id ? "is-selected" : ""
                  }"
                  type="button"
                  data-booking-master="${master.id}"
                >
                  <span class="booking-master__image">
                    <img
                      src="${master.image}"
                      alt="${master.name}"
                    >
                  </span>

                  <span class="booking-master__content">
                    <span>${master.role}</span>
                    <strong>${master.name}</strong>
                    <small>${master.experience}</small>
                  </span>

                  <span class="booking-master__check">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M5 12L10 17L19 7"></path>
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

  const renderDateStep = () => {
    content.innerHTML = `
      <div class="booking-panel">
        <p class="booking-panel__eyebrow">
          Шаг 3
        </p>

        <h3 class="booking-panel__title">
          Выберите дату и время
        </h3>

        <p class="booking-panel__description">
          Доступные окна показаны для демонстрации интерфейса.
        </p>

        <div class="booking-date-section">
          <h4 class="booking-date-section__title">
            Дата визита
          </h4>

          <div class="booking-dates">
            ${availableDates
              .map(
                (date) => `
                  <button
                    class="booking-date ${
                      state.date === date.value ? "is-selected" : ""
                    }"
                    type="button"
                    data-booking-date="${date.value}"
                  >
                    <span>${date.weekday}</span>
                    <strong>${date.day}</strong>
                    <small>${date.month}</small>
                  </button>
                `
              )
              .join("")}
          </div>
        </div>

        <div class="booking-date-section">
          <h4 class="booking-date-section__title">
            Время визита
          </h4>

          <div class="booking-times">
            ${availableTimes
              .map(
                (time, index) => `
                  <button
                    class="booking-time ${
                      state.time === time ? "is-selected" : ""
                    } ${index === 3 || index === 6 ? "is-unavailable" : ""}"
                    type="button"
                    data-booking-time="${time}"
                    ${index === 3 || index === 6 ? "disabled" : ""}
                  >
                    ${time}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>
      </div>
    `;
  };

  const renderContactsStep = () => {
    content.innerHTML = `
      <div class="booking-panel">
        <p class="booking-panel__eyebrow">
          Шаг 4
        </p>

        <h3 class="booking-panel__title">
          Как с вами связаться?
        </h3>

        <p class="booking-panel__description">
          Администратор использует контакты только для подтверждения записи.
        </p>

        <div class="booking-form">
          <label class="booking-field">
            <span>Ваше имя *</span>

            <input
              type="text"
              value="${state.name}"
              placeholder="Введите имя"
              data-booking-name
            >
          </label>

          <label class="booking-field">
            <span>Телефон *</span>

            <input
              type="tel"
              value="${state.phone}"
              placeholder="+7 (___) ___-__-__"
              data-booking-phone
            >
          </label>

          <label class="booking-field booking-field--wide">
            <span>Электронная почта *</span>

            <input
              type="email"
              value="${state.email}"
              placeholder="example@mail.ru"
              data-booking-email
            >
          </label>

          <label class="booking-field booking-field--wide">
            <span>Комментарий</span>

            <textarea
              rows="4"
              placeholder="Например, пожелания к процедуре"
              data-booking-comment
            >${state.comment}</textarea>
          </label>

          <label class="booking-consent booking-field--wide">
            <input
              type="checkbox"
              checked
              data-booking-consent
            >

            <span class="booking-consent__check">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12L10 17L19 7"></path>
              </svg>
            </span>

            <span>
              Я согласна на обработку данных для подтверждения записи.
            </span>
          </label>
        </div>
      </div>
    `;
  };

  const renderConfirmationStep = () => {
    const service = getSelectedService();
    const master = getSelectedMaster();

    content.innerHTML = `
      <div class="booking-panel booking-panel--confirmation">
        <p class="booking-panel__eyebrow">
          Шаг 5
        </p>

        <h3 class="booking-panel__title">
          Ваш день в Verde
        </h3>

        <p class="booking-panel__description">
          Проверьте данные записи перед подтверждением.
        </p>

        <div class="booking-summary">
          <div class="booking-summary__hero">
            <img
              src="${service?.image ?? ""}"
              alt="${service?.title ?? ""}"
            >

            <div>
              <span>${service?.category ?? ""}</span>
              <strong>${service?.title ?? ""}</strong>
              <small>
                ${service?.duration ?? ""} · ${service?.price ?? ""}
              </small>
            </div>
          </div>

          <dl class="booking-summary__details">
            <div>
              <dt>Мастер</dt>
              <dd>${master?.name ?? ""}</dd>
            </div>

            <div>
              <dt>Дата</dt>
              <dd>${formatDate(state.date)}</dd>
            </div>

            <div>
              <dt>Время</dt>
              <dd>${state.time}</dd>
            </div>

            <div>
              <dt>Гость</dt>
              <dd>${state.name}</dd>
            </div>

            <div>
              <dt>Телефон</dt>
              <dd>${state.phone}</dd>
            </div>

            <div>
              <dt>Почта</dt>
              <dd>${state.email}</dd>
            </div>
          </dl>

          <div class="booking-schedule">
            <p class="booking-schedule__eyebrow">
              Ваш день в Verde
            </p>

            <div class="booking-schedule__items">
              <div>
                <span>01</span>

                <p>
                  <strong>${state.time}</strong>
                  Встреча и приветственный чай
                </p>
              </div>

              <div>
                <span>02</span>

                <p>
                  <strong>+10 минут</strong>
                  Консультация специалиста
                </p>
              </div>

              <div>
                <span>03</span>

                <p>
                  <strong>Основное время</strong>
                  Выбранный ритуал Verde
                </p>
              </div>

              <div>
                <span>04</span>

                <p>
                  <strong>После процедуры</strong>
                  Рекомендации и отдых
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderCurrentStep = () => {
    if (currentStep === 0) {
      renderServiceStep();
    }

    if (currentStep === 1) {
      renderMasterStep();
    }

    if (currentStep === 2) {
      renderDateStep();
    }

    if (currentStep === 3) {
      renderContactsStep();
    }

    if (currentStep === 4) {
      renderConfirmationStep();
    }

    updateProgress();
    updateNavigation();
  };

  const openSuccessModal = () => {
    const service = getSelectedService();

    lastFocusedElement = document.activeElement;

    successService.textContent = service?.title ?? "";
    successDate.textContent = `${formatDate(state.date)}, ${state.time}`;

    successModal.classList.add("is-open");
    successModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    window.setTimeout(() => {
      successModal
        .querySelector("[data-booking-success-close]")
        ?.focus();
    }, 100);
  };

  const closeSuccessModal = () => {
    successModal.classList.remove("is-open");
    successModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    lastFocusedElement?.focus();
  };

  content.addEventListener("click", (event) => {
    const serviceButton = event.target.closest("[data-booking-service]");
    const masterButton = event.target.closest("[data-booking-master]");
    const dateButton = event.target.closest("[data-booking-date]");
    const timeButton = event.target.closest("[data-booking-time]");

    if (serviceButton) {
      state.serviceId = serviceButton.dataset.bookingService;
      renderServiceStep();
    }

    if (masterButton) {
      state.masterId = masterButton.dataset.bookingMaster;
      renderMasterStep();
    }

    if (dateButton) {
      state.date = dateButton.dataset.bookingDate;
      renderDateStep();
    }

    if (timeButton && !timeButton.disabled) {
      state.time = timeButton.dataset.bookingTime;
      renderDateStep();
    }

    updateNavigation();
  });

  content.addEventListener("input", (event) => {
    const target = event.target;

    if (target.matches("[data-booking-name]")) {
      state.name = target.value;
    }

    if (target.matches("[data-booking-phone]")) {
      state.phone = target.value;
    }

    if (target.matches("[data-booking-email]")) {
      state.email = target.value;
    }

    if (target.matches("[data-booking-comment]")) {
      state.comment = target.value;
    }

    updateNavigation();
  });

  backButton.addEventListener("click", () => {
    if (currentStep === 0) {
      return;
    }

    currentStep -= 1;
    renderCurrentStep();
  });

  nextButton.addEventListener("click", () => {
    if (!canContinue()) {
      return;
    }

    if (currentStep < 4) {
      currentStep += 1;
      renderCurrentStep();
      return;
    }

    openSuccessModal();
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeSuccessModal);
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      successModal.classList.contains("is-open")
    ) {
      closeSuccessModal();
    }
  });

  renderCurrentStep();
}