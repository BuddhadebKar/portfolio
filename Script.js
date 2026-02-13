// ================= THEME TOGGLE =================
const themeToggle = document.getElementById('themeToggle');

// Get current theme from localStorage or default to dark
let currentTheme = localStorage.getItem('theme') || 'dark';

// Apply saved theme on load
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);
updateParticleColors(currentTheme);

// Theme toggle click handler
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        
        // Apply new theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button icon
        updateThemeIcon(newTheme);
        
        // Update particle colors
        updateParticleColors(newTheme);
    });
}

// Update theme toggle icon
function updateThemeIcon(theme) {
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? '🌙' : '☀️';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
}

// Update particle colors when theme changes
function updateParticleColors(theme) {
    const particles = document.querySelectorAll('.particle');
    const mouseParticles = document.querySelectorAll('.particle-mouse');
    const newColor = theme === 'dark' ? '#7dd3fc' : '#0284c7';
    const shadowColor = theme === 'dark' ? 'rgba(125, 211, 252, 0.8)' : 'rgba(2, 132, 199, 0.8)';
    
    particles.forEach(particle => {
        particle.style.background = newColor;
        particle.style.boxShadow = `0 0 15px ${newColor}`;
    });
    
    mouseParticles.forEach(particle => {
        particle.style.background = newColor;
        particle.style.boxShadow = `0 0 20px ${shadowColor}`;
    });
}

// ================= MOBILE MENU TOGGLE =================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

const toggleMenu = (forceState) => {
    if (navLinks) {
        navLinks.style.display = forceState ?? 
            (navLinks.style.display === "flex" ? "none" : "flex");
    }
};

if (menuToggle) {
    menuToggle.addEventListener("click", () => toggleMenu());
}

// Close menu when clicking a link (mobile)
if (navLinks) {
    document.querySelectorAll("#navLinks a").forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) toggleMenu("none");
        });
    });
}

// ================= SCROLL ANIMATIONS (All Cards & Fade Elements) =================
const observerConfig = { 
    threshold: 0.15,
    rootMargin: "0px 0px -30px 0px"
};

// Observer for fade-in elements and cards
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            
            // Add pulse animation to section headers when they appear
            if (entry.target.classList.contains("fade-in") && 
                entry.target.tagName === 'H2') {
                entry.target.style.animation = 'glow 1.5s ease';
                setTimeout(() => {
                    entry.target.style.animation = '';
                }, 1500);
            }
            
            // Unobserve fade-in elements after they appear
            if (entry.target.classList.contains("fade-in")) {
                scrollObserver.unobserve(entry.target);
            }
        }
    });
}, observerConfig);

// Observe all animated elements
document.querySelectorAll(".fade-in, .project-card, .exp-card, .edu-card").forEach(el => {
    if (el) scrollObserver.observe(el);
});

// ================= SCROLL TO TOP BUTTON =================
const topBtn = document.getElementById("topBtn");

if (topBtn) {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            topBtn.style.display = "block";
            topBtn.style.animation = "fadeIn 0.5s ease";
        } else {
            topBtn.style.display = "none";
        }
    });

    topBtn.addEventListener("click", () => {
        window.scrollTo({ 
            top: 0, 
            behavior: "smooth" 
        });
    });
}

// ================= CONTACT FORM (Demo) =================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        if (formStatus) {
            formStatus.textContent = "✨ Message sent successfully! ✨";
            formStatus.style.animation = "glow 1.5s ease";
            
            // Get form inputs and animate them
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.style.borderBottomColor = '#7dd3fc';
                setTimeout(() => {
                    input.style.borderBottomColor = '';
                }, 1000);
            });
        }
        
        contactForm.reset();
        
        setTimeout(() => { 
            if (formStatus) {
                formStatus.textContent = "";
                formStatus.style.animation = "";
            }
        }, 3000);
    });
}

// ================= WINDOW RESIZE HANDLER =================
window.addEventListener("resize", () => {
    if (navLinks) {
        if (window.innerWidth > 768) {
            navLinks.style.display = "flex";
        } else {
            navLinks.style.display = "none";
        }
    }
    
    // Adjust particle count based on screen size
    adjustParticleCount();
});

