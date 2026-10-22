/* =========================================================
   YADAV SUBBA PORTFOLIO
   Main JavaScript
   Compatible with index.html and style.css
   No external libraries required
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initializeMobileNavigation();
  initializeSmoothScrolling();
  initializeNavigationState();
  initializeRevealAnimations();
  initializeExternalLinks();
});

/* ---------- 1. MOBILE NAVIGATION ---------- */

function initializeMobileNavigation() {
  const menuButton = document.querySelector(".hamburger");
  const navigation = document.querySelector(".primary-nav");

  if (!menuButton || !navigation) return;

  function setMenuState(isOpen) {
    navigation.classList.toggle("active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    document.body.classList.toggle("menu-open", isOpen);
  }

  // Ensure the initial accessibility state is correct.
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation menu");

  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.contains("active");
    setMenuState(!isOpen);
  });

  // Close the menu after selecting a navigation link.
  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  // Close the menu when clicking outside it.
  document.addEventListener("click", (event) => {
    if (
      navigation.classList.contains("active") &&
      !navigation.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      setMenuState(false);
    }
  });

  // Close the menu with the Escape key.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
      menuButton.focus();
    }
  });

  // Reset the mobile menu when switching to desktop layout.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
      setMenuState(false);
    }
  });
}

/* ---------- 2. SMOOTH INTERNAL NAVIGATION ---------- */

function initializeSmoothScrolling() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      let target;

      try {
        target = document.querySelector(targetId);
      } catch {
        return;
      }

      // Allow normal browser behavior if the target does not exist.
      if (!target) return;

      event.preventDefault();

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });

      // Update the URL without triggering a full page reload.
      if (window.location.hash !== targetId) {
        history.pushState(null, "", targetId);
      }
    });
  });
}

/* ---------- 3. ACTIVE NAVIGATION STATE ---------- */

function initializeNavigationState() {
  const navigationLinks = document.querySelectorAll(
    '.primary-nav a[href^="#"]'
  );

  if (!navigationLinks.length) return;

  const sections = Array.from(navigationLinks)
    .map((link) => {
      const id = link.getAttribute("href");

      try {
        return id ? document.querySelector(id) : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  function updateActiveNavigation() {
    let activeSection = null;

    const header = document.querySelector(".site-header");
    const headerHeight = header ? header.offsetHeight : 0;
    const activationPoint = headerHeight + 120;

    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= activationPoint) {
        activeSection = section;
      }
    });

    navigationLinks.forEach((link) => {
      const targetId = link.getAttribute("href");
      const isActive =
        activeSection && targetId === `#${activeSection.id}`;

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  let scrollScheduled = false;

  function scheduleNavigationUpdate() {
    if (scrollScheduled) return;

    scrollScheduled = true;

    window.requestAnimationFrame(() => {
      updateActiveNavigation();
      scrollScheduled = false;
    });
  }

  window.addEventListener("scroll", scheduleNavigationUpdate, {
    passive: true
  });

  window.addEventListener("resize", scheduleNavigationUpdate);

  window.addEventListener("load", updateActiveNavigation);

  updateActiveNavigation();
}

/* ---------- 4. SUBTLE REVEAL ANIMATIONS ---------- */

function initializeRevealAnimations() {
  const elements = document.querySelectorAll(
    ".section-title-bar, .content-box, .experience-card, " +
    ".skill-card, .project-card, .contact-details > div"
  );

  if (!elements.length) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Keep all content visible if animation is disabled or unsupported.
  if (
    reduceMotion ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  elements.forEach((element) => {
    element.classList.add("reveal-ready");
  });

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
      rootMargin: "0px 0px -35px 0px"
    }
  );

  elements.forEach((element) => {
    observer.observe(element);
  });
}

/* ---------- 5. EXTERNAL LINKS ---------- */

function initializeExternalLinks() {
  const links = document.querySelectorAll('a[href^="http"]');

  links.forEach((link) => {
    try {
      const destination = new URL(link.href, window.location.href);

      if (destination.origin !== window.location.origin) {
        // Add security attributes only when opening a new tab.
        if (link.target === "_blank") {
          link.rel = "noopener noreferrer";
        }
      }
    } catch {
      // Leave invalid or unsupported links unchanged.
    }
  });
}

/* ---------- END OF MAIN SCRIPT ---------- */
