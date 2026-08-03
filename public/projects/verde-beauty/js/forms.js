function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showFieldError(field) {
  field.classList.add("has-error");

  field.addEventListener(
    "input",
    () => {
      field.classList.remove("has-error");
    },
    {
      once: true,
    }
  );
}

export function initForms() {
  const notification = document.querySelector(
    "[data-site-notification]"
  );

  if (!notification) {
    return;
  }

  const notificationTitle = notification.querySelector(
    "[data-site-notification-title]"
  );

  const notificationText = notification.querySelector(
    "[data-site-notification-text]"
  );

  const notificationClose = notification.querySelector(
    "[data-site-notification-close]"
  );

  let notificationTimer = null;

  const showNotification = ({
    title,
    text,
    type = "success",
  }) => {
    window.clearTimeout(notificationTimer);

    notification.classList.remove(
      "site-notification--success",
      "site-notification--error"
    );

    notification.classList.add(
      `site-notification--${type}`,
      "is-visible"
    );

    notificationTitle.textContent = title;
    notificationText.textContent = text;

    notificationTimer = window.setTimeout(() => {
      notification.classList.remove("is-visible");
    }, 4500);
  };

  const closeNotification = () => {
    window.clearTimeout(notificationTimer);
    notification.classList.remove("is-visible");
  };

  notificationClose?.addEventListener(
    "click",
    closeNotification
  );

  const contactForm = document.querySelector(".contact-form");

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  const contactButton = contactForm?.querySelector(
    ".button"
  );

  contactButton?.addEventListener("click", () => {
    const nameInput = contactForm.querySelector(
      'input[type="text"]'
    );

    const phoneInput = contactForm.querySelector(
      'input[type="tel"]'
    );

    const messageInput = contactForm.querySelector(
      "textarea"
    );

    const isNameValid = Boolean(nameInput.value.trim());
    const isPhoneValid =
      phoneInput.value.replace(/\D/g, "").length >= 10;

    if (!isNameValid) {
      showFieldError(nameInput);
    }

    if (!isPhoneValid) {
      showFieldError(phoneInput);
    }

    if (!isNameValid || !isPhoneValid) {
      showNotification({
        title: "Проверьте данные",
        text: "Укажите имя и корректный номер телефона.",
        type: "error",
      });

      return;
    }

    showNotification({
      title: "Сообщение принято",
      text:
        "Администратор Verde свяжется с вами в ближайшее время.",
    });

    nameInput.value = "";
    phoneInput.value = "";
    messageInput.value = "";
  });

  const subscribeForm = document.querySelector(
    ".footer__column--subscribe form"
  );

  subscribeForm?.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  const subscribeInput = subscribeForm?.querySelector(
    'input[type="email"]'
  );

  const subscribeButton = subscribeForm?.querySelector(
    "button"
  );

  subscribeButton?.addEventListener("click", () => {
    const email = subscribeInput.value.trim();

    if (!isValidEmail(email)) {
      showFieldError(subscribeInput);

      showNotification({
        title: "Неверный адрес",
        text: "Введите корректную электронную почту.",
        type: "error",
      });

      return;
    }

    showNotification({
      title: "Подписка оформлена",
      text: "Новости и предложения Verde будут приходить на вашу почту.",
    });

    subscribeInput.value = "";
  });
}