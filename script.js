(() => {
    "use strict";

    const orderButton = document.getElementById("orderButton");
    const navContactButton = document.getElementById("navContactButton");
    const contactForm = document.getElementById("contactForm");
    const nameInput = document.getElementById("name");
    const contactInput = document.getElementById("contact");
    const messageInput = document.getElementById("message");
    const formMessage = document.getElementById("formMessage");
    const successCard = document.getElementById("successCard");
    const themeButton = document.getElementById("themeButton");
    const contactsSection = document.getElementById("contacts");
    const projectFileInput = document.getElementById("projectFile");
    const fileName = document.getElementById("fileName");

    const CLOUDINARY_CLOUD_NAME = "xhnpsuzv";
    const CLOUDINARY_UPLOAD_PRESET = "lp_ai_client_files";

    async function uploadFileToCloudinary(file) {
    if (!file) {
        return "";
    }

    const cloudinaryForm = new FormData();

    cloudinaryForm.append("file", file);
    cloudinaryForm.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
    );

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
            method: "POST",
            body: cloudinaryForm,
        }
    );

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
        throw new Error(
            data?.error?.message ||
            "Не удалось загрузить файл"
        );
    }

    return data.secure_url;
}

// ===========================
// FORM AUTOSAVE
// ===========================

const FORM_STORAGE_KEY = "lp-ai-contact-form";

function saveFormData() {
    localStorage.setItem(
        FORM_STORAGE_KEY,
        JSON.stringify({
            name: nameInput.value,
            contact: contactInput.value,
            message: messageInput.value,
        })
    );
}

function loadFormData() {
    const saved = localStorage.getItem(FORM_STORAGE_KEY);

    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        nameInput.value = data.name || "";
        contactInput.value = data.contact || "";
        messageInput.value = data.message || "";
    } catch {
        localStorage.removeItem(FORM_STORAGE_KEY);
    }
}

function clearFormData() {
    localStorage.removeItem(FORM_STORAGE_KEY);
}

[nameInput, contactInput, messageInput].forEach((input) => {
    input.addEventListener("input", saveFormData);
});

loadFormData();


    // =========================
    // SCROLL TO CONTACTS
    // =========================

    function scrollToContacts() {
        if (!contactsSection) {
            return;
        }

        contactsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    orderButton?.addEventListener(
        "click",
        scrollToContacts
    );

    navContactButton?.addEventListener(
        "click",
        scrollToContacts
    );


    // =========================
    // CONTACT FORM
    // =========================

    projectFileInput?.addEventListener("change", () => {
        if (!fileName) return;

        if (projectFileInput.files.length > 0) {
            fileName.textContent =
                projectFileInput.files[0].name;
        } else {
            fileName.textContent =
                "Выберите файл";
        }
    });

    contactForm?.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            const name =
                document.getElementById("name")?.value.trim() ?? "";

            const contact =
                document.getElementById("contact")?.value.trim() ?? "";

            const message =
                document.getElementById("message")?.value.trim() ?? "";

            const projectFile =
                projectFileInput?.files?.[0] ?? null;

            const submitButton =
                contactForm.querySelector('button[type="submit"]');

            if (!name || !contact || !message) {
                if (formMessage) {
                    formMessage.textContent =
                        "Пожалуйста, заполните все поля.";

                    formMessage.style.color = "#B4534C";
                }

                return;
            }

            if (!submitButton) {
                console.error("Кнопка отправки формы не найдена.");
                return;
            }

            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = "Отправляем...";

            if (formMessage) {
                formMessage.textContent = "Отправляем вашу заявку...";
                formMessage.className =
                    "form-message is-visible is-loading";
            }

            const sendingStartedAt = Date.now();

            try {

                let fileUrl = "";

                if (projectFile) {
                    fileUrl = await uploadFileToCloudinary(projectFile);
                }
            
                const response = await fetch("/api/send-telegram", {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        contact,
                        message,
                        fileUrl
                    })
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message || "Не удалось отправить заявку"
                    );
                }

                if (formMessage) {
                    formMessage.textContent =
                        `Спасибо, ${name}! Мы получили вашу заявку и скоро свяжемся с вами.`;

                    formMessage.className =
                        "form-message is-visible is-success";
                }

                
                contactForm.reset();
                clearFormData(); 

            } catch (error) {
                console.error("Ошибка отправки формы:", error);

                if (formMessage) {
                    formMessage.textContent =
                        "Не удалось отправить заявку. Попробуйте ещё раз через несколько минут.";

                    formMessage.className =
                        "form-message is-visible is-error";
                }

            } finally {
                // Надпись «Отправляем...» будет видна хотя бы 700 мс
                const elapsedTime = Date.now() - sendingStartedAt;
                const remainingTime = Math.max(700 - elapsedTime, 0);

                await new Promise((resolve) => {
                    setTimeout(resolve, remainingTime);
                });

                submitButton.disabled = false;
                submitButton.textContent =
                    originalButtonText || "Отправить заявку";
            }
        }
    );


    // =========================
    // DARK THEME
    // =========================

    function applyTheme(theme) {
        const darkThemeEnabled = theme === "dark";

        document.body.classList.toggle(
            "dark-theme",
            darkThemeEnabled
        );

        if (themeButton) {
            themeButton.textContent =
                darkThemeEnabled ? "☀️" : "🌙";

            themeButton.setAttribute(
                "aria-pressed",
                String(darkThemeEnabled)
            );
        }
    }

    let savedTheme = "light";

    try {
        savedTheme =
            localStorage.getItem("lp-theme") ?? "light";
    } catch {
        savedTheme = "light";
    }

    applyTheme(savedTheme);

    themeButton?.addEventListener(
        "click",
        () => {
            const nextTheme =
                document.body.classList.contains("dark-theme")
                    ? "light"
                    : "dark";

            applyTheme(nextTheme);

            try {
                localStorage.setItem(
                    "lp-theme",
                    nextTheme
                );
            } catch {
                // localStorage недоступен
            }
        }
    );


    // =========================
    // SCROLL ANIMATION
    // =========================

    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver =
            new IntersectionObserver(
                (entries) => {
                    entries.forEach(
                        (entry) => {
                            if (entry.isIntersecting) {
                                entry.target.classList.add(
                                    "active"
                                );

                                revealObserver.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.15
                }
            );

        revealElements.forEach(
            (element) => {
                revealObserver.observe(element);
            }
        );
    } else {
        revealElements.forEach(
            (element) => {
                element.classList.add("active");
            }
        );
    }

})();

