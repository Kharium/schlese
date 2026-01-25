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

    // Hier kannst du steuern, wie "weit nach oben" gescrollt wird:
    // kleiner = weiter nach oben (mehr Content sichtbar), größer = weiter nach unten
    const getStickyHeaderOffset = () => {
        const header = document.querySelector('header');
        const h = header instanceof HTMLElement ? header.offsetHeight : 0;
        const EXTRA_GAP = 6; // <- anpassen: z.B. 0, 6, 12, 20
        return h + EXTRA_GAP;
    };

    const scrollToWithOffset = (el) => {
        const offset = getStickyHeaderOffset();
        const y = window.scrollY + el.getBoundingClientRect().top - offset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    };

    const openTilePanelById = (panelId) => {
        const panel = document.getElementById(panelId);
        if (!(panel instanceof HTMLElement)) return { panel: null, trigger: null };

        const trigger = panel.previousElementSibling;
        if (!(trigger instanceof HTMLButtonElement)) return { panel: null, trigger: null };

        const item = trigger.closest('.tile-group');
        if (!(item instanceof HTMLElement)) return { panel: null, trigger: null };

        item.classList.add('open');
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');

        return { panel, trigger };
    };

    const handleKontaktClickMobile = (e) => {
        e.preventDefault();

        if (location.hash !== '#startseite') {
            history.pushState(null, '', '#startseite');
        }

        // 1) Öffnen
        const standort = openTilePanelById('tile-panel-standort');
        openTilePanelById('tile-panel-sprechzeiten');

        // 2) Scroll-Ziel: der "Standort"-Button (weiter oben als das Panel)
        const target = standort.trigger || document.getElementById('startseite');
        if (!(target instanceof HTMLElement)) return;

        requestAnimationFrame(() => {
            scrollToWithOffset(target);
        });
    };

    setMenuOpen(false);

    burger.addEventListener('click', () => {
        setMenuOpen(!nav.classList.contains('active'));
    });

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
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            setMenuOpen(false);
        }
    });
}