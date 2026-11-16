// HOME INITIAL SCROLL POSITION
// Prevent the browser from restoring a tiny previous scroll offset on load.
// This makes the initial page position and the #home position start at the true top.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

function resetInitialHomeScroll() {
    const hash = window.location.hash;

    if (!hash || hash === '#home') {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;

        // Temporarily disable smooth scrolling so this correction is immediate.
        root.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);

        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
            root.style.scrollBehavior = previousScrollBehavior;
        });
    }
}

window.addEventListener('pageshow', resetInitialHomeScroll);
document.addEventListener('DOMContentLoaded', resetInitialHomeScroll);

// HAMBURGER MENU
// Let responsive CSS control the hamburger and overlay display.
// Keep scrolling and accessibility attributes in sync when opening or closing.
function setMobileMenuOpen(isOpen) {
    const overlay = document.getElementById('menuOverlay');
    const hamburger = document.querySelector('nav .hamburger');
    const logo = document.querySelector('.logo');
    if (!overlay) return;

    // Hiding the scrollbar can shift a fixed navigation button in desktop browsers.
    // Preserve its exact on-screen position while the menu is open.
    const buttonRightBefore = hamburger ? hamburger.getBoundingClientRect().right : 0;

    overlay.classList.toggle('active', isOpen);
    overlay.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('no-scroll', isOpen);

    if (logo) logo.style.pointerEvents = isOpen ? 'none' : '';
    if (hamburger) {
        if (isOpen) {
            const shift = hamburger.getBoundingClientRect().right - buttonRightBefore;
            hamburger.style.marginRight = shift + 'px';
        } else {
            hamburger.style.marginRight = '';
        }
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    }
}

function toggleMenu() {
    const overlay = document.getElementById('menuOverlay');
    if (overlay) setMobileMenuOpen(!overlay.classList.contains('active'));
}

// Closing the mobile menu when switching to desktop must also unlock scrolling.
window.addEventListener('resize', function() {
    if (window.innerWidth > 900) setMobileMenuOpen(false);
});


// PULL TO REFRESH
let startY;
let isAtTop = window.scrollY === 0;
const pullThreshold = 150; // Set the pull threshold to 150 pixels

window.addEventListener('scroll', function() {
    isAtTop = window.scrollY === 0;
    document.getElementById('refreshContainer').style.display = isAtTop ? 'block' : 'none';
});

window.addEventListener('touchstart', function(event) {
    if (isAtTop) {
        startY = event.touches[0].clientY;
    }
}, false);

window.addEventListener('touchmove', function(event) {
    if (startY !== undefined && isAtTop && event.touches[0].clientY - startY > pullThreshold) {
        window.location.reload();
    }
}, false);

window.addEventListener('touchend', function() {
    startY = undefined;
}, false);


// SCROLL PROGRESS
function updateScrollProgress() {
    const progress = document.getElementById('scrollProgress');
    if (!progress) return;

    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollableHeight > 0 ? Math.min(100, Math.max(0, scrollY / scrollableHeight * 100)) : 0;
    progress.style.width = percent + '%';
}

document.addEventListener('DOMContentLoaded', () => {
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
});


// FADE-IN
const elements = document.querySelectorAll('.fade-in');

// Intersection Observer to detect when elements come into the viewport
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Add visible class when element is in viewport
            observer.unobserve(entry.target); // Stop observing once the animation has been triggered
        }
    });
});
// Observe each element
elements.forEach(element => {
    observer.observe(element);
});


// KONAMI
const konamiCode = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
  'Enter'
];

// Store the current position in the code sequence
let currentPosition = 0;

// Listen for keydown events
document.addEventListener('keydown', (event) => {
  // Check if the pressed key matches the current position in the code sequence
  if (event.code === konamiCode[currentPosition]) {
    // Move to the next position in the code sequence
    currentPosition++;
    
    // If the entire code sequence has been entered
    if (currentPosition === konamiCode.length) {
      // Do something special (e.g., display a message, trigger an animation, etc.)
      window.location.href = 'https://www.retrogames.cz/play_022-NES.php';
      
      // Reset the position in the code sequence
      currentPosition = 0;
    }
  } else {
    // Reset the position in the code sequence if the wrong key is pressed
    currentPosition = 0;
  }
});

// GALLERY
document.addEventListener("DOMContentLoaded", () => {
    const galleryOverlay = document.getElementById("galleryOverlay");
    const fullImage = document.getElementById("fullImage");
    const closeGallery = document.getElementById("closeGallery");
    const prevImage = document.getElementById("prevImage");
    const nextImage = document.getElementById("nextImage");

    let currentImageIndex = 0;
    let currentGallery = [];
    let currentGalleryName = "";

    if (!galleryOverlay || !fullImage || !closeGallery || !prevImage || !nextImage) {
        return;
    }

    // Open Gallery
    const galleryImages = document.querySelectorAll(".gallery-grid img, .tool-screenshot img");
    galleryImages.forEach((image, index) => {
        image.addEventListener("click", () => {
            currentGalleryName = image.dataset.gallery; // Determine the gallery type
            currentGallery = Array.from(
                document.querySelectorAll(`.gallery-grid img[data-gallery="${currentGalleryName}"], .tool-screenshot img[data-gallery="${currentGalleryName}"]`)
            );
            currentImageIndex = currentGallery.indexOf(image);

            openGallery(image.src);
        });
    });

    function openGallery(src) {
        fullImage.src = src;
        galleryOverlay.classList.add("active");
    }

    // Close Gallery
    closeGallery.addEventListener("click", closeGalleryOverlay);
    galleryOverlay.addEventListener("click", (e) => {
        if (e.target === galleryOverlay || e.target === closeGallery) {
            closeGalleryOverlay();
        }
    });

    function closeGalleryOverlay() {
        galleryOverlay.classList.remove("active");
        currentImageIndex = 0;
        currentGallery = [];
        currentGalleryName = "";
    }

    // Navigate Gallery
    prevImage.addEventListener("click", () => {
        if (currentGallery.length > 0) {
            currentImageIndex = (currentImageIndex - 1 + currentGallery.length) % currentGallery.length;
            fullImage.src = currentGallery[currentImageIndex].src;
        }
    });

    nextImage.addEventListener("click", () => {
        if (currentGallery.length > 0) {
            currentImageIndex = (currentImageIndex + 1) % currentGallery.length;
            fullImage.src = currentGallery[currentImageIndex].src;
        }
    });
});



// COPY TERMINAL COMMAND
document.addEventListener("DOMContentLoaded", () => {
    const copyButtons = document.querySelectorAll(".copy-command-button");

    copyButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const targetId = button.getAttribute("data-copy-target");
            const target = document.getElementById(targetId);
            if (!target) return;

            const text = target.textContent.trim();
            const originalText = button.textContent;

            try {
                await navigator.clipboard.writeText(text);
                button.textContent = "Copied";
                button.classList.add("copied");
            } catch (error) {
                const range = document.createRange();
                range.selectNodeContents(target);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                try {
                    document.execCommand("copy");
                    button.textContent = "Copied";
                    button.classList.add("copied");
                } catch (fallbackError) {
                    button.textContent = "Copy failed";
                }
                selection.removeAllRanges();
            }

            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove("copied");
            }, 1800);
        });
    });
});

