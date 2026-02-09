// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.onclick = () => {
  navLinks.classList.toggle("active");
};

// Fade-in animation
const faders = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});
faders.forEach(el => observer.observe(el));

// Scroll to top
const topBtn = document.getElementById("topBtn");
window.onscroll = () => {
  topBtn.style.display = window.scrollY > 300 ? "block" : "none";
};

topBtn.onclick = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// REAL contact (mailto)
const form = document.getElementById("contactForm");
const statusText = document.getElementById("formStatus");

form.onsubmit = e => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  window.location.href =
    `mailto:buddhadeb24052000@gmail.com?subject=Portfolio Contact from ${name}&body=${message}%0A%0AFrom: ${email}`;

  statusText.textContent = "Opening your email app...";
  statusText.style.color = "#a66cff";
};
