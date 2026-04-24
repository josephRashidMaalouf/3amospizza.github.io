// Scroll reveal via Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Trigger hero background zoom-out after load
const hero = document.getElementById("hero");
if (hero) {
  requestAnimationFrame(() => hero.classList.add("loaded"));
}
