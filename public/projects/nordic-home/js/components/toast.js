let timer;
export function showToast(message,type="success"){
  const toast=document.querySelector("[data-toast]");
  if(!toast)return;
  toast.textContent=message;
  toast.dataset.type=type;
  toast.classList.add("is-visible");
  clearTimeout(timer);
  timer=setTimeout(()=>toast.classList.remove("is-visible"),2200);
}
