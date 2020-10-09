class Nav {
  constructor() {
    this.initialize();
  }

  private observeCarousel() {
    const carouselEl: HTMLElement = document.querySelector('[data-mmks-carousel]');

    const observer: MutationObserver = new MutationObserver(mutations => {
      mutations.forEach(item => {
        const mutatedEl = item.target as HTMLElement;

        this.setActiveItem(+mutatedEl.getAttribute('data-current-slide'));
      });
    });

    observer.observe(carouselEl, {
      attributes: true,
      attributeFilter: ['data-current-slide']
    });
  }

  private setActiveItem(slideId: number) {
    const activeItem: HTMLElement = document.querySelector('[data-mmks-carousel-nav-item][data-is-active]');
    const selectedItem: NodeListOf<Element> = document.querySelectorAll('[data-mmks-carousel-nav-item]');

    activeItem.removeAttribute('data-is-active');

    if (selectedItem.length) selectedItem[slideId - 1].setAttribute('data-is-active', '');
  }

  private initialize() {
    this.observeCarousel();
  }
}

export default Nav;