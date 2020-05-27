// constants
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'
const KEY = '2339870f2ea941471f42b64ca4e3bed3';

// variables
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');

const DBService = class {
  getData = async url => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Can't get a date on the link ${ url }`);
    }

  }

  getTestData = () => {
    return this.getData('test.json')
  }
}

const renderCard = response => {
  console.log("response", response);

  tvShowList.textContent = '';;
  response.results.forEach(({
      id,
      poster_path: poster,
      backdrop_path: backdrop,
      name: title,
      vote_average: vote,
    }) => {

    const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
    const backdropIMG = backdrop ? IMG_URL + backdrop : 'img/no-poster.jpg';
    const voteElem = vote !== 0 ? `<span class="tv-card__vote">${ vote }</span>` : '';
    
    const card = document.createElement('li')
    card.className = 'tv-shows__item';
    card.innerHTML = `
      <a
        href="#"
        class="tv-card"
        key=${ id }
      >
        ${ voteElem }
        <img class="tv-card__img"
            src="${ posterIMG }"
            data-backdrop="${ backdropIMG }"
            alt="${ title }">
        <h4 class="tv-card__head">${ title }</h4>
      </a>
    `;
    tvShowList.append(card);
    console.log(card);

  })
}

new DBService()
  .getTestData()
  .then(renderCard);

// functions 
const changeImage = event => {
  const target = event.target;

  if (
      target.matches('.tv-card__img')
      && target.dataset.backdrop
    ) {
    [ target.src, target.dataset.backdrop ] = [ target.dataset.backdrop, target.src ]
  }
};

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
    const target = event.target
    const dropdown = target.closest('.dropdown');
    if (dropdown) {
      event.preventDefault();
      dropdown.classList.toggle('active');
      leftMenu.classList.add('openMenu');
      hamburger.classList.add('open');
    }
  });

  // open modal window
  tvShowList.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const card = target.closest('.tv-card');
    if(card) {
      document.body.style.overflow = 'hidden';
      modal.classList.remove('hide');
    }
  });

  // close modal window
  modal.addEventListener('click', event => {
    // event.target.classList.contains('modal'))
    if (
      event.target.closest('.cross')
      || event.target.classList.contains('modal')
    ) {
      document.body.style.overflow = '';
      modal.classList.add('hide');
    }
  });

  // show/not show backdrop
  tvShowList.addEventListener('mouseover', changeImage)
  tvShowList.addEventListener('mouseout', changeImage)

};

init();