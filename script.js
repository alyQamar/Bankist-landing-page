'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const h1 = document.querySelector('h1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
//Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
//Page Navigatioin

// //High Comlexity way
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//More Effecient way
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Components

//Event delegation
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (clicked) {
    //Remove both Activate tab and content Area
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(c => c.classList.remove('operations__content--active'));

    //Activate tab
    clicked.classList.add('operations__tab--active');

    //Active Content Area
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add('operations__content--active');
  }
});

//Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//passing argument into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// 1- Sticky navigation -- old way (not optimal👎)
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//----------------------------------
// // Intersection observer API
// const obsCallback = function (enteries, observer) {
//   enteries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOption = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOption);
// observer.observe(section1);
//-----------------------------------

// Sticky navigation with Intersection observer API (Optimal way ✅)
//1- selector
const header = document.querySelector('.header');

const navHeigh = nav.getBoundingClientRect().height;

//2- call-back function
const stickyNav = function (enteries) {
  const [entry] = enteries;
  //logic
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
//3- create IntersectionObserver method with call back function and options object as parameters
const headerObserver = new IntersectionObserver(stickyNav, {
  // options object
  root: null,
  threshold: 0,
  rootMargin: `-${navHeigh}px`,
});

//4- use observer method with selector
headerObserver.observe(header);

//-----------------------------------
// Reveal sections with Intersection observer API (Optimal way ✅)
//1-selector: to select any section
const allSections = document.querySelectorAll('.section');
//2- callback-function
const revealSection = function (enteries, observer) {
  const [entry] = enteries;

  //logic
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  //stop observing
  observer.unobserve(entry.target);
};
//3- create IntersectionObserver method with call back function and options object as parameters
const sectionObserver = new IntersectionObserver(revealSection, {
  //options object
  root: null,
  threshold: 0.15,
});
//4- use observer method with selector
allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});
//-----------------------------------

// Lazy loading images with Intersection observer API (Optimal way ✅)
//1- select any image
const imgTargets = document.querySelectorAll('img[data-src');

//2- callback-function
const loadImg = function (enteries, observer) {
  const [entry] = enteries;
  //logic
  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  //stop observing
  observer.unobserve(entry.target);
};
//3- create IntersectionObserver method with call back function and options object as parameters
const imgObserver = new IntersectionObserver(loadImg, {
  //option object
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
//4- use observer method with selector
imgTargets.forEach(img => imgObserver.observe(img));
//-----------------------------------

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  let curSlide = 0; //current slide
  const maxSlide = slides.length;

  //help us to overview slider
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  //Functions
  //add dynamica dots section with js code instead doing it manualy in html
  const dotContainer = document.querySelector('.dots');

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
  //0%,100%,200%,300%

  //Next slide
  const nextSlide = function () {
    if (curSlide == maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    // curSlide = 1: -100%, 0%,100%,200%
    activateDot(curSlide);
  };
  //prevSlide
  const prevSlide = function () {
    if (curSlide == 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    // curSlide = 1: -100%, 0%,100%,200%
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();
