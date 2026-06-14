/* =========================================================
   Cabinet Saint-Martin — JS partagé (multi-pages)
   ========================================================= */

// --- Ombre / flou du header au scroll ---
const header = document.getElementById("header");
if (header) {
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// --- Menu mobile (hamburger) ---
const hamburger = document.getElementById("hamburger");
const navMobile = document.getElementById("navMobile");
if (hamburger && navMobile) {
  hamburger.addEventListener("click", () => {
    const open = navMobile.classList.toggle("open");
    hamburger.classList.toggle("active");
    hamburger.setAttribute("aria-expanded", String(open));
  });
  navMobile.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      navMobile.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

// --- Défilement fluide pour les ancres internes (offset header) ---
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const id = link.getAttribute("href");
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  });
});

// --- Révélation au scroll (Intersection Observer) ---
const animated = document.querySelectorAll(".animate-on-scroll");
if (animated.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
  );
  animated.forEach((el) => observer.observe(el));
}

// --- Année dynamique (footer) ---
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// --- Validation du formulaire de contact (page Contact) ---
const form = document.getElementById("contactForm");
if (form) {
  const confirmMsg = document.getElementById("formConfirm");

  const validators = {
    prenom: (v) => (v.trim() ? "" : "Merci d'indiquer votre prénom."),
    nom: (v) => (v.trim() ? "" : "Merci d'indiquer votre nom."),
    email: (v) => {
      if (!v.trim()) return "Merci d'indiquer votre email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Email invalide.";
      return "";
    },
    motif: (v) => (v.trim() ? "" : "Merci de sélectionner un motif."),
    message: (v) => (v.trim() ? "" : "Merci de saisir votre message."),
  };

  const showError = (name, message) => {
    const field = form.querySelector(`#${name}`);
    const error = form.querySelector(`#${name}Error`);
    const wrapper = field.closest(".field");
    error.textContent = message;
    wrapper.classList.toggle("has-error", Boolean(message));
  };

  Object.keys(validators).forEach((name) => {
    const field = form.querySelector(`#${name}`);
    if (field) {
      field.addEventListener("blur", () => {
        showError(name, validators[name](field.value));
      });
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    Object.keys(validators).forEach((name) => {
      const field = form.querySelector(`#${name}`);
      const message = validators[name](field.value);
      showError(name, message);
      if (message) ok = false;
    });
    if (!ok) return;
    confirmMsg.hidden = false;
    form.reset();
    Object.keys(validators).forEach((name) => showError(name, ""));
    setTimeout(() => {
      confirmMsg.hidden = true;
    }, 6000);
  });
}
