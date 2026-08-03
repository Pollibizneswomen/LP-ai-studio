
const ready = callback => document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", callback) : callback();
ready(() => {
  document.body.insertAdjacentHTML("afterbegin", '<a class="skip-link" href="#main-content">Перейти к содержанию</a><div class="page-loader" aria-hidden="true"><div class="page-loader__mark">NORDIC HOME</div></div>');
  const main = document.querySelector("main"); if (main && !main.id) main.id="main-content";
  window.addEventListener("load",()=>setTimeout(()=>document.querySelector(".page-loader")?.classList.add("is-hidden"),180));
  setTimeout(()=>document.querySelector(".page-loader")?.classList.add("is-hidden"),900);

  document.querySelectorAll("main section, main article, .product-card").forEach((el,i)=>{ if(!el.hasAttribute("data-reveal") && i<80) el.setAttribute("data-reveal",""); });
  const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:"0px 0px -30px"});
  document.querySelectorAll("[data-reveal]").forEach(el=>observer.observe(el));
  document.querySelectorAll("img:not([loading])").forEach((img,i)=>{if(i>1) img.loading="lazy"; img.decoding="async"});

  document.body.insertAdjacentHTML("beforeend", '<button class="back-to-top" type="button" aria-label="Наверх"><svg><use href="assets/icons/sprite.svg#chevron"></use></svg></button>');
  const topButton=document.querySelector(".back-to-top");
  const onScroll=()=>{topButton.classList.toggle("is-visible",scrollY>500);document.querySelector(".site-header")?.classList.toggle("is-scrolled",scrollY>10)};
  onScroll(); addEventListener("scroll",onScroll,{passive:true}); topButton.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));

  if(!localStorage.getItem("nordic-cookie-consent")){
    document.body.insertAdjacentHTML("beforeend", '<aside class="cookie-banner" aria-label="Настройки cookie"><p>Мы используем cookie, чтобы сохранять корзину, избранное и делать сайт удобнее. Подробнее — в <a href="privacy.html">политике конфиденциальности</a>.</p><div class="cookie-banner__actions"><button class="cookie-close" type="button">Только необходимые</button><button class="cookie-accept" type="button">Принять</button></div></aside>');
    const banner=document.querySelector(".cookie-banner"); requestAnimationFrame(()=>setTimeout(()=>banner.classList.add("is-visible"),500));
    banner.querySelectorAll("button").forEach(button=>button.addEventListener("click",()=>{localStorage.setItem("nordic-cookie-consent",button.classList.contains("cookie-accept")?"all":"essential");banner.classList.remove("is-visible");setTimeout(()=>banner.remove(),500)}));
  }

  document.querySelectorAll(".faq-question").forEach(button=>button.addEventListener("click",()=>{const item=button.closest(".faq-item");const open=item.classList.toggle("is-open");button.setAttribute("aria-expanded",String(open))}));
  document.querySelectorAll("[data-demo-form]").forEach(form=>form.addEventListener("submit",event=>{event.preventDefault(); if(!form.checkValidity()){form.reportValidity();return} form.reset(); const toast=document.querySelector("[data-toast]"); if(toast){toast.textContent="Спасибо! Мы свяжемся с вами в рабочее время.";toast.classList.add("is-visible");setTimeout(()=>toast.classList.remove("is-visible"),3200)} else alert("Спасибо! Сообщение отправлено.")}));
});
