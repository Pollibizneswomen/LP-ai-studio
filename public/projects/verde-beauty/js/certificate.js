const DEFAULT_MESSAGE =
  "Пусть этот день подарит вам спокойствие, красоту и время только для себя.";

const DESIGN_CLASSES = [
  "certificate-preview--emerald",
  "certificate-preview--ivory",
  "certificate-preview--botanical",
];

function formatAmount(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return "10 000 ₽";
  }

  return `${new Intl.NumberFormat("ru-RU").format(numericValue)} ₽`;
}

export function initCertificate() {
  const certificate = document.querySelector("[data-certificate]");
  const successModal = document.querySelector(
    "[data-certificate-success]"
  );

  if (!certificate || !successModal) {
    return;
  }

  const preview = certificate.querySelector("[data-certificate-preview]");
  const designContainer = certificate.querySelector(
    "[data-certificate-designs]"
  );

  const amountContainer = certificate.querySelector(
    "[data-certificate-amounts]"
  );

  const customAmountInput = certificate.querySelector(
    "[data-certificate-custom-amount]"
  );

  const recipientInput = certificate.querySelector(
    "[data-certificate-recipient]"
  );

  const senderInput = certificate.querySelector(
    "[data-certificate-sender]"
  );

  const messageInput = certificate.querySelector(
    "[data-certificate-message]"
  );

  const messageCount = certificate.querySelector(
    "[data-certificate-message-count]"
  );

  const previewRecipient = certificate.querySelector(
    ".certificate-preview__recipient"
  );

  const previewMessage = certificate.querySelector(
    ".certificate-preview__message"
  );

  const previewSender = certificate.querySelector(
    "[data-certificate-preview-sender]"
  );

  const previewAmount = certificate.querySelector(
    "[data-certificate-preview-amount]"
  );

  const submitButton = certificate.querySelector(
    "[data-certificate-submit]"
  );

  const successAmount = successModal.querySelector(
    "[data-certificate-success-amount]"
  );

  const successCloseButtons = successModal.querySelectorAll(
    "[data-certificate-success-close]"
  );

  let selectedDesign = "emerald";
  let selectedAmount = 10000;
  let lastFocusedElement = null;

  const updatePreviewDesign = () => {
    preview.classList.remove(...DESIGN_CLASSES);
    preview.classList.add(
      `certificate-preview--${selectedDesign}`
    );
  };

  const updateAmount = (amount) => {
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 3000) {
      return;
    }

    selectedAmount = numericAmount;
    previewAmount.textContent = formatAmount(selectedAmount);
  };

  const updateTextContent = () => {
    const recipient = recipientInput.value.trim();
    const sender = senderInput.value.trim();
    const message = messageInput.value.trim();

    previewRecipient.textContent = recipient
      ? `Для ${recipient}`
      : "Для особенного человека";

    previewSender.textContent = sender || "С заботой";
    previewMessage.textContent = message || DEFAULT_MESSAGE;

    messageCount.textContent = String(messageInput.value.length);
  };

  const openSuccessModal = () => {
    lastFocusedElement = document.activeElement;

    successAmount.textContent = formatAmount(selectedAmount);

    successModal.classList.add("is-open");
    successModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    window.setTimeout(() => {
      successModal
        .querySelector("[data-certificate-success-close]")
        ?.focus();
    }, 100);
  };

  const closeSuccessModal = () => {
    successModal.classList.remove("is-open");
    successModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    lastFocusedElement?.focus();
  };

  designContainer.addEventListener("click", (event) => {
    const button = event.target.closest(
      "[data-certificate-design]"
    );

    if (!button) {
      return;
    }

    selectedDesign = button.dataset.certificateDesign;

    designContainer
      .querySelectorAll("[data-certificate-design]")
      .forEach((designButton) => {
        const isActive = designButton === button;

        designButton.classList.toggle("is-active", isActive);
        designButton.setAttribute(
          "aria-pressed",
          String(isActive)
        );
      });

    updatePreviewDesign();
  });

  amountContainer.addEventListener("click", (event) => {
    const button = event.target.closest(
      "[data-certificate-amount]"
    );

    if (!button) {
      return;
    }

    amountContainer
      .querySelectorAll("[data-certificate-amount]")
      .forEach((amountButton) => {
        amountButton.classList.toggle(
          "is-active",
          amountButton === button
        );
      });

    customAmountInput.value = "";
    updateAmount(button.dataset.certificateAmount);
  });

  customAmountInput.addEventListener("input", () => {
    const value = Number(customAmountInput.value);

    amountContainer
      .querySelectorAll("[data-certificate-amount]")
      .forEach((button) => {
        button.classList.remove("is-active");
      });

    if (value >= 3000) {
      updateAmount(value);
    }
  });

  recipientInput.addEventListener("input", updateTextContent);
  senderInput.addEventListener("input", updateTextContent);
  messageInput.addEventListener("input", updateTextContent);

  submitButton.addEventListener("click", openSuccessModal);

  successCloseButtons.forEach((button) => {
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

  updatePreviewDesign();
  updateAmount(selectedAmount);
  updateTextContent();
}