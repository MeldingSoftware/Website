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

// GALLERY — keyboard-accessible lightbox on home and individual tool pages
document.addEventListener("DOMContentLoaded", () => {
    const images = Array.from(document.querySelectorAll(".gallery-grid img, .tool-screenshot img"));
    if (!images.length) return;

    // The homepage already has the markup; tool pages get the same lightbox automatically.
    let overlay = document.getElementById("galleryOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "galleryOverlay";
        overlay.className = "gallery-overlay";
        overlay.innerHTML = '<div class="gallery-controls"><button id="prevImage" type="button" aria-label="Previous screenshot">&#8249;</button><img id="fullImage" alt="Enlarged screenshot"/><button id="nextImage" type="button" aria-label="Next screenshot">&#8250;</button></div><button id="closeGallery" class="close-gallery" type="button" aria-label="Close gallery">×</button>';
        document.body.appendChild(overlay);
    }

    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Screenshot gallery");
    overlay.setAttribute("aria-hidden", "true");

    const fullImage = overlay.querySelector("#fullImage");
    const closeButton = overlay.querySelector("#closeGallery");
    const previousButton = overlay.querySelector("#prevImage");
    const nextButton = overlay.querySelector("#nextImage");
    if (!fullImage || !closeButton || !previousButton || !nextButton) return;

    previousButton.type = nextButton.type = closeButton.type = "button";
    previousButton.setAttribute("aria-label", "Previous screenshot");
    nextButton.setAttribute("aria-label", "Next screenshot");
    closeButton.setAttribute("aria-label", "Close gallery");
    fullImage.removeAttribute("src");

    let group = [];
    let currentIndex = 0;
    let trigger = null;

    function updateImage() {
        const selected = group[currentIndex];
        if (!selected) return;
        fullImage.src = selected.currentSrc || selected.src;
        fullImage.alt = selected.alt || "Screenshot";
        previousButton.hidden = nextButton.hidden = group.length <= 1;
    }

    function openGallery(image) {
        trigger = image;
        const groupName = image.dataset.gallery || "tool-screenshot";
        group = images.filter(candidate => (candidate.dataset.gallery || "tool-screenshot") === groupName);
        currentIndex = Math.max(0, group.indexOf(image));
        updateImage();
        overlay.classList.add("active");
        overlay.setAttribute("aria-hidden", "false");
        closeButton.focus({ preventScroll: true });
    }

    function closeGallery() {
        if (!overlay.classList.contains("active")) return;
        overlay.classList.remove("active");
        overlay.setAttribute("aria-hidden", "true");
        fullImage.removeAttribute("src");
        if (trigger) trigger.focus({ preventScroll: true });
        trigger = null;
        group = [];
    }

    function changeImage(step) {
        if (group.length <= 1) return;
        currentIndex = (currentIndex + step + group.length) % group.length;
        updateImage();
    }

    for (const image of images) {
        image.tabIndex = 0;
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", "Enlarge " + (image.alt || "screenshot"));
        image.addEventListener("click", () => openGallery(image));
        image.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openGallery(image);
            }
        });
    }

    closeButton.addEventListener("click", closeGallery);
    previousButton.addEventListener("click", () => changeImage(-1));
    nextButton.addEventListener("click", () => changeImage(1));
    overlay.addEventListener("click", event => {
        if (event.target === overlay) closeGallery();
    });

    document.addEventListener("keydown", event => {
        if (!overlay.classList.contains("active")) return;
        if (event.key === "Escape") {
            event.preventDefault();
            closeGallery();
        } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            changeImage(-1);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            changeImage(1);
        } else if (event.key === "Tab") {
            const focusable = [previousButton, nextButton, closeButton].filter(button => !button.hidden);
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
});

// TOOL SEARCH
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-tool-filter]").forEach(panel => {
        const table = document.getElementById(panel.dataset.target);
        const search = panel.querySelector("[data-filter-search]");
        const status = panel.querySelector("[data-filter-status]");
        const empty = panel.nextElementSibling;
        if (!table || !search) return;
        const rows = Array.from(table.querySelectorAll("tbody tr[data-category]"));
        const headings = Array.from(table.querySelectorAll("[data-category-heading]"));
        function filterTools() {
            const query = search.value.trim().toLowerCase();
            const visibleCategories = new Set();
            let shown = 0;
            rows.forEach(row => {
                const visible = row.textContent.toLowerCase().includes(query);
                row.hidden = !visible;
                if (visible) {
                    shown++;
                    visibleCategories.add(row.dataset.category);
                }
            });
            headings.forEach(heading => {
                heading.hidden = !visibleCategories.has(heading.dataset.categoryHeading);
            });
            if (status) status.textContent = "Showing " + shown + " of " + rows.length + " " + panel.dataset.platform + " tools";
            if (empty && empty.matches("[data-filter-empty]")) empty.hidden = shown !== 0;
        }
        search.addEventListener("input", filterTools);
        search.addEventListener("search", filterTools);
        search.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                filterTools();
            }
        });
        filterTools();
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

