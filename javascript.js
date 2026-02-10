// HAMBURGER MENU
function toggleMenu() {
    var overlay = document.getElementById('menuOverlay');
    var body = document.body;  // Reference to the body element
    var logo = document.querySelector('.logo');  // Logo element
    var hamburger = document.querySelector('.hamburger');  // Hamburger menu element

    // Check if the overlay is currently visible
    if (overlay.classList.contains('active')) {
        overlay.style.display = 'none';
        overlay.classList.remove('active');  // Make sure to remove 'active' class
        body.classList.remove('no-scroll');
        logo.style.pointerEvents = 'auto';  // Re-enable pointer events on the logo
        hamburger.style.pointerEvents = 'auto';  // Re-enable pointer events on the hamburger
    } else {
        overlay.style.display = 'block';
        overlay.classList.add('active');  // Add 'active' class to overlay
        body.classList.add('no-scroll');
        logo.style.pointerEvents = 'none';  // Disable pointer events on the logo
        hamburger.style.pointer.events = 'none';  // Disable pointer events on the hamburger
    }
}


// CLOSE OVERYLAY WHEN EXCEEDING MOBILE SIZE
window.addEventListener('resize', function() {
    var overlay = document.getElementById('menuOverlay');
    var hamburger = document.querySelector('nav .hamburger');
    var closeButton = document.querySelector('.close-button');

    // Assuming 768px as the breakpoint for mobile to desktop transition
    if (window.innerWidth > 900) {
        // Close the overlay and hide both the hamburger and close button when transitioning to desktop view
        if (overlay.classList.contains('active')) {
            overlay.style.display = 'none';
            overlay.classList.remove('active');
            closeButton.style.display = 'none';
        }
        hamburger.style.display = 'none';  // Ensure hamburger is hidden in desktop view
    } else {
        // Make sure the hamburger is visible when in mobile view
        hamburger.style.display = 'block';
    }
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

    // Open Gallery
    const galleryImages = document.querySelectorAll(".gallery-grid img");
    galleryImages.forEach((image, index) => {
        image.addEventListener("click", () => {
            currentGalleryName = image.dataset.gallery; // Determine the gallery type
            currentGallery = Array.from(
                document.querySelectorAll(`.gallery-grid img[data-gallery="${currentGalleryName}"]`)
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

