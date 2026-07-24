(() => {
    "use strict";


    const orderButton = document.getElementById("orderButton");
    const navContactButton = document.getElementById("navContactButton");
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");
    const themeButton = document.getElementById("themeButton");
    const contactsSection = document.getElementById("contacts");



    // =========================
    // SCROLL TO CONTACTS
    // =========================


    function scrollToContacts() {

        if (!contactsSection) {
            return;
        }


        contactsSection.scrollIntoView({
            behavior:"smooth",
            block:"start"
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


    contactForm?.addEventListener(
        "submit",
        (event)=>{

            event.preventDefault();


            const name =
                document.getElementById("name")?.value.trim() ?? "";


            const contact =
                document.getElementById("contact")?.value.trim() ?? "";


            const message =
                document.getElementById("message")?.value.trim() ?? "";



            if(!name || !contact || !message){

                if(formMessage){

                    formMessage.textContent =
                    "Пожалуйста, заполните все поля.";

                    formMessage.style.color="#B4534C";

                }

                return;

            }



            if(formMessage){

                formMessage.textContent =
                `Спасибо, ${name}! Ваша заявка принята.`;

                formMessage.style.color="";

            }



            contactForm.reset();

        }
    );





    // =========================
    // DARK THEME
    // =========================


    function applyTheme(theme){


        const darkThemeEnabled =
            theme==="dark";


        document.body.classList.toggle(
            "dark-theme",
            darkThemeEnabled
        );



        if(themeButton){

            themeButton.textContent =
                darkThemeEnabled ? "☀️" : "🌙";


            themeButton.setAttribute(
                "aria-pressed",
                String(darkThemeEnabled)
            );

        }

    }




    let savedTheme="light";


    try{

        savedTheme =
            localStorage.getItem("lp-theme") ?? "light";

    }catch{

        savedTheme="light";

    }



    applyTheme(savedTheme);



    themeButton?.addEventListener(
        "click",
        ()=>{


            const nextTheme =
                document.body.classList.contains("dark-theme")
                ? "light"
                : "dark";



            applyTheme(nextTheme);



            try{

                localStorage.setItem(
                    "lp-theme",
                    nextTheme
                );

            }catch{

                // localStorage недоступен

            }


        }
    );





    // =========================
    // SCROLL ANIMATION
    // =========================


    const revealElements =
        document.querySelectorAll(".reveal");



    const revealObserver =
        new IntersectionObserver(
            (entries)=>{


                entries.forEach(
                    (entry)=>{


                        if(entry.isIntersecting){

                            entry.target.classList.add(
                                "active"
                            );

                        }


                    }
                );


            },
            {
                threshold:0.15
            }
        );



    revealElements.forEach(
        (element)=>{

            revealObserver.observe(element);

        }
    );


})();

console.log("L&P Studio работает");
