
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggleMenu(forceClose = false) {
  const overlay = document.getElementById('menuOverlay');
  const body = document.body;
  const hamburger = document.querySelector('.hamburger');
  if (!overlay) return;

  const shouldOpen = !forceClose && !overlay.classList.contains('active');
  overlay.classList.toggle('active', shouldOpen);
  overlay.setAttribute('aria-hidden', String(!shouldOpen));
  body.classList.toggle('no-scroll', shouldOpen);
  if (hamburger) hamburger.setAttribute('aria-expanded', String(shouldOpen));
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) toggleMenu(true);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    toggleMenu(true);
    document.getElementById('galleryOverlay')?.classList.remove('active');
  }
});

// Modern scroll reveal
const revealElements = document.querySelectorAll('.fade-in');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealElements.forEach(el => el.classList.add('visible'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealElements.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min(index % 4, 3) * 65}ms`;
    observer.observe(el);
  });
}

// Navigation state, scroll progress, and back-to-top
const nav = document.getElementById('siteNav');
const progress = document.getElementById('scrollProgress');
const scrollTopButton = document.getElementById('scrollTopButton');
const sectionLinks = [...document.querySelectorAll('.desktop-links a')];
const sections = [...document.querySelectorAll('section[id]')];

function updateScrollUI() {
  const y = window.scrollY;
  nav?.classList.toggle('scrolled', y > 18);
  scrollTopButton?.classList.toggle('visible', y > 650);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;

  let current = sections[0]?.id;
  sections.forEach(section => {
    if (y >= section.offsetTop - 160) current = section.id;
  });
  sectionLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}

window.addEventListener('scroll', updateScrollUI, { passive: true });
window.addEventListener('load', updateScrollUI);
scrollTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));

// Subtle hero parallax on pointer-capable devices
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && !reducedMotion && window.matchMedia('(pointer:fine)').matches) {
  heroVisual.addEventListener('pointermove', event => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroVisual.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${y * -4}deg)`;
  });
  heroVisual.addEventListener('pointerleave', () => {
    heroVisual.style.transform = '';
  });
}

// Konami easter egg
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA','Enter'];
let currentPosition = 0;
document.addEventListener('keydown', event => {
  if (event.code === konamiCode[currentPosition]) {
    currentPosition++;
    if (currentPosition === konamiCode.length) {
      window.location.href = 'https://www.retrogames.cz/play_022-NES.php';
      currentPosition = 0;
    }
  } else if (event.key !== 'Escape') {
    currentPosition = 0;
  }
});

// Gallery lightbox
window.addEventListener('DOMContentLoaded', () => {
  const galleryOverlay = document.getElementById('galleryOverlay');
  const fullImage = document.getElementById('fullImage');
  const closeGallery = document.getElementById('closeGallery');
  const prevImage = document.getElementById('prevImage');
  const nextImage = document.getElementById('nextImage');
  if (!galleryOverlay || !fullImage) return;

  let currentImageIndex = 0;
  let currentGallery = [];

  function renderCurrent() {
    const item = currentGallery[currentImageIndex];
    if (!item) return;
    fullImage.src = item.src;
    fullImage.alt = item.alt || 'Gallery image';
  }
  function openGallery(image) {
    currentGallery = [...document.querySelectorAll(`.gallery-grid img[data-gallery="${image.dataset.gallery}"]`)];
    currentImageIndex = currentGallery.indexOf(image);
    renderCurrent();
    galleryOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
  }
  function closeGalleryOverlay() {
    galleryOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    currentGallery = [];
    currentImageIndex = 0;
  }

  document.querySelectorAll('.gallery-grid img').forEach(image => image.addEventListener('click', () => openGallery(image)));
  closeGallery?.addEventListener('click', closeGalleryOverlay);
  galleryOverlay.addEventListener('click', event => { if (event.target === galleryOverlay) closeGalleryOverlay(); });
  prevImage?.addEventListener('click', () => { if (currentGallery.length) { currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length; renderCurrent(); } });
  nextImage?.addEventListener('click', () => { if (currentGallery.length) { currentImageIndex = (currentImageIndex + 1) % currentGallery.length; renderCurrent(); } });

  document.addEventListener('keydown', event => {
    if (!galleryOverlay.classList.contains('active')) return;
    if (event.key === 'ArrowLeft') prevImage?.click();
    if (event.key === 'ArrowRight') nextImage?.click();
  });
});

// Copy terminal command
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.copy-command-button').forEach(button => {
    button.addEventListener('click', async () => {
      const target = document.getElementById(button.dataset.copyTarget);
      if (!target) return;
      const originalText = button.textContent;
      try {
        await navigator.clipboard.writeText(target.textContent.trim());
        button.textContent = 'Copied';
        button.classList.add('copied');
      } catch {
        const range = document.createRange();
        range.selectNodeContents(target);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try {
          document.execCommand('copy');
          button.textContent = 'Copied';
          button.classList.add('copied');
        } catch {
          button.textContent = 'Copy failed';
        }
        selection.removeAllRanges();
      }
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 1600);
    });
  });
});
