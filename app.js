/* ==========================================================================
   SNEHA TIWARY — PORTFOLIO APP LOGIC
   All content (skills/projects) lives locally in JS — no APIs, no backend.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderSkills();
  renderProjects();
  initHeaderScroll();
  initMobileMenu();
  initSmoothScroll();
  initActiveNavOnScroll();
  initThemeToggle();
  initScrollReveal();
  initContactForm();
  document.getElementById("current-year").textContent = new Date().getFullYear();
});

/* ==========================================================================
   1. LOCAL DATA — SKILLS
   ========================================================================== */
const skillsData = [
  {
    category: "Languages",
    items: ["C", "C++", "Java", "JavaScript", "SQL"],
  },
  {
    category: "Frontend Development",
    items: ["HTML", "CSS", "JavaScript (DOM)", "Responsive Design", "Git Basics for UI"],
  },
  {
    category: "Backend & Databases",
    items: [ "MySQL"],
  },
  {
    category: "Tools & Platforms",
    items: ["Git & GitHub", "VS Code"],
  },
];

/* ==========================================================================
   2. LOCAL DATA — PROJECTS
   ========================================================================== */
const projectsData = [
  {
    title: "FoodieHub",
    category: "Web App",
    description:
      "A responsive restaurant discovery layout built to practice modern CSS. Uses Flexbox and Grid to lay out menus, cards, and filters that adapt cleanly from mobile to desktop.",
    tags: ["HTML", "CSS", "Flexbox", "Grid", "Responsive","JavaScript"],
    liveLink: "https://foodhub-1.netlify.app/",
  },
  {
    title: "Tour-and-Travel Website",
    category: "Web Development",
    description:
      "A responsive travel booking website designed to help users explore destinations, view tour packages, and plan their trips with an intuitive and user-friendly interface.",
    tags: ["HTML", "CSS", "Responsive"],
    liveLink: "https://snehatiwary79-lgtm.github.io/Tour-and-Travel-Website/"
  },
  {
    title: "Coffee Website",
    category: "Web Development",
    description:
      "A modern and responsive coffee shop website showcasing menu items, featured beverages, customer reviews, and contact information with an engaging and visually appealing user interface.",
    tags: ["HTML", "CSS", "JavaScript", "Responsive"],
    liveLink: "https://snehatiwary79-lgtm.github.io/Coffee-Website/",
  }
];

/* ==========================================================================
   3. DYNAMIC RENDERING
   ========================================================================== */

/**
 * Renders the skills section by looping over skillsData and injecting
 * a category block with semantic badge elements for each skill.
 */
function renderSkills() {
  const container = document.getElementById("skills-container");
  const markup = skillsData
    .map((group) => {
      const badges = group.items
        .map((skill) => `<span class="skill-badge">${skill}</span>`)
        .join("");

      return `
        <div class="skill-category">
          <h3 class="skill-category-title">${group.category}</h3>
          <div class="skill-badges">${badges}</div>
        </div>
      `;
    })
    .join("");

  container.innerHTML = markup;
}

/**
 * Renders the projects grid by looping over projectsData and injecting
 * a card for each project, including tech tags and external links.
 */
function renderProjects() {
  const grid = document.getElementById("projects-grid");
  const markup = projectsData
    .map((project) => {
      const tags = project.tags
        .map((tag) => `<span class="tag-chip">${tag}</span>`)
        .join("");

      return `
        <article class="project-card reveal">
          <div class="project-card-top">
            <span class="project-category mono">${project.category}</span>
          </div>
          <h3>${project.title}</h3>
          <p>${project.description}</p>
          <div class="project-tags">${tags}</div>
          <div class="project-links">
            <a href="${project.liveLink}" class="project-link" target="_blank" rel="noopener noreferrer">
              View Live ↗
            </a>
          </div>
        </article>
      `;
    })
    .join("");

  grid.innerHTML = markup;

  // Newly injected project cards need to be picked up by the reveal observer
  observeRevealElements(grid.querySelectorAll(".reveal"));
}

/* ==========================================================================
   4. HEADER SCROLL STATE
   ========================================================================== */
function initHeaderScroll() {
  const header = document.getElementById("site-header");

  const handleScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 12);
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
}

