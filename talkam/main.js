const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const demo = document.querySelector("[data-translator]");
const demoButton = document.querySelector("[data-demo-button]");
const demoLabel = document.querySelector("[data-demo-label]");
const demoStatus = document.querySelector("[data-demo-status]");

function closeNavigation() {
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
}

navToggle?.addEventListener("click", () => {
  const willOpen = !document.body.classList.contains("nav-open");
  document.body.classList.toggle("nav-open", willOpen);
  navToggle.setAttribute("aria-expanded", String(willOpen));
  navToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
});

navLinks.forEach((link) => link.addEventListener("click", closeNavigation));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

demoButton?.addEventListener("click", () => {
  if (!demo || demo.dataset.state === "listening") return;

  demo.dataset.state = "listening";
  demoButton.disabled = true;
  demoLabel.textContent = "Listening...";
  demoStatus.textContent = "Capturing your words...";

  window.setTimeout(() => {
    demo.dataset.state = "translated";
    demoButton.disabled = false;
    demoLabel.textContent = "Play it again";
    demoStatus.textContent = "Clear English, ready to send.";
  }, 1200);
});

if (window.lucide) {
  window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
}
