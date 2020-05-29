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
const dropdownList = document.querySelectorAll('.dropdown');
const tvShowHead = document.querySelector('.tv-shows__head');
const pagination = document.querySelector('.pagination');

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
  getTestCard = () => this.getData('card.json');

  getSearchResult = query => {
    this.temp = `${ this.SERVER }/search/tv?api_key=${ this.API_KEY }&query=${ query }&language=en-US`;
    
    return this.getData(this.temp);
  }

  getNextPage = page => {
    return this.getData(this.temp + '&page=' + page);
  }

  getTvShow = id => this.getData(`${ this.SERVER }/tv/${ id }?api_key=${ this.API_KEY }&language=en-US`);

  getTopRated = () => this.getData(`${ this.SERVER }/tv/top_rated?api_key=${ this.API_KEY }&language=en-US`);

  getPopular = () => this.getData(`${ this.SERVER }/tv/popular?api_key=${ this.API_KEY }&language=en-US`);

  getToday = () => this.getData(`${ this.SERVER }/tv/airing_today?api_key=${ this.API_KEY }&language=en-US`);

  getWeek = () => this.getData(`${ this.SERVER }/tv/on_the_air?api_key=${ this.API_KEY }&language=en-US`);

}

const dbService = new DBService();

// render card
const renderCard = (response, target) => {

  if (!response.total_results) {
    loading.remove();
    tvShowHead.textContent = 'Oops. Nothing was found.';
    tvShowHead.style.cssText = 'color: red; font-size: 22px;'
    tvShowList.textContent = '';
    return;
  };

  tvShowHead.style.cssText = ''
  tvShowHead.textContent = target ? target.textContent : 'Search result';
  tvShowList.textContent = '';

  response.results.forEach(({
      id,
      poster_path: poster,
      backdrop_path: backdrop,
      name: title,
      vote_average: vote,
    }) => {

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
  });

  pagination.textContent = '';
  if (response.total_pages > 1) {
    for (let i = 1; i <= response.total_pages; i++) {
      pagination.innerHTML += `<li><button type="button">${ i }</button></li>`;
    }
  }

}

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

// search
const search = event => {
  event.preventDefault();
  const value = searchFormInput.value.trim();
  searchFormInput.value = '';
  if (value) {
    tvShows.append(loading);
    dbService.getSearchResult(value).then(renderCard);
  }

};

// close deopdown
const closeDropdown = () => {
  for ( const key of dropdownList) key.classList.remove('active');
};

// open/close menu
const toggleMenu = () => {
  leftMenu.classList.toggle('openMenu');
  hamburger.classList.toggle('open');
  closeDropdown();
};

// clse menu when click our the menu
const closeMenuClickOutMenu = event => {
  if (!event.target.closest('.left-menu')) {
    leftMenu.classList.remove('openMenu');
    hamburger.classList.remove('open');
  }
};

// open/close dropdown
const toggleDropdown = event => {
  event.preventDefault();
  const target = event.target
  const dropdown = target.closest('.dropdown');

  if (dropdown) {
    dropdown.classList.toggle('active');
    leftMenu.classList.add('openMenu');
    hamburger.classList.add('open');
  }

  if (target.closest('#top-rated')) {
    tvShows.append(loading);
    dbService.getTopRated().then(response => renderCard(response, target));
  }

  if (target.closest('#popular')) {
    tvShows.append(loading);
    dbService.getPopular().then(response => renderCard(response, target));
  }

  if (target.closest('#today')) {
    tvShows.append(loading);
    dbService.getToday().then(response => renderCard(response, target));
  }

  if (target.closest('#week')) {
    tvShows.append(loading);
    dbService.getWeek().then(response => renderCard(response, target));
  }

  if (target.closest('#search')) {
    tvShowList.textContent = '';
    tvShowList.textContent = '';
  }

};

// open modal
const openModal = event => {
  event.preventDefault();
  preloader.style.display = 'block';
  const target = event.target;
  const card = target.closest('.tv-card');
  if (card) {
    dbService
      .getTvShow(card.id)
      .then(({
        poster_path: poster,
        name: title,
        genres,
        vote_average: vote,
        overview,
        homepage: url,
      }) => {
        tvCardImg.src = poster ? IMG_URL + poster : 'img/no-poster.jpg';
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
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
      })
      .finally(() => preloader.style.display = '');
  }
};

// close modal
const closeModal = event => {
  if (
    event.target.closest('.cross')
    || event.target.classList.contains('modal')
  ) {
    document.body.style.overflow = '';
    modal.classList.add('hide');
  }
};

const init = () => {

  // init Events
  searchForm.addEventListener('submit', search);
  hamburger.addEventListener('click', toggleMenu)
  document.addEventListener('click', closeMenuClickOutMenu);
  leftMenu.addEventListener('click', toggleDropdown);
  tvShowList.addEventListener('click', openModal);
  modal.addEventListener('click', closeModal);
  tvShowList.addEventListener('mouseover', changeImage);
  tvShowList.addEventListener('mouseout', changeImage);

  pagination.addEventListener('click', event => {
    const target = event.target;
    if (target) {
      // target.classList.contains('pages') {
      //   tvShows.addend(loading);
      //   dbService.getNextPage(target.textContent).then(renderCard);
      // }
    }
  });

};

init();