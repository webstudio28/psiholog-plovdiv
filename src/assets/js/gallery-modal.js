const galleryModal = document.getElementById('pg-modal');
const modalImg = document.getElementById('pg-modal-img');
const modalCaption = document.getElementById('pg-modal-caption');
const modalClose = document.querySelector('.pg-modal-close');
const prevBtn = document.querySelector('.pg-modal-prev');
const nextBtn = document.querySelector('.pg-modal-next');
const galleryItems = Array.from(document.querySelectorAll('.pg-gallery-item'));
let currentIndex = 0;

function openModal(index) {
    const item = galleryItems[index];
    modalImg.src = item.getAttribute('data-full');
    modalCaption.textContent = item.getAttribute('data-caption');
    galleryModal.style.display = 'flex';
    galleryModal.style.flexDirection = 'column';
    galleryModal.style.justifyContent = 'center'
    currentIndex = index;
}

function closeModal() {
    galleryModal.style.display = 'none';
    modalImg.src = '';
    modalCaption.textContent = '';
}

function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openModal(currentIndex);
}

function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openModal(currentIndex);
}

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        openModal(index);
    });
});

modalClose.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === galleryModal) closeModal();
});

nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

document.addEventListener('keydown', (e) => {
    if (galleryModal.style.display === 'block') {
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'Escape') closeModal();
    }
});