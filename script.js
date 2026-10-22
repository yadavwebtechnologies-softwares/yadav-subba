
/* =========================================================
   YADAV SUBBA — PORTFOLIO INTERACTIONS
   Lightweight, accessible, dependency-free
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".hamburger");
  const navigation = document.querySelector(".primary-nav");
  const navigationLinks = document.querySelectorAll(
    ".primary-nav a"
  );

  const mobileBreakpoint = window.matchMedia("(max-width: 760px)");

  function closeMenu() {
    if (!menuButton || !navigation) return;

    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");

    navigation.classList.remove("active", "open");
  }

  function openMenu() {
    if (!menuButton || !navigation) return;

    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation menu");

    navigation.classList.add("active");
    navigation.classList.remove("open");
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isExpanded =
        menuButton.getAttribute("aria-expanded") === "true";

      if (isExpanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navigationLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuButton.focus();
      }
    });

    document.addEventListener("click", (event) => {
      const isExpanded =
        menuButton.getAttribute("aria-expanded") === "true";

      if (
        isExpanded &&
        !navigation.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMenu();
      }
    });

    mobileBreakpoint.addEventListener("change", (event) => {
      if (!event.matches) {
        closeMenu();
      }
    });
  }

  /* Automatically update the copyright year. */
  const yearElement = document.querySelector("#current-year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* Ensure internal anchor links close the mobile menu. */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (menuButton && navigation) {
        closeMenu();
      }
    });
  });
});
