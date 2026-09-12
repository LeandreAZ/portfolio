import { translations } from "./translations.js";

const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: light)");
const languageButton = document.querySelector(".language-toggle");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");

const frenchToEnglish = new Map(translations);
const englishToFrench = new Map(translations.map(([fr, en]) => [en, fr]));

function savedLanguage() {
  try {
    return localStorage.getItem("portfolio-language") === "en" ? "en" : "fr";
  } catch (_) {
    return "fr";
  }
}

function localized(fr, en) {
  return root.lang === "en" ? en : fr;
}

function applyLanguage(language, persist = false) {
  const dictionary = language === "en" ? frenchToEnglish : englishToFrench;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => {
    const value = node.nodeValue;
    const trimmed = value.trim();
    const translated = dictionary.get(trimmed);
    if (!translated) return;
    node.nodeValue = value.replace(trimmed, translated);
  });
  root.lang = language;
  languageButton?.setAttribute(
    "aria-label",
    language === "fr"
      ? "Afficher le site en anglais"
      : "Display the website in French",
  );
  if (languageButton)
    languageButton.textContent = language === "fr" ? "EN" : "FR";
  if (persist) {
    try {
      localStorage.setItem("portfolio-language", language);
    } catch (_) {}
  }
  document.title = document.querySelector(".legal-main")
    ? localized(
        "Mentions légales - Léandre Ribeiro Gonçalves",
        "Legal notice - Léandre Ribeiro Gonçalves",
      )
    : localized(
        "Léandre Ribeiro Gonçalves - Développeur web | Portfolio",
        "Léandre Ribeiro Gonçalves - Web developer | Portfolio",
      );
  document
    .querySelector(".main-nav")
    ?.setAttribute(
      "aria-label",
      localized("Navigation principale", "Main navigation"),
    );
  document
    .querySelector(".footer-links")
    ?.setAttribute(
      "aria-label",
      localized("Liens du pied de page", "Footer links"),
    );
  document
    .querySelector("#scroll-top")
    ?.setAttribute("aria-label", localized("Retour en haut", "Back to top"));
  themeButton?.setAttribute(
    "title",
    localized("Changer de thème", "Change theme"),
  );
  themeButton?.setAttribute(
    "aria-label",
    root.dataset.theme === "dark"
      ? localized("Passer au thème clair", "Switch to light theme")
      : localized("Passer au thème sombre", "Switch to dark theme"),
  );
  menuButton?.setAttribute(
    "aria-label",
    nav?.classList.contains("open")
      ? localized("Fermer le menu", "Close menu")
      : localized("Ouvrir le menu", "Open menu"),
  );
  document
    .querySelectorAll(".slider-prev, .lightbox-prev")
    .forEach((item) =>
      item.setAttribute(
        "aria-label",
        localized("Image précédente", "Previous image"),
      ),
    );
  document
    .querySelectorAll(".slider-next, .lightbox-next")
    .forEach((item) =>
      item.setAttribute(
        "aria-label",
        localized("Image suivante", "Next image"),
      ),
    );
  document
    .querySelector(".lightbox-close")
    ?.setAttribute("aria-label", localized("Fermer", "Close"));
}

function getSavedTheme() {
  try {
    const saved = localStorage.getItem("portfolio-theme");
    return saved === "light" || saved === "dark" ? saved : null;
  } catch (_) {
    return null;
  }
}

function applyTheme(theme, persist = false) {
  root.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem("portfolio-theme", theme);
    } catch (_) {}
  }
  themeButton?.setAttribute(
    "aria-label",
    theme === "dark"
      ? localized("Passer au thème clair", "Switch to light theme")
      : localized("Passer au thème sombre", "Switch to dark theme"),
  );
  themeMeta?.setAttribute("content", theme === "dark" ? "#17191b" : "#f3eee5");
}

applyTheme(getSavedTheme() || (colorSchemeQuery.matches ? "light" : "dark"));
applyLanguage(savedLanguage());
languageButton?.addEventListener("click", () =>
  applyLanguage(root.lang === "fr" ? "en" : "fr", true),
);
themeButton?.addEventListener("click", () =>
  applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true),
);
colorSchemeQuery.addEventListener?.("change", (event) => {
  if (!getSavedTheme()) applyTheme(event.matches ? "light" : "dark");
});

function closeMenu() {
  nav?.classList.remove("open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute(
    "aria-label",
    localized("Ouvrir le menu", "Open menu"),
  );
}

