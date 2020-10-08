class Carousel {

  currentSlide: number;
  totalSlides: number;
  slides: NodeListOf<HTMLElement> | null;
  bgPositions: Array<number>;


  constructor() {
    this.currentSlide = 0;
    this.slides = null;
    this.bgPositions = [0, 13, 21, 32, 43, 55, 69, 85.9, 85.9, 100];

    this.initialize();
  }

  private moveBg() {
    // @ts-ignore
    const bgEl = <HTMLElement>document.querySelector('.mmks-carousel__background');
    const percentWidth = (this.bgPositions[this.currentSlide - 1] / 100) * bgEl.querySelector('img').getBoundingClientRect().width;

    bgEl.style.setProperty('--bgPosition', `-${percentWidth}px`);
  }

  private observeCarousel() {
    const carouselEl = document.querySelector('[data-mmks-carousel]');

    // @ts-ignore
    const observer = new MutationObserver(mutations => {
      mutations.forEach(item => {
        // @ts-ignore
        this.currentSlide = Number(item.target.getAttribute('data-current-slide'));

        this.moveBg();
        this.setArrowButtonsLinks();
        this.toggleActiveArrowButtonsLinks();
        this.setStepsIndicator();
      });
    });

    observer.observe(carouselEl, {
      attributes: true,
      attributeFilter: ['data-current-slide']
    });
  }

  private onSlideVisible(entries: any, self: any) {
    const carouselEl = document.querySelector('[data-mmks-carousel]');

    entries.forEach((entry: any) => {
      const entryEl = entry.target;

      if(entry.intersectionRatio > 0.3) {
        entry.target.style.opacity = 0;
        entry.target.style.filter = `blur(5px)`;
      }

      if (entry.intersectionRatio > 0.5) {
        this.currentSlide = Number(entryEl.getAttribute('id'));
        carouselEl.setAttribute('data-current-slide', entryEl.getAttribute('id'));
      }

      if(entry.intersectionRatio === 1) {
        entry.target.style.opacity = 1;
        entry.target.style.filter = `blur(0)`;
      }
    });
  }

  private observeSlide(slide: HTMLElement) {
    const observer = <IntersectionObserver>new IntersectionObserver(this.onSlideVisible.bind(this), <IntersectionObserverInit>{
      root: document.querySelector('[data-mmks-carousel]'),
      rootMargin: '0px',
      threshold: [0.3, 0.5, 1]
    });

    if (slide) observer.observe(slide);
  }

  private toggleActiveArrowButtonsLinks() {
    const prevButtonEl = document.querySelector('[data-mmks-carousel-prev]');
    const nextButtonEl = document.querySelector('[data-mmks-carousel-next]');

    // @ts-ignore
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
    const prevButtonEl = document.querySelector('[data-mmks-carousel-prev]');
    const nextButtonEl = document.querySelector('[data-mmks-carousel-next]');

    // @ts-ignore
    prevButtonEl.setAttribute('href', `#${this.currentSlide - 1}`);
    // @ts-ignore
    nextButtonEl.setAttribute('href', `#${this.currentSlide + 1}`);
  }

  private setStepsIndicator() {
    const currentIndicatorEl = document.querySelector('[data-current-step]');
    const totalIndicatorEl = document.querySelector('[data-total-steps]');

    // @ts-ignore
    currentIndicatorEl.textContent = this.currentSlide;
    // @ts-ignore
    totalIndicatorEl.textContent = (this.slides.length - 2);
  }

  private initialize() {
    // @ts-ignore
    const arrCarouselEl = document.querySelector('[data-mmks-carousel]');
    // @ts-ignore
    this.slides = [...arrCarouselEl.querySelectorAll('[data-mmks-carousel-slide]')];

    this.slides.forEach((slide: HTMLElement) => {
      this.observeSlide(slide);
    });

    this.observeCarousel();
  }
}

export default Carousel;