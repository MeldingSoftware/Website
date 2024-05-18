
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
    if (window.innerWidth > 768) {
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





// PAYPAL

PayPal.Donation.Button({
env:'production',
hosted_button_id:'TM2PR4PEDX63N',
image: {
src:'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
alt:'Donate with PayPal button',
title:'PayPal - The safer, easier way to pay online!',
}
}).render('#donate-button');


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