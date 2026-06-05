const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const navLinks = document.querySelectorAll(".nav__link");
const header = document.getElementById("header");
const scrollUpButton = document.getElementById("scroll-up");
const contactForm = document.getElementById("contact-form");
const productTrack = document.querySelector(".portfolio__container");
const revealSelectors = [
  ".home__title",
  ".home__subtitle",
  ".home__description",
  ".home__actions",
  ".home__proof",
  ".section__heading",
  ".about__visual",
  ".about__data",
  ".about__values > div",
  ".service-card",
  ".project-card",
  ".process-step",
  ".testimonial-card",
  ".contact__method",
  ".contact__form",
  ".footer__container > *",
];

function openMenu() {
  if (!navMenu || !navToggle) return;

  navMenu.classList.add("show-menu");
  document.body.classList.add("nav-open");
  navToggle.setAttribute("aria-expanded", "true");
}

function closeMenu() {
  if (!navMenu || !navToggle) return;

  navMenu.classList.remove("show-menu");
  document.body.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle?.addEventListener("click", openMenu);
navClose?.addEventListener("click", closeMenu);
navLinks.forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

function updateHeader() {
  if (!header) return;

  header.classList.toggle("scroll-header", window.scrollY >= 24);
}

function updateScrollButton() {
  if (!scrollUpButton) return;

  scrollUpButton.classList.toggle("show-scroll", window.scrollY >= 560);
}

function updateActiveLink() {
  const sections = document.querySelectorAll("section[id]");
  const offset = window.scrollY + 120;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    const sectionId = section.getAttribute("id");
    const link = document.querySelector(`.nav__menu a[href="#${sectionId}"]`);

    if (!link) return;

    link.classList.toggle("active-link", offset >= sectionTop && offset < sectionBottom);
  });
}

function handleScroll() {
  updateHeader();
  updateScrollButton();
  updateActiveLink();
}

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("load", handleScroll);

function setupRevealAnimations() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = revealSelectors
    .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
    .filter((item, index, items) => items.indexOf(item) === index);

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");

    if (item.matches(".project-card, .service-card, .process-step, .testimonial-card")) {
      item.classList.add("reveal--soft");
    }

    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 0.08}s`);
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

setupRevealAnimations();

function setupProductAutoScroll() {
  if (!productTrack) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = Array.from(productTrack.querySelectorAll(".project-card"));
  let intervalId;
  let resumeTimeoutId;
  let isInView = false;
  let isPaused = false;

  if (reduceMotion || cards.length < 2) {
    return;
  }

  const stop = () => {
    if (!intervalId) return;

    window.clearInterval(intervalId);
    intervalId = undefined;
  };

  const scrollToNextCard = () => {
    const currentLeft = productTrack.scrollLeft;
    const maxLeft = productTrack.scrollWidth - productTrack.clientWidth - 4;
    const trackLeft = productTrack.getBoundingClientRect().left;
    const cardPositions = cards.map((card) => (
      productTrack.scrollLeft + card.getBoundingClientRect().left - trackLeft
    ));
    const nextLeft = currentLeft >= maxLeft
      ? 0
      : cardPositions.find((position) => position > currentLeft + 12) || 0;

    productTrack.scrollTo({
      left: nextLeft,
      behavior: "smooth",
    });
  };

  const start = () => {
    if (productTrack.scrollWidth <= productTrack.clientWidth) return;
    if (intervalId || isPaused || !isInView) return;

    intervalId = window.setInterval(scrollToNextCard, 3600);
  };

  const pause = (resumeDelay = 0) => {
    isPaused = true;
    stop();
    window.clearTimeout(resumeTimeoutId);

    if (resumeDelay > 0) {
      resumeTimeoutId = window.setTimeout(() => {
        isPaused = false;
        start();
      }, resumeDelay);
    }
  };

  const resume = () => {
    isPaused = false;
    window.clearTimeout(resumeTimeoutId);
    start();
  };

  productTrack.addEventListener("pointerdown", () => pause(5000), { passive: true });
  productTrack.addEventListener("focusin", () => pause());
  productTrack.addEventListener("focusout", resume);
  productTrack.addEventListener("wheel", () => pause(4000), { passive: true });
  productTrack.addEventListener("touchstart", () => pause(5000), { passive: true });

  if (!("IntersectionObserver" in window)) {
    isInView = true;
    start();
    return;
  }

  const trackObserver = new IntersectionObserver(
    ([entry]) => {
      isInView = entry.isIntersecting;

      if (isInView) start();
      else stop();
    },
    { threshold: 0.35 }
  );

  trackObserver.observe(productTrack);

  window.setTimeout(() => {
    const rect = productTrack.getBoundingClientRect();
    isInView = rect.bottom > 0 && rect.top < window.innerHeight;
    start();
  }, 800);
}

setupProductAutoScroll();

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const project = String(formData.get("project") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const subject = `Project inquiry: ${project || "New AppEdge project"}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Project type: ${project}`,
    "",
    message,
  ].join("\n");

  window.location.href = `mailto:hello@appedgeng.com?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
});
