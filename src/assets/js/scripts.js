const mobileNavToggle = document.getElementById('mobile-nav-toggle');
const mobileNavClose = document.getElementById('mobile-nav-close');
const mainNav = document.getElementById('main-nav');
const body = document.body;
const navLinks = mainNav.querySelectorAll('ul li a'); // Get all nav links

// Function to open the mobile menu
const openMobileNav = () => {
    body.classList.add('mobile-nav-active');
};

// Function to close the mobile menu
const closeMobileNav = () => {
    body.classList.remove('mobile-nav-active');
};

// Event listeners for toggle and close buttons
if (mobileNavToggle && mainNav) {
    mobileNavToggle.addEventListener('click', openMobileNav);
}

if (mobileNavClose && mainNav) {
    mobileNavClose.addEventListener('click', closeMobileNav);
}

// Event listener for navigation links (close menu on click)
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Close nav only if it's actually open (on mobile view)
        if (body.classList.contains('mobile-nav-active')) {
            // Basic check: if the link is an anchor for the current page, close nav
            // More complex logic needed if some links go to other pages
            if (link.getAttribute('href')?.startsWith('#') || link.getAttribute('href') === window.location.pathname + window.location.search || link.getAttribute('href') === '#') {
                closeMobileNav();
            }
            // If it's a link with an arrow, prevent default and handle submenu logic (not implemented)
            if (link.querySelector('.arrow')) {
                // e.preventDefault(); // Prevent navigation for links with submenus for now
                // Add submenu handling logic here if needed
            }
        }
    });
});

// --- Basic Accordion Script for FAQ ---
const faqAccordion = document.getElementById('faq-accordion');

if (faqAccordion) {
    faqAccordion.addEventListener('click', function (event) {
        const question = event.target.closest('.faq-question');
        if (!question) return; // Exit if click wasn't on a question

        const faqItem = question.parentElement;
        const answer = faqItem.querySelector('.faq-answer');

        // Toggle the current item
        const isActive = faqItem.classList.toggle('active');

        // Optional: Close other items when one is opened
        if (isActive) {
            const allItems = faqAccordion.querySelectorAll('.faq-item');
            allItems.forEach(item => {
                if (item !== faqItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.display = 'none'; // Hide answer
                }
            });
        }
        // Toggle display (simple version)
        answer.style.display = isActive ? 'block' : 'none';
    });
}


// Create swallow icon
const swallowIcon = document.createElement('img');
swallowIcon.src = 'assets/images/swallow2.png';  // Path to your downloaded image
swallowIcon.alt = 'Swallow Icon';  // Accessibility text
swallowIcon.className = 'swallow-icon';  // Add class for styling

// Append the image to the body
document.body.appendChild(swallowIcon);

// Create modal
const modal = document.createElement('div');
modal.className = 'swallow-modal';

// Add text (dummy, 280 chars max)
const text = document.createElement('p');
text.textContent = 'Историята на моето име…\n' +
    'Фамилията Йовчева идва от бащата на моя баща .\n' +
    'Дядо ми е бил партизанин в бивша Югославия при Тито(тогавашен управник на партизаните)\n' +
    'Имал е партизанското име-Лястовичката,защото е бил много бърз.\n' +
    'Нося тази фамилия с гордост,тя има своята тежест и вярвам в силата на рода и предците.Те винаги ще са зад гърба ми ,а аз винаги ще бъда благодарна към тях и ще си взимам-сила,мъдрост и вяра.';
modal.appendChild(text);

// Add close button
const closeBtn = document.createElement('button');
closeBtn.className = 'close-btn';
closeBtn.innerHTML = '<i class="fas fa-times"></i>'; // Safe, static HTML
modal.appendChild(closeBtn);

document.body.appendChild(modal);

// Event listeners
swallowIcon.addEventListener('click', () => {
    modal.classList.toggle('active');
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
});