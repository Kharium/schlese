import { initNav } from './nav.js';
import { initActiveLinks } from './activeLink.js';
import { initAccordions } from './accordion.js';

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initActiveLinks();
    initAccordions();
});
