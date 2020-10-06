class Carousel {

  currentSlide: number;
  totalSlides: number;
  slides: NodeListOf<HTMLElement> | null;
  bgPositions: Array<number>;


  constructor() {
    this.currentSlide = 0;
    this.slides = null;
    this.bgPositions = [0, 13, 21, 32, 43, 55, 69, 85.9];

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
        this.currentSlide = item.target.getAttribute('data-current-slide')

        this.moveBg();
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

      if (entry.intersectionRatio > 0.5) {
        this.currentSlide = entryEl.getAttribute('id');

        carouselEl.setAttribute('data-current-slide', entryEl.getAttribute('id'));

        entryEl.setAttribute('data-slide-active', '');
      } else {
        entryEl.removeAttribute('data-slide-active', '');
      }
    });
  }

  private observeSlide(slide: HTMLElement) {
    const observer = <IntersectionObserver>new IntersectionObserver(this.onSlideVisible.bind(this), <IntersectionObserverInit>{
      root: document.querySelector('[data-mmks-carousel]'),
      rootMargin: '0px',
      threshold: 0.5
    });

    if (slide) observer.observe(slide);
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

  private nextSlide() {
    console.log('nextSlide');
  }

  private prevSlide() {
    console.log('prevSlide');
  }
}

export default Carousel;