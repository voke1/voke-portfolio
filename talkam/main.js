const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const demo = document.querySelector("[data-translator]");
const demoButton = document.querySelector("[data-demo-button]");
const demoLabel = document.querySelector("[data-demo-label]");
const demoStatus = document.querySelector("[data-demo-status]");
const sourceMessage = document.querySelector("#source-message");
const translatedMessage = document.querySelector("#translated-message");
const siteHeader = document.querySelector(".site-header");
const parallaxSurface = document.querySelector("[data-parallax]");
const revealItems = document.querySelectorAll("[data-reveal]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const translationExamples = [
  {
    source: '"Abeg tell am say I go call later."',
    result: '"Please let him know that I will call later."',
  },
  {
    source: '"I dey road. I go reach there soon."',
    result: '"I am on my way. I will be there soon."',
  },
  {
    source: '"Make we move the meeting reach tomorrow morning."',
    result: '"Could we move the meeting to tomorrow morning?"',
  },
  {
    source: '"Abeg send me the price before evening."',
    result: '"Please send me the price before this evening."',
  },
];
let translationIndex = 0;

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
    translationIndex = (translationIndex + 1) % translationExamples.length;
    const example = translationExamples[translationIndex];

    if (sourceMessage) sourceMessage.textContent = example.source;
    if (translatedMessage) translatedMessage.textContent = example.result;
    demo.dataset.state = "translated";
    demoButton.disabled = false;
    demoLabel.textContent = "Play it again";
    demoStatus.textContent = "Clear English, ready to send.";
  }, 1200);
});

function updateHeader() {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 20);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  document.documentElement.classList.add("motion-ready");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (parallaxSurface && !reducedMotion.matches && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  parallaxSurface.addEventListener("pointermove", (event) => {
    const bounds = parallaxSurface.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;
    parallaxSurface.style.setProperty("--parallax-x", `${offsetX * 8}px`);
    parallaxSurface.style.setProperty("--parallax-y", `${offsetY * 6}px`);
  });

  parallaxSurface.addEventListener("pointerleave", () => {
    parallaxSurface.style.setProperty("--parallax-x", "0px");
    parallaxSurface.style.setProperty("--parallax-y", "0px");
  });
}

if (window.lucide) {
  window.lucide.createIcons({ attrs: { "stroke-width": 1.8 } });
}
