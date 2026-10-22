/* =========================================================
   YADAV SUBBA — SHARED PORTFOLIO JAVASCRIPT
   Compatible with index.html and style.css
   No external libraries
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initializeMobileNavigation();
  initializeSmoothScrolling();
  initializeActiveNavigation();
  initializeRevealAnimations();
  initializeCopyrightYear();
  secureExternalLinks();
});

/* ---------- 1. MOBILE NAVIGATION ---------- */

function initializeMobileNavigation() {
  const menuButton = document.querySelector(".hamburger");
  const navigation = document.querySelector(".primary-nav");

  if (!menuButton || !navigation) return;

  function setMenuState(isOpen) {
    navigation.classList.toggle("active", isOpen);
    menuButton.classList.toggle("is-open", isOpen);

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  }

  // Establish the initial state.
  setMenuState(false);

  menuButton.addEventListener("click", () => {
    const isCurrentlyOpen = navigation.classList.contains("active");
    setMenuState(!isCurrentlyOpen);
  });

  // Close the menu after selecting a link.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  // Close the menu when clicking outside it.
  document.addEventListener("click", (event) => {
    const clickedInsideNavigation = navigation.contains(event.target);
    const clickedMenuButton = menuButton.contains(event.target);

    if (
      navigation.classList.contains("active") &&
      !clickedInsideNavigation &&
      !clickedMenuButton
    ) {
      setMenuState(false);
    }
  });

  // Keyboard users can close the menu using Escape.
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      navigation.classList.contains("active")
    ) {
      setMenuState(false);
      menuButton.focus();
    }
  });

  // Keep desktop and mobile navigation states consistent.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) {
      setMenuState(false);
    }
  });
}

/* ---------- 2. SMOOTH ANCHOR SCROLLING ---------- */

function initializeSmoothScrolling() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      let targetElement;

      try {
        targetElement = document.querySelector(targetId);
      } catch {
        return;
      }

      // Leave ordinary browser navigation unchanged when
      // the referenced section does not exist.
      if (!targetElement) return;

      event.preventDefault();

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      targetElement.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start"
      });

      // Keep the address bar in sync with the selected section.
      if (window.location.hash !== targetId) {
        history.pushState(null, "", targetId);
      }
    });
  });
}

/* ---------- 3. ACTIVE PAGE NAVIGATION ---------- */

function initializeActiveNavigation() {
  const navigationLinks = document.querySelectorAll(
    ".primary-nav .nav-list a"
  );

  if (!navigationLinks.length) return;

  function normalizePath(path) {
    let normalized = path;

    try {
      normalized = decodeURIComponent(path);
    } catch {
      // Use the original path if decoding is not possible.
    }

    if (normalized.endsWith("/index.html")) {
      normalized = normalized.slice(0, -"index.html".length);
    }

    if (!normalized.endsWith("/")) {
      normalized += "/";
    }

    return normalized;
  }

  const currentPath = normalizePath(window.location.pathname);

  navigationLinks.forEach((link) => {
    let linkURL;

    try {
      linkURL = new URL(link.href, window.location.href);
    } catch {
      link.removeAttribute("aria-current");
      return;
    }

    // Section links such as index.html#teaching are not
    // treated as the current page.
    if (linkURL.hash) {
      if (link.getAttribute("aria-current") !== "page") {
        link.removeAttribute("aria-current");
      }
      return;
    }

    const linkPath = normalizePath(linkURL.pathname);

    if (linkURL.origin === window.location.origin &&
        linkPath === currentPath) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

/* ---------- 4. SCROLL REVEAL ANIMATIONS ---------- */

function initializeRevealAnimations() {
  const elements = document.querySelectorAll(
    ".section-title-bar, " +
    ".content-box, " +
    ".experience-card, " +
    ".skill-card, " +
    ".project-card, " +
    ".contact-details > div"
  );

  if (!elements.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Content remains visible when motion is disabled or
  // IntersectionObserver is unavailable.
  if (
    prefersReducedMotion ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  elements.forEach((element) => {
    element.classList.add("reveal-ready");
    observer.observe(element);
  });
}

/* ---------- 5. AUTOMATIC COPYRIGHT YEAR ---------- */

function initializeCopyrightYear() {
  const yearElement = document.getElementById("current-year");

  if (!yearElement) return;

  yearElement.textContent = String(new Date().getFullYear());
}

/* ---------- 6. EXTERNAL LINK SECURITY ---------- */

function secureExternalLinks() {
  const externalLinks = document.querySelectorAll(
    'a[target="_blank"]'
  );

  externalLinks.forEach((link) => {
    try {
      const destination = new URL(link.href, window.location.href);

      if (destination.origin !== window.location.origin) {
        const existingRel = new Set(
          (link.getAttribute("rel") || "")
            .split(/\s+/)
            .filter(Boolean)
        );

        existingRel.add("noopener");
        existingRel.add("noreferrer");

        link.setAttribute("rel", [...existingRel].join(" "));
      }
    } catch {
      // Do not interfere with links that cannot be parsed.
    }
  });
}

/* ---------- END OF PORTFOLIO JAVASCRIPT ---------- */
