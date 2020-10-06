import '../styles/index.scss';

import Carousel from '@components/carousel';
import Nav from '@components/nav';

document.addEventListener("DOMContentLoaded", () => {
  new Carousel();
  new Nav();
});