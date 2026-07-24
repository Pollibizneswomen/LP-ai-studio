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
    async (event)=>{

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



        try{

            const response = await fetch("/api/send-telegram",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({
                    name,
                    contact,
                    message
                })

            });


            const data = await response.json();


            if(data.success){

                formMessage.textContent =
                `Спасибо, ${name}! Заявка отправлена.`;

                formMessage.style.color="";

                contactForm.reset();

            }else{

                throw new Error();

            }


        }catch(error){

            formMessage.textContent =
            "Ошибка отправки. Попробуйте позже.";

            formMessage.style.color="#B4534C";

        }

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