console.log("L&P Studio работает");

/* ===========================
   AI Chat
=========================== */

const aiChatButton = document.getElementById("aiChatButton");
const aiChatWindow = document.getElementById("aiChatWindow");
const aiChatClose = document.getElementById("aiChatClose");

const aiWelcomeMessage =
    document.getElementById("aiWelcomeMessage");

const aiMessageInput =
    document.getElementById("aiMessageInput");

const sendAiMessage =
    document.getElementById("sendAiMessage");

const aiChatBody =
    document.querySelector(".ai-chat-body");

let aiWelcomeShown = false;


/* Открытие чата */

if (aiChatButton && aiChatWindow) {

    aiChatButton.addEventListener("click", () => {

        const isOpening =
            !aiChatWindow.classList.contains("is-open");

        aiChatWindow.classList.toggle("is-open");

        if (
            isOpening &&
            !aiWelcomeShown &&
            aiWelcomeMessage
        ) {

            setTimeout(() => {

                aiWelcomeMessage.classList.add("is-visible");
                aiWelcomeShown = true;

            }, 300);

        }

    });

}


/* Закрытие чата */

if (aiChatClose && aiChatWindow) {

    aiChatClose.addEventListener("click", () => {

        aiChatWindow.classList.remove("is-open");

    });

}


/* Отправка сообщения */

if (sendAiMessage && aiMessageInput && aiChatBody) {

    sendAiMessage.addEventListener("click", sendMessage);

    aiMessageInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            event.preventDefault();
            sendMessage();

        }

    });

}


/* Добавление сообщения пользователя */

async function sendMessage() {
    if (!aiMessageInput || !aiChatBody) return;

    const text = aiMessageInput.value.trim();

    if (!text) return;

    const chatHistory = [];

    aiChatBody
        .querySelectorAll(".ai-message")
        .forEach(message => {
            const messageText = message.textContent.trim();

            if (!messageText) return;

            chatHistory.push({
                role: message.classList.contains("ai-message--user")
                    ? "user"
                    : "model",
                text: messageText,
            });
        });

    // Сообщение пользователя
    const userMessage = document.createElement("div");
    userMessage.className = "ai-message ai-message--user";
    userMessage.textContent = text;

    aiChatBody.appendChild(userMessage);

    aiMessageInput.value = "";
    aiMessageInput.focus();

    aiChatBody.scrollTop = aiChatBody.scrollHeight;

    // Индикатор "AI печатает..."
    const typing = document.createElement("div");
    typing.className = "ai-typing";

    typing.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    aiChatBody.appendChild(typing);
    aiChatBody.scrollTop = aiChatBody.scrollHeight;

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: text,
                history: chatHistory,
            }),
        });

        const data = await response.json();

        typing.remove();

        const aiMessage = document.createElement("div");
        aiMessage.className = "ai-message";

        if (!response.ok) {
            aiMessage.textContent =
                data.error || "Произошла ошибка при обращении к AI.";
        } else {
            aiMessage.textContent = data.reply;
        }

        aiChatBody.appendChild(aiMessage);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
    } catch (error) {
        console.error(error);

        typing.remove();

        const aiMessage = document.createElement("div");
        aiMessage.className = "ai-message";
        aiMessage.textContent = "Произошла ошибка. Попробуйте ещё раз.";

        aiChatBody.appendChild(aiMessage);
        aiChatBody.scrollTop = aiChatBody.scrollHeight;
    }
}
