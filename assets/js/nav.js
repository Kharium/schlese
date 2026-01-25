export function initNav() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const burgerIcon = burger?.querySelector('.burger-menu__icon');

    const ICON_BURGER = '/assets/icons/menu.svg';
    const ICON_CLOSE = '/assets/icons/close.svg';

    const setMenuOpen = (open) => {
        if (!burger || !nav) return;

        burger.classList.toggle('active', open);
        nav.classList.toggle('active', open);

        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');

        if (burgerIcon) burgerIcon.src = open ? ICON_CLOSE : ICON_BURGER;
    };

    if (!burger || !nav) return;

    setMenuOpen(false);

    burger.addEventListener('click', () => {
        setMenuOpen(!nav.classList.contains('active'));
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) setMenuOpen(false);
        });
    });

    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof Node)) return;

        const clickedInsideMenu = nav.contains(target);
        const clickedBurger = burger.contains(target);

        if (!clickedInsideMenu && !clickedBurger && nav.classList.contains('active')) {
            setMenuOpen(false);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) setMenuOpen(false);
    });
}
