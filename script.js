const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

function submitForm(event) {
  event.preventDefault();
  document.getElementById("formNote").textContent =
    "Thank you! This demo form is working. Connect it to email/backend before publishing.";
  event.target.reset();
  return false;
}


// ===== Repeatable slow scroll reveal =====
// Sections animate every time they enter the viewport — both when scrolling
// down and when scrolling back up. They are NOT unobserved, so the effect
// can replay again and again.
const revealItems = document.querySelectorAll(
  "section.reveal, .feature-card.reveal, .facility-card.reveal"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Entering viewport: play the slow slide-up + fade-in.
        entry.target.classList.add("visible");
      } else {
        // Leaving viewport: reset so the animation can play again
        // when the user scrolls back in the opposite direction.
        entry.target.classList.remove("visible");
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -45px 0px"
  });

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// ===== Subtle mouse-follow 3D tilt =====
document.querySelectorAll(".tilt-card").forEach(card => {
  card.addEventListener("mousemove", e => {
    if (window.innerWidth <= 760) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -4;
    const rotateY = ((x / rect.width) - 0.5) * 4;
    card.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-7px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});


// ===== Slow, smooth scroll experience =====
const progressBar = document.querySelector(".scroll-progress span");
const cursorGlow = document.querySelector(".cursor-glow");

let scrollTicking = false;
function updateScrollEffects(){
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;

  // Very subtle depth movement for hero only; intentionally restrained.
  const hero = document.querySelector(".hero");
  if (hero && window.innerWidth > 760) {
    const heroContent = hero.querySelector(".hero-content");
    if (heroContent && scrollTop < hero.offsetHeight) {
      heroContent.style.transform = `translate3d(0, ${scrollTop * 0.055}px, 0)`;
    }
  }
  scrollTicking = false;
}
window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    requestAnimationFrame(updateScrollEffects);
    scrollTicking = true;
  }
}, {passive:true});
updateScrollEffects();

// Cursor-follow ambient glow — subtle, not distracting.
if (cursorGlow && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let glowX = mouseX, glowY = mouseY;

  window.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, {passive:true});

  function animateGlow(){
    glowX += (mouseX - glowX) * .075;
    glowY += (mouseY - glowY) * .075;
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
}


// ===== V11: robust gallery lightbox / VIEW button =====
document.addEventListener("DOMContentLoaded", () => {
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

function openGalleryImage(item) {
  const img = item?.querySelector("img");
  if (!img || !lightbox || !lightboxImage) return;
  lightboxImage.src = img.getAttribute("src") || img.currentSrc;
  lightboxImage.alt = img.alt || "ALOR DISHA PUBLIC SCHOOL photo";
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
}

document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => openGalleryImage(item));
  item.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openGalleryImage(item);
    }
  });
});

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLightbox();
});

});
