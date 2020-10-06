class Nav {
  constructor() {
    this.initialize();
  }

  private observeCarousel() {
    const carouselEl = document.querySelector('[data-mmks-carousel]');

    // @ts-ignore
    const observer = new MutationObserver(mutations => {
      mutations.forEach(item => {
        const mutatedEl = item.target;
        // @ts-ignore
        this.setActiveItem(mutatedEl.getAttribute('data-current-slide'));
      });
    });

    observer.observe(carouselEl, {
      attributes: true,
      attributeFilter: ['data-current-slide']
    });
  }

  private setActiveItem(slideId: any) {
    const activeItem = document.querySelector('[data-mmks-carousel-nav-item][data-is-active]');
    // @ts-ignore
    const selectedItem = [...document.querySelectorAll('[data-mmks-carousel-nav-item]')];

    activeItem.removeAttribute('data-is-active');

    // @ts-ignore
    if (selectedItem.length) selectedItem[slideId - 1].setAttribute('data-is-active', '');
  }

  private initialize() {
    this.observeCarousel();
  }
}

export default Nav;