menuButton?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
  menuButton.setAttribute(
    "aria-label",
    isOpen
      ? localized("Fermer le menu", "Close menu")
      : localized("Ouvrir le menu", "Open menu"),
  );
});
document
  .querySelectorAll(".main-nav a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("click", (event) => {
  if (!nav?.classList.contains("open")) return;
  if (!event.target.closest(".nav-wrap")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 760) closeMenu();
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08 },
  );
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".main-nav a")];
if ("IntersectionObserver" in window) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) =>
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`,
          ),
        );
      });
    },
    { rootMargin: "-30% 0px -60% 0px" },
  );
  sections.forEach((section) => activeObserver.observe(section));
}

const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox?.querySelector(".lightbox-stage img");
const lightboxCounter = lightbox?.querySelector(".lightbox-counter");
const lightboxPrev = lightbox?.querySelector(".lightbox-prev");
const lightboxNext = lightbox?.querySelector(".lightbox-next");
const lightboxClose = lightbox?.querySelector(".lightbox-close");
let lightboxImages = [];
let lightboxIndex = 0;
let touchStartX = null;
let lightboxOpener = null;
let scrollPosition = 0;

function setSliderIndex(slider, index) {
  const images = [...slider.querySelectorAll("img")];
  if (!images.length) return;
  const normalizedIndex = (index + images.length) % images.length;
  slider.dataset.index = String(normalizedIndex);
  images.forEach((image, imageIndex) => {
    const active = imageIndex === normalizedIndex;
    image.classList.toggle("active", active);
    image.setAttribute("aria-hidden", String(!active));
  });
  const counter = slider.querySelector(".slider-counter");
  if (counter)
    counter.textContent = `${normalizedIndex + 1} / ${images.length}`;
}

function moveSlider(slider, step) {
  setSliderIndex(slider, Number(slider.dataset.index || 0) + step);
}

function renderLightbox() {
  if (!lightboxImage || !lightboxImages.length) return;
  const image = lightboxImages[lightboxIndex];
  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt;
  if (lightboxCounter)
    lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
  const multiple = lightboxImages.length > 1;
  lightboxPrev?.toggleAttribute("hidden", !multiple);
  lightboxNext?.toggleAttribute("hidden", !multiple);
}

function setPageInert(inert) {
  document
    .querySelectorAll("body > header, body > main, body > footer, #scroll-top")
    .forEach((element) => {
      element.inert = inert;
    });
}

function openLightbox(slider) {
  if (!lightbox || !slider) return;
  lightboxImages = [...slider.querySelectorAll("img")];
  lightboxIndex = Number(slider.dataset.index || 0);
  lightboxOpener =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : slider;
  renderLightbox();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  scrollPosition = window.scrollY;
  document.body.classList.add("lightbox-open");
  document.body.style.top = `-${scrollPosition}px`;
  setPageInert(true);
  lightboxClose?.focus();
}

function moveLightbox(step) {
  if (!lightboxImages.length) return;
  lightboxIndex =
    (lightboxIndex + step + lightboxImages.length) % lightboxImages.length;
  renderLightbox();
}

function closeLightbox() {
  if (!lightbox?.classList.contains("open")) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  document.body.style.top = "";
  setPageInert(false);
  window.scrollTo(0, scrollPosition);
  lightboxImage?.removeAttribute("src");
  lightboxOpener?.focus();
  lightboxOpener = null;
}

document.querySelectorAll("[data-slider]").forEach((slider) => {
  const previous = slider.querySelector(".slider-prev");
  const next = slider.querySelector(".slider-next");
  setSliderIndex(slider, 0);
  previous?.addEventListener("click", (event) => {
    event.stopPropagation();
    moveSlider(slider, -1);
  });
  next?.addEventListener("click", (event) => {
    event.stopPropagation();
    moveSlider(slider, 1);
  });
  slider.addEventListener("click", (event) => {
    if (event.target.closest(".slider-prev, .slider-next")) return;
    openLightbox(slider);
  });
  slider.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(slider);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveSlider(slider, -1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveSlider(slider, 1);
    }
  });
});

lightboxPrev?.addEventListener("click", (event) => {
  event.stopPropagation();
  moveLightbox(-1);
});
lightboxNext?.addEventListener("click", (event) => {
  event.stopPropagation();
  moveLightbox(1);
});
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox || event.target.closest(".lightbox-close"))
    closeLightbox();
});
lightbox?.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
  },
  { passive: true },
);
lightbox?.addEventListener(
  "touchend",
  (event) => {
    if (touchStartX === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const delta = endX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) > 45) moveLightbox(delta > 0 ? -1 : 1);
  },
  { passive: true },
);

document.addEventListener("keydown", (event) => {
  if (!lightbox?.classList.contains("open")) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeLightbox();
    return;
  }
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
  if (event.key !== "Tab") return;
  const focusable = [
    ...lightbox.querySelectorAll(
      'button:not([hidden]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  ].filter(
    (element) => !element.disabled && element.getClientRects().length > 0,
  );
  if (!focusable.length) {
    event.preventDefault();
    return;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const scrollTopButton = document.querySelector("#scroll-top");
window.addEventListener(
  "scroll",
  () => scrollTopButton?.classList.toggle("visible", window.scrollY > 500),
  { passive: true },
);
scrollTopButton?.addEventListener("click", () =>
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  }),
);

if (window.lucide) window.lucide.createIcons();

const interestGrid = document.querySelector(".interest-grid");
const journeyGrid = interestGrid?.closest(".journey-grid");
let interestLayoutFrame = 0;

function spansMultipleLines(element) {
  if (!element) return false;
  const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);
  return (
    lineHeight > 0 && element.getBoundingClientRect().height > lineHeight * 1.5
  );
}

function updateInterestLayout() {
  if (!interestGrid || !journeyGrid) return;

  journeyGrid.classList.remove("journey-stacked");
  interestGrid.classList.remove("interest-stacked");

  const naturalColumns = getComputedStyle(journeyGrid)
    .gridTemplateColumns.trim()
    .split(/\s+/);
  const descriptions = [...interestGrid.querySelectorAll("article > p")];

  if (naturalColumns.length > 1 && descriptions.some(spansMultipleLines)) {
    journeyGrid.classList.add("journey-stacked");
  }

  void interestGrid.offsetWidth;
  const chessDescription = interestGrid.querySelector(
    "article:first-child > p",
  );
  interestGrid.classList.toggle(
    "interest-stacked",
    spansMultipleLines(chessDescription),
  );
}

function scheduleInterestLayout() {
  cancelAnimationFrame(interestLayoutFrame);
  interestLayoutFrame = requestAnimationFrame(updateInterestLayout);
}

scheduleInterestLayout();
window.addEventListener("resize", scheduleInterestLayout, { passive: true });
languageButton?.addEventListener("click", scheduleInterestLayout);
document.fonts?.ready?.then(scheduleInterestLayout);
