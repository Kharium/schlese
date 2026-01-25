export function initNav() {
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-links');
    const navLinks = Array.from(document.querySelectorAll('.nav-links a'));
    const burgerIcon = burger?.querySelector('.burger-menu__icon');

    const ICON_BURGER = '/assets/icons/menu.svg';
    const ICON_CLOSE = '/assets/icons/close.svg';

    if (!burger || !nav) return;

    const isMobile = () => window.innerWidth < 768;

    const setMenuOpen = (open) => {
        burger.classList.toggle('active', open);
        nav.classList.toggle('active', open);

        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');

        if (burgerIcon) burgerIcon.src = open ? ICON_CLOSE : ICON_BURGER;
    };

    const getStickyHeaderOffset = () => {
        const header = document.querySelector('header');
        const h = header instanceof HTMLElement ? header.offsetHeight : 0;
        return h + 12; // Abstand unter dem sticky Header
    };

    const scrollToWithOffset = (el) => {
        const offset = getStickyHeaderOffset();
        const y = window.scrollY + el.getBoundingClientRect().top - offset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    };

    const openTilePanelById = (panelId) => {
        const panel = document.getElementById(panelId);
        if (!(panel instanceof HTMLElement)) return null;

        const trigger = panel.previousElementSibling;
        if (!(trigger instanceof HTMLButtonElement)) return null;

        const item = trigger.closest('.tile-group');
        if (!(item instanceof HTMLElement)) return null;

        item.classList.add('open');
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');

        return panel;
    };

    const handleKontaktClickMobile = (e) => {
        e.preventDefault();

        // Hash setzen (optional, aber sinnvoll für History/Deep-Link)
        if (location.hash !== '#startseite') {
            history.pushState(null, '', '#startseite');
        }

        // 1) Panels öffnen
        const panelStandort = openTilePanelById('tile-panel-standort');
        openTilePanelById('tile-panel-sprechzeiten');

        // 2) zum ersten geöffneten Panel scrollen (damit beide aufgeklappt sichtbar sind)
        const target = panelStandort || document.getElementById('startseite');
        if (!(target instanceof HTMLElement)) return;

        // warten bis Layout nach dem Öffnen aktualisiert ist
        requestAnimationFrame(() => {
            scrollToWithOffset(target);
        });
    };

    // Initialzustand
    setMenuOpen(false);

    // Burger toggle
    burger.addEventListener('click', () => {
        setMenuOpen(!nav.classList.contains('active'));
    });

    // Nav link clicks
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            if (isMobile()) setMenuOpen(false);

            const href = link.getAttribute('href') || '';
            const isKontakt = href === '#startseite' || href.endsWith('/#startseite');

            if (isMobile() && isKontakt) {
                handleKontaktClickMobile(e);
            }
        });
    });

    // Click outside closes menu
    document.addEventListener('click', (e) => {
        const target = e.target;
        if (!(target instanceof Node)) return;

        const clickedInsideMenu = nav.contains(target);
        const clickedBurger = burger.contains(target);

        if (!clickedInsideMenu && !clickedBurger && nav.classList.contains('active')) {
            setMenuOpen(false);
        }
    });

    // Escape closes menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            setMenuOpen(false);
        }
    });
}