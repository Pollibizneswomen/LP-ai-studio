"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const header = document.getElementById("header");
    const loader = document.querySelector(".page-loader");
    const menuToggle = document.querySelector(".menu-toggle");
    const mobileLinks = document.querySelectorAll(".mobile-menu a");
    const faqItems = document.querySelectorAll(".faq-item");
    const projectSlider = document.querySelector("[data-project-slider]");
    const reviewSlider = document.querySelector("[data-review-slider]");
    const projectPrev = document.querySelector("[data-project-prev]");
    const projectNext = document.querySelector("[data-project-next]");
    const reviewPrev = document.querySelector("[data-review-prev]");
    const reviewNext = document.querySelector("[data-review-next]");
    const videoButton = document.querySelector("[data-video-button]");
    const videoModal = document.querySelector("[data-video-modal]");
    const videoCloseButtons = document.querySelectorAll("[data-video-close]");
    const contactForm = document.getElementById("contactForm");

    const hideLoader = () => {
        window.setTimeout(() => loader?.classList.add("is-hidden"), 450);
    };

    if (document.readyState === "complete") {
        hideLoader();
    } else {
        window.addEventListener("load", hideLoader, { once: true });
        window.setTimeout(hideLoader, 1800);
    }

    const syncHeader = () => {
        header?.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });

    menuToggle?.addEventListener("click", () => {
        const isOpen = body.classList.toggle("menu-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
    });

    mobileLinks.forEach(link => {
        link.addEventListener("click", () => {
            body.classList.remove("menu-open");
            menuToggle?.setAttribute("aria-expanded", "false");
            menuToggle?.setAttribute("aria-label", "Открыть меню");
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            body.classList.remove("menu-open");
            closeVideo();
        }
    });

    faqItems.forEach((item, index) => {
        const button = item.querySelector(".faq-item__button");

        button?.addEventListener("click", () => {
            const wasOpen = item.classList.contains("is-open");

            faqItems.forEach(other => {
                other.classList.remove("is-open");
                other.querySelector(".faq-item__button")?.setAttribute("aria-expanded", "false");
            });

            if (!wasOpen) {
                item.classList.add("is-open");
                button.setAttribute("aria-expanded", "true");
            }
        });

        if (index === 0) {
            item.classList.add("is-open");
            button?.setAttribute("aria-expanded", "true");
        }
    });

    function scrollSlider(slider, direction) {
        if (!slider) return;
        const card = slider.firstElementChild;
        const gap = Number.parseFloat(getComputedStyle(slider).gap || "0");
        const distance = (card?.getBoundingClientRect().width || slider.clientWidth * 0.8) + gap;
        slider.scrollBy({ left: direction * distance, behavior: "smooth" });
    }

    projectPrev?.addEventListener("click", () => scrollSlider(projectSlider, -1));
    projectNext?.addEventListener("click", () => scrollSlider(projectSlider, 1));
    reviewPrev?.addEventListener("click", () => scrollSlider(reviewSlider, -1));
    reviewNext?.addEventListener("click", () => scrollSlider(reviewSlider, 1));

    function openVideo() {
        if (!videoModal) return;
        videoModal.classList.add("is-open");
        videoModal.setAttribute("aria-hidden", "false");
        body.classList.add("modal-open");
        videoModal.querySelector(".video-modal__close")?.focus();
    }

    function closeVideo() {
        if (!videoModal?.classList.contains("is-open")) return;
        videoModal.classList.remove("is-open");
        videoModal.setAttribute("aria-hidden", "true");
        body.classList.remove("modal-open");
        videoButton?.focus();
    }

    videoButton?.addEventListener("click", openVideo);
    videoCloseButtons.forEach(button => button.addEventListener("click", closeVideo));

    const revealTargets = document.querySelectorAll(
        ".section-heading, .about__grid, .service-card, .project-card, .features__intro, .feature, .process__timeline, .review-card, .faq__intro, .faq-item, .contacts__content, .contact-form"
    );

    revealTargets.forEach((element, index) => {
        element.setAttribute("data-reveal", "");
        element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    });

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px" });

    revealTargets.forEach(element => revealObserver.observe(element));

    const processTimeline = document.querySelector(".process__timeline");
    if (processTimeline) {
        const processObserver = new IntersectionObserver(entries => {
            if (entries[0]?.isIntersecting) {
                processTimeline.classList.add("is-visible");
                processObserver.disconnect();
            }
        }, { threshold: 0.25 });
        processObserver.observe(processTimeline);
    }

    const navLinks = [...document.querySelectorAll(".navigation a")];
    const sections = navLinks
        .map(link => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const sectionObserver = new IntersectionObserver(entries => {
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        navLinks.forEach(link => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
        });
    }, { threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -55% 0px" });

    sections.forEach(section => sectionObserver.observe(section));

    const phoneInput = document.getElementById("phone");

    phoneInput?.addEventListener("input", event => {
        let digits = event.target.value.replace(/\D/g, "");

        if (digits.startsWith("8")) digits = "7" + digits.slice(1);
        if (!digits.startsWith("7")) digits = "7" + digits;
        digits = digits.slice(0, 11);

        const parts = [
            digits.slice(1, 4),
            digits.slice(4, 7),
            digits.slice(7, 9),
            digits.slice(9, 11)
        ];

        let value = "+7";
        if (parts[0]) value += ` (${parts[0]}`;
        if (parts[0]?.length === 3) value += ")";
        if (parts[1]) value += ` ${parts[1]}`;
        if (parts[2]) value += `-${parts[2]}`;
        if (parts[3]) value += `-${parts[3]}`;

        event.target.value = value;
    });

    const setFieldError = (field, message) => {
        const wrapper = field.closest(".contact-form__field");
        const error = wrapper?.querySelector(".contact-form__error");
        if (error) error.textContent = message;
        field.setAttribute("aria-invalid", message ? "true" : "false");
    };

    contactForm?.addEventListener("submit", event => {
        event.preventDefault();

        const name = contactForm.elements.name;
        const phone = contactForm.elements.phone;
        const agreement = contactForm.elements.agreement;
        const status = contactForm.querySelector(".contact-form__status");

        let valid = true;

        setFieldError(name, "");
        setFieldError(phone, "");
        if (status) status.textContent = "";

        if (name.value.trim().length < 2) {
            setFieldError(name, "Введите имя");
            valid = false;
        }

        if (phone.value.replace(/\D/g, "").length !== 11) {
            setFieldError(phone, "Введите полный номер телефона");
            valid = false;
        }

        if (!agreement.checked) {
            if (status) status.textContent = "Подтвердите согласие на обработку данных.";
            valid = false;
        }

        if (!valid) return;

        const submitButton = contactForm.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.style.opacity = ".65";

        window.setTimeout(() => {
            contactForm.reset();
            submitButton.disabled = false;
            submitButton.style.opacity = "";
            if (status) status.textContent = "Спасибо! Заявка принята. Мы свяжемся с вами в ближайшее время.";
        }, 700);
    });
});