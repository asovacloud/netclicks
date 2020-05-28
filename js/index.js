// constants
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2'

// variables
const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowList = document.querySelector('.tv-shows__list');
const modal = document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');
const preloader = document.querySelector('.preloader');

const loading = document.createElement('div');
loading.className = 'loading';

const DBService = class {
  constructor() {
    this.API_KEY = '2339870f2ea941471f42b64ca4e3bed3';
    this.SERVER = 'https://api.themoviedb.org/3'
  }

  getData = async url => {
    const res = await fetch(url);
    if (res.ok) {
      return res.json();
    } else {
      throw new Error(`Can't get a date on the link ${ url }`);
    }
  }

  getTestData = () => this.getData('test.json');
  getTestCard = () => this.getData('card.json')

  getSearchResult = query => this
    .getData(`${ this.SERVER }/search/tv?api_key=${ this.API_KEY }&query=${ query }&language=en-US`);

  getTvShow = id => this.getData(`${ this.SERVER }/tv/${ id }?api_key=${ this.API_KEY }&language=en-US`);

}

const renderCard = response => {

  if (response.results.length === 0) {
    loading.remove();
    return;
  };
  tvShowList.textContent = '';
  response.results.forEach(({
      id,
      poster_path: poster,
      backdrop_path: backdrop,
      name: title,
      vote_average: vote,
    }) => {

    if (!poster) return;
    const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
    const backdropIMG = backdrop ? IMG_URL + backdrop : '';
    const voteElem = vote ? `<span class="tv-card__vote">${ vote }</span>` : '';
    
    const card = document.createElement('li')
    card.className = 'tv-shows__item';
    card.innerHTML = `
      <a
        href="#"
        class="tv-card"
        id=${ id }
      >
        ${ voteElem }
        <img class="tv-card__img"
            src="${ posterIMG }"
            data-backdrop="${ backdropIMG }"
            alt="${ title }">
        <h4 class="tv-card__head">${ title }</h4>
      </a>
    `;
    loading.remove();
    tvShowList.append(card);
  })
}


searchForm.addEventListener('submit', event => {

  event.preventDefault();
  const value = searchFormInput.value.trim();
  searchFormInput.value = '';
  if (value) {
    tvShows.append(loading);
    new DBService().getSearchResult(value).then(renderCard);
  }

});

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
    preloader.style.display = 'block';
    const target = event.target;
    const card = target.closest('.tv-card');
    if(card) {
      new DBService()
        .getTvShow(card.id)
        .then(({
          poster_path: poster,
          name: title,
          genres,
          vote_average: vote,
          overview,
          homepage: url,
        }) => {
          tvCardImg.src = IMG_URL + poster;
          tvCardImg.alt = title;
          modalTitle.textContent = title;

          genresList.textContent = '';
          for (const item of genres) {
            genresList.innerHTML += `<li>${ item.name }</li>`;
          }
          description.textContent = overview;
          rating.textContent = vote;
          modalLink.href = url;
        })
        .then(() => {
          preloader.style.display = '';
          document.body.style.overflow = 'hidden';
          modal.classList.remove('hide');
        });
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