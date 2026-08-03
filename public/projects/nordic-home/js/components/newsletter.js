import{showToast}from"./toast.js";
export function initNewsletter(){
  const form=document.querySelector("[data-newsletter]");
  if(!form)return;
  form.addEventListener("submit",event=>{
    event.preventDefault();
    const input=form.querySelector("input");
    if(!input.checkValidity()){input.focus();showToast("Введите корректный e-mail","error");return;}
    showToast("Спасибо! Вы подписаны на Nordic Notes");
    form.reset();
  });
}
