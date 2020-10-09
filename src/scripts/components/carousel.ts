class Carousel {

  carouselEl: HTMLElement;
  currentSlide: number;
  totalSlides: number;
  slides: NodeListOf<HTMLElement> | null;
  bgPositionsPortrait: Array<number>;
  bgPositionsLandscape: Array<number>;


  constructor() {
    this.currentSlide = 0;
    this.slides = null;
    this.bgPositionsPortrait = [0, 21, 26.8, 34, 48.5, 59.6, 80, 99, 99, 113];
    this.bgPositionsLandscape = [0, 15, 24, 37, 51, 65, 82, 100, 100, 113];

    this.initialize();
  }

  private moveBg() {
    const bgEl: HTMLElement = document.querySelector('.mmks-carousel__background');
    const bgImg: HTMLElement = bgEl.querySelector('img');
    const getBgPositions = window.matchMedia("(orientation: portrait)").matches ? this.bgPositionsPortrait : this.bgPositionsLandscape;
    const currentSlideId = this.currentSlide - 1;
    const percentOfImage = getBgPositions[currentSlideId] * bgImg.getBoundingClientRect().width / 100;
    const percentOfScreen = getBgPositions[currentSlideId] * window.innerWidth / 100;

    bgEl.style.setProperty('--bgPosition', `${percentOfScreen - percentOfImage}px`);
  }

  private observeCarousel() {
    const observer: MutationObserver = new MutationObserver(mutations => {
      mutations.forEach(item => {
        const mutatedEl = item.target as HTMLElement;
        this.currentSlide = Number(mutatedEl.getAttribute('data-current-slide'));

        if (this.currentSlide > 1 && this.currentSlide < this.slides.length) {
          mutatedEl.setAttribute('data-in-slides', '');
        } else {
          mutatedEl.removeAttribute('data-in-slides');
        }

        this.moveBg();
        this.setArrowButtonsLinks();
        this.toggleActiveArrowButtonsLinks();
        this.setStepsIndicator();
      });
    });

    observer.observe(this.carouselEl, {
      attributes: true,
      attributeFilter: ['data-current-slide']
    });
  }

  private onSlideVisible(entries: any) {
    entries.forEach((entry: any) => {
      const entryEl: HTMLElement = entry.target;

      if(entry.intersectionRatio > 0.3) {
        entry.target.style.opacity = 0;
        entry.target.style.filter = `blur(5px)`;
      }

      if (entry.intersectionRatio > 0.5) {
        this.currentSlide = Number(entryEl.getAttribute('id'));
        this.carouselEl.setAttribute('data-current-slide', entryEl.getAttribute('id'));
      }

      if(entry.intersectionRatio === 1) {
        entry.target.style.opacity = 1;
        entry.target.style.filter = `blur(0)`;
      }
    });
  }

  private observeSlide(slide: HTMLElement) {
    const observer: IntersectionObserver = new IntersectionObserver(this.onSlideVisible.bind(this), <IntersectionObserverInit> {
      root: this.carouselEl,
      rootMargin: '0px',
      threshold: [0.3, 0.5, 1]
    });

    if (slide) observer.observe(slide);
  }

  private toggleActiveArrowButtonsLinks() {
    const prevButtonEl: HTMLElement = document.querySelector('[data-mmks-carousel-prev]');
    const nextButtonEl: HTMLElement = document.querySelector('[data-mmks-carousel-next]');

    if (this.currentSlide === 1) {
      prevButtonEl.setAttribute('data-is-disabled', '');
    } else {
      if(prevButtonEl.hasAttribute('data-is-disabled')) prevButtonEl.removeAttribute('data-is-disabled');
    }

    if (this.currentSlide === (this.slides.length)) {
      nextButtonEl.setAttribute('data-is-disabled', '');
    } else {
      if(nextButtonEl.hasAttribute('data-is-disabled')) nextButtonEl.removeAttribute('data-is-disabled');
    }
  }

  private setArrowButtonsLinks() {
    const prevButtonEl: HTMLElement = document.querySelector('[data-mmks-carousel-prev]');
    const nextButtonEl: HTMLElement = document.querySelector('[data-mmks-carousel-next]');

    prevButtonEl.setAttribute('href', `#${this.currentSlide - 1}`);
    nextButtonEl.setAttribute('href', `#${this.currentSlide + 1}`);
  }

  private setStepsIndicator() {
    const currentIndicatorEl: HTMLElement = document.querySelector('[data-current-step]');
    const totalIndicatorEl: HTMLElement = document.querySelector('[data-total-steps]');

    if (this.currentSlide > 1 && this.currentSlide < this.slides.length) {
      currentIndicatorEl.textContent = String(this.currentSlide - 1);
    }

    totalIndicatorEl.textContent = String(this.slides.length - 2);
  }

  private initialize() {
    this.carouselEl = document.querySelector('[data-mmks-carousel]');
    this.slides = this.carouselEl.querySelectorAll('[data-mmks-carousel-slide]');

    this.slides.forEach((slide) => {
      this.observeSlide(slide);
    });

    this.observeCarousel();
  }
}

export default Carousel;