/* ==========================================================================
   5. MOBILE HAMBURGER MENU
   ========================================================================== */
function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  hamburger.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });

  // Close the mobile menu whenever a nav link is clicked
  navMenu.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

/* ==========================================================================
   6. SMOOTH SCROLL NAVIGATION
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();
      const offset = document.getElementById("site-header").offsetHeight;
      const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset + 1;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* 7. ACTIVE NAV LINK ON SCROLL (Intersection Observer) */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isMatch);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      // Pick the entry that is most visible in the viewport right now
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) {
        setActiveLink(visibleEntry.target.id);
      }
    },
    {
      rootMargin: `-${document.getElementById("site-header").offsetHeight + 10}px 0px -55% 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/* 8. THEME TOGGLE (persisted via localStorage) */
function initThemeToggle() {
  const toggleBtn = document.getElementById("theme-toggle");
  const STORAGE_KEY = "portfolio-theme";

  const applyTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    toggleBtn.setAttribute("aria-pressed", String(theme === "light"));
  };

  // Load saved preference, default to dark theme
  const savedTheme = localStorage.getItem(STORAGE_KEY) || "dark";
  applyTheme(savedTheme);

  toggleBtn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });
}

/* ==========================================================================
   9. SCROLL REVEAL ANIMATIONS (Intersection Observer)
   ========================================================================== */
let revealObserver;

function initScrollReveal() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  observeRevealElements(document.querySelectorAll(".reveal"));
}

/**
 * Attaches the shared reveal observer to a node list of elements.
 * Used both on initial load and for elements injected dynamically later.
 */
function observeRevealElements(elements) {
  if (!revealObserver) return;
  elements.forEach((el) => revealObserver.observe(el));
}

/* ==========================================================================
   10. CONTACT FORM VALIDATION (client-side only, no backend submission)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const successMessage = document.getElementById("form-success");

  const fields = {
    name: {
      input: document.getElementById("name"),
      error: document.getElementById("name-error"),
      validate: (value) => {
        if (!value.trim()) return "Please enter your name.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      },
    },
    email: {
      input: document.getElementById("email"),
      error: document.getElementById("email-error"),
      validate: (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return "Please enter your email address.";
        if (!emailPattern.test(value.trim())) return "Please enter a valid email address.";
        return "";
      },
    },
    subject: {
      input: document.getElementById("subject"),
      error: document.getElementById("subject-error"),
      validate: (value) => {
        if (!value.trim()) return "Please add a subject.";
        if (value.trim().length < 3) return "Subject must be at least 3 characters.";
        return "";
      },
    },
    message: {
      input: document.getElementById("message"),
      error: document.getElementById("message-error"),
      validate: (value) => {
        if (!value.trim()) return "Please write a message.";
        if (value.trim().length < 10) return "Message must be at least 10 characters.";
        return "";
      },
    },
  };

  // Validate a single field and reflect the result inline
  const validateField = (key) => {
    const field = fields[key];
    const errorText = field.validate(field.input.value);
    const group = field.input.closest(".form-group");

    group.classList.toggle("invalid", Boolean(errorText));
    field.error.textContent = errorText;
    field.input.setAttribute("aria-invalid", String(Boolean(errorText)));

    return !errorText;
  };

  // Clear inline errors as the user types/corrects a field
  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener("input", () => validateField(key));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.classList.remove("visible");

    const results = Object.keys(fields).map((key) => validateField(key));
    const isFormValid = results.every(Boolean);

    if (!isFormValid) {
      // Focus the first invalid field for a smoother correction flow
      const firstInvalidKey = Object.keys(fields).find(
        (key) => fields[key].input.closest(".form-group").classList.contains("invalid")
      );
      if (firstInvalidKey) fields[firstInvalidKey].input.focus();
      return;
    }

    // No backend target — simulate a successful local submission
    successMessage.classList.add("visible");
    form.reset();
    Object.keys(fields).forEach((key) => {
      fields[key].input.closest(".form-group").classList.remove("invalid");
      fields[key].error.textContent = "";
    });

    setTimeout(() => successMessage.classList.remove("visible"), 5000);
  });
}