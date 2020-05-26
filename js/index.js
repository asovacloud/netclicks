// menu
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');

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

};

init();