// Set initial nav display
if (navLinks) {
    if (window.innerWidth > 768) {
        navLinks.style.display = "flex";
    }
}

// ================= PARTICLE ANIMATION SYSTEM =================
(function initParticleAnimation() {
    // Create particles container if it doesn't exist
    let particlesContainer = document.getElementById('particles-container');
    
    if (!particlesContainer) {
        particlesContainer = document.createElement('div');
        particlesContainer.id = 'particles-container';
        particlesContainer.className = 'particles-container';
        document.body.appendChild(particlesContainer);
    }

    // Add gradient spheres for visual depth
    if (!document.querySelector('.gradient-sphere')) {
        const spheres = [
            { class: 'sphere-1' },
            { class: 'sphere-2' },
            { class: 'sphere-3' }
        ];
        
        spheres.forEach(sphere => {
            const element = document.createElement('div');
            element.className = `gradient-sphere ${sphere.class}`;
            document.body.appendChild(element);
        });
    }

    // Add grid overlay
    if (!document.querySelector('.grid-overlay')) {
        const gridOverlay = document.createElement('div');
        gridOverlay.className = 'grid-overlay';
        document.body.appendChild(gridOverlay);
    }

    // Add glow effect
    if (!document.querySelector('.glow')) {
        const glow = document.createElement('div');
        glow.className = 'glow';
        document.body.appendChild(glow);
    }

    const particleCount = window.innerWidth <= 768 ? 40 : 80;
    const particles = [];

    // Get current theme color
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const particleColor = currentTheme === 'dark' ? '#7dd3fc' : '#0284c7';

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        createParticle(particleColor);
    }

    function createParticle(baseColor) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size (small to medium)
        const size = Math.random() * 6 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random color variation
        const colors = baseColor === '#7dd3fc' 
            ? ['#7dd3fc', '#38bdf8', '#bae6fd', '#0ea5e9']
            : ['#0284c7', '#0369a1', '#7dd3fc', '#0ea5e9'];
        
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = `0 0 15px ${baseColor}`;
        particle.style.opacity = Math.random() * 0.4 + 0.1;
        
        // Initial position
        resetParticle(particle);
        
        particlesContainer.appendChild(particle);
        particles.push(particle);
        
        // Start animation
        animateParticle(particle);
    }

    function resetParticle(particle) {
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.transition = 'none';
        
        return { x: posX, y: posY };
    }

    function animateParticle(particle) {
        // Initial position
        const pos = resetParticle(particle);
        
        // Random animation properties
        const duration = Math.random() * 25 + 20;
        const delay = Math.random() * 15;
        
        // Trigger animation
        setTimeout(() => {
            if (!particle.parentNode) return;
            
            particle.style.transition = `all ${duration}s linear`;
            particle.style.opacity = Math.random() * 0.3 + 0.15;
            
            // Move in a random direction with upward bias
            const moveX = pos.x + (Math.random() * 50 - 25);
            const moveY = pos.y - Math.random() * 60; // Move upwards
            
            particle.style.left = `${moveX}%`;
            particle.style.top = `${moveY}%`;
            
            // Reset after animation completes
            setTimeout(() => {
                if (particle.parentNode) {
                    animateParticle(particle);
                }
            }, duration * 1000);
        }, delay * 1000);
    }

    // Function to adjust particle count based on screen size
    window.adjustParticleCount = function() {
        const newParticleCount = window.innerWidth <= 768 ? 40 : 80;
        const currentParticles = document.querySelectorAll('.particles-container .particle');
        
        if (currentParticles.length > newParticleCount) {
            // Remove excess particles
            for (let i = newParticleCount; i < currentParticles.length; i++) {
                if (currentParticles[i] && currentParticles[i].parentNode) {
                    currentParticles[i].remove();
                }
            }
        } else if (currentParticles.length < newParticleCount) {
            // Add more particles
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const particleColor = currentTheme === 'dark' ? '#7dd3fc' : '#0284c7';
            
            for (let i = currentParticles.length; i < newParticleCount; i++) {
                createParticle(particleColor);
            }
        }
    };

    // Mouse interaction - create particles at mouse position (throttled)
    let lastMouseTime = 0;
    const mouseThrottle = 30;
    let mouseParticles = [];
    
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMouseTime < mouseThrottle) return;
        lastMouseTime = now;
        
        // Limit particle creation rate
        if (Math.random() > 0.4) return;
        
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const particleColor = currentTheme === 'dark' ? '#7dd3fc' : '#0284c7';
        const shadowColor = currentTheme === 'dark' ? 'rgba(125, 211, 252, 0.8)' : 'rgba(2, 132, 199, 0.8)';
        
        const mouseX = (e.clientX / window.innerWidth) * 100;
        const mouseY = (e.clientY / window.innerHeight) * 100;
        
        // Create 1-3 particles at once
        const burstCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < burstCount; i++) {
            setTimeout(() => {
                // Create temporary particle
                const particle = document.createElement('div');
                particle.className = 'particle particle-mouse';
                
                const size = Math.random() * 8 + 2;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.background = particleColor;
                particle.style.boxShadow = `0 0 25px ${shadowColor}`;
                
                // Position at mouse with slight random offset
                const offsetX = (Math.random() * 10 - 5);
                const offsetY = (Math.random() * 10 - 5);
                
                particle.style.left = `${mouseX + offsetX}%`;
                particle.style.top = `${mouseY + offsetY}%`;
                particle.style.opacity = '0.8';
                particle.style.transition = 'none';
                particle.style.zIndex = '3';
                
                particlesContainer.appendChild(particle);
                mouseParticles.push(particle);
                
                // Animate outward
                setTimeout(() => {
                    if (!particle.parentNode) return;
                    
                    particle.style.transition = 'all 1.2s ease-out';
                    particle.style.left = `${mouseX + (Math.random() * 40 - 20)}%`;
                    particle.style.top = `${mouseY + (Math.random() * 40 - 30)}%`;
                    particle.style.opacity = '0';
                    particle.style.transform = 'scale(0.5)';
                    
                    // Remove after animation
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.remove();
                            const index = mouseParticles.indexOf(particle);
                            if (index > -1) mouseParticles.splice(index, 1);
                        }
                    }, 1200);
                }, 50);
            }, i * 30); // Stagger the particles
        }
    });

    // Subtle movement of gradient spheres on mouse move
    const spheres = document.querySelectorAll('.gradient-sphere');
    let spherePositions = { x: 0, y: 0 };
    
    document.addEventListener('mousemove', (e) => {
        if (spheres.length) {
            // Smooth movement with lerp
            const targetX = (e.clientX / window.innerWidth - 0.5) * 30;
            const targetY = (e.clientY / window.innerHeight - 0.5) * 30;
            
            spherePositions.x += (targetX - spherePositions.x) * 0.05;
            spherePositions.y += (targetY - spherePositions.y) * 0.05;
            
            spheres.forEach((sphere, index) => {
                const speed = index === 0 ? 1 : index === 1 ? 1.3 : 1.6;
                sphere.style.transform = `translate(${spherePositions.x * speed}px, ${spherePositions.y * speed}px)`;
            });
        }
    });

    // Touch interaction for mobile
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length && Math.random() > 0.6) {
            e.preventDefault();
            const touch = e.touches[0];
            const touchX = (touch.clientX / window.innerWidth) * 100;
            const touchY = (touch.clientY / window.innerHeight) * 100;
            
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const particleColor = currentTheme === 'dark' ? '#7dd3fc' : '#0284c7';
            const shadowColor = currentTheme === 'dark' ? 'rgba(125, 211, 252, 0.8)' : 'rgba(2, 132, 199, 0.8)';
            
            // Create 1-2 particles for touch
            const burstCount = Math.floor(Math.random() * 2) + 1;
            
            for (let i = 0; i < burstCount; i++) {
                setTimeout(() => {
                    const particle = document.createElement('div');
                    particle.className = 'particle particle-mouse';
                    
                    const size = Math.random() * 8 + 2;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.background = particleColor;
                    particle.style.boxShadow = `0 0 25px ${shadowColor}`;
                    
                    const offsetX = (Math.random() * 15 - 7.5);
                    const offsetY = (Math.random() * 15 - 7.5);
                    
                    particle.style.left = `${touchX + offsetX}%`;
                    particle.style.top = `${touchY + offsetY}%`;
                    particle.style.opacity = '0.7';
                    particle.style.transition = 'none';
                    particle.style.zIndex = '3';
                    
                    particlesContainer.appendChild(particle);
                    
                    setTimeout(() => {
                        if (!particle.parentNode) return;
                        
                        particle.style.transition = 'all 1.2s ease-out';
                        particle.style.left = `${touchX + (Math.random() * 50 - 25)}%`;
                        particle.style.top = `${touchY + (Math.random() * 50 - 35)}%`;
                        particle.style.opacity = '0';
                        particle.style.transform = 'scale(0.5)';
                        
                        setTimeout(() => {
                            if (particle.parentNode) {
                                particle.remove();
                            }
                        }, 1200);
                    }, 50);
                }, i * 40);
            }
        }
    }, { passive: false });

    // Parallax effect on scroll
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const spheres = document.querySelectorAll('.gradient-sphere');
        
        spheres.forEach((sphere, index) => {
            const speed = 0.1 + (index * 0.05);
            sphere.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        const glow = document.querySelector('.glow');
        if (glow) {
            glow.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.05}px))`;
        }
    });

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        particles.forEach(particle => {
            if (particle && particle.parentNode) {
                particle.remove();
            }
        });
        mouseParticles.forEach(particle => {
            if (particle && particle.parentNode) {
                particle.remove();
            }
        });
    });
})();

// ================= PARALLAX SCROLL EFFECT =================
function initParallax() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            heroSection.style.backgroundPositionY = `${scrolled * 0.5}px`;
        });
    }
}

// ================= TYPEWRITER EFFECT FOR HERO =================
function initTypewriter() {
    const heroSpan = document.querySelector('.hero h1 span');
    if (heroSpan) {
        const originalText = heroSpan.textContent;
        heroSpan.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < originalText.length) {
                heroSpan.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, 100);
    }
}

// ================= INITIALIZE ON DOM LOAD =================
document.addEventListener('DOMContentLoaded', function() {
    // Ensure particles container exists
    if (!document.getElementById('particles-container')) {
        const container = document.createElement('div');
        container.id = 'particles-container';
        container.className = 'particles-container';
        document.body.appendChild(container);
    }
    
    // Add initial show class to elements already in view
    setTimeout(() => {
        document.querySelectorAll('.fade-in, .project-card, .exp-card, .edu-card').forEach(el => {
            const rect = el.getBoundingClientRect();
            const isInViewport = rect.top <= window.innerHeight - 100 && rect.bottom >= 0;
            if (isInViewport) {
                el.classList.add('show');
            }
        });
    }, 200);
    
    // Initialize parallax
    initParallax();
    
    // Initialize typewriter effect (comment out if not needed)
    // initTypewriter();
    
    // Add loading animation removal
    const loading = document.querySelector('.loading');
    if (loading) {
        setTimeout(() => {
            loading.classList.add('hide');
            setTimeout(() => {
                loading.remove();
            }, 500);
        }, 1000);
    }
});

// ================= LAZY LOAD IMAGES =================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ================= SMOOTH SCROLL FOR ANCHOR LINKS =================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ================= ACTIVE NAVIGATION HIGHLIGHT =================
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#navLinks a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const scrollY = window.scrollY;
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href').substring(1);
        if (href === currentSection) {
            link.classList.add('active');
            link.style.color = 'var(--accent-primary)';
        } else {
            link.style.color = '';
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// ================= PERFORMANCE OPTIMIZATIONS =================
// Debounce scroll events
let isScrolling;
window.addEventListener('scroll', () => {
    clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        // Scroll end
    }, 66);
}, { passive: true });

// Throttle resize events
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        adjustParticleCount();
    }, 250);
}, { passive: true });

// ================= ERROR HANDLING =================
window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
});

// ================= EXPORT FUNCTIONS FOR GLOBAL USE =================
window.toggleMenu = toggleMenu;
window.updateTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
    updateParticleColors(theme);
};
