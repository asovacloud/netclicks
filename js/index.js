// menu
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvCards = document.querySelectorAll('.tv-card');

const init = () => {

  // open/close menu
  hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
  })

  // close menu when click out menu
  document.addEventListener('click', event => {
    if (!event.target.closest('.left-menu')) {
      leftMenu.classList.remove('openMenu');
      hamburger.classList.remove('open');
    }
  });

  // open/close dropdown
  leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
      dropdown.classList.toggle('active');
      leftMenu.classList.add('openMenu');
      hamburger.classList.add('open');
    }
  });

  // show/not show backdrop
  tvCards.forEach(card => {
    const image = card.querySelector('.tv-card__img');
    const imgUrl = image.src;
    const backdrop = image.dataset.backdrop;
    card.addEventListener('mouseenter', () => {
      if (backdrop) image.src = backdrop;
    });
    card.addEventListener('mouseleave', () => {
      if (backdrop) image.src = imgUrl;
    });
  })

};

init();