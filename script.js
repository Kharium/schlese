// Scroll-Position beim Reload nicht wiederherstellen (verhindert "Springen")
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Beim Reload immer ganz nach oben (Startseite)
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});

document.addEventListener('DOMContentLoaded', () => {
    /* =========================
     *  NAV / BURGER-MENÜ (SVG-Icon swap)
     * ========================= */
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');
    const burgerIcon = burger?.querySelector('.burger-menu__icon');

    // WICHTIG: auf Unterseiten funktionieren relative Pfade oft nicht zuverlässig -> Root-Pfade nutzen
    const ICON_BURGER = '/assets/icons/burger.svg';
    const ICON_CLOSE = '/assets/icons/close.svg';

    const setMenuOpen = (open) => {
        if (!burger || !nav) return;

        burger.classList.toggle('active', open);
        nav.classList.toggle('active', open);

        burger.setAttribute('aria-expanded', String(open));
        burger.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');

        if (burgerIcon) {
            burgerIcon.src = open ? ICON_CLOSE : ICON_BURGER;
        }
    };

    if (burger && nav) {
        // Initialzustand sicher setzen (falls CSS/HTML mal abweicht)
        setMenuOpen(false);

        // Button klick => toggle
        burger.addEventListener('click', () => {
            const open = !nav.classList.contains('active');
            setMenuOpen(open);
        });

        // Links klicken -> Menü auf Mobil schließen
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) setMenuOpen(false);
            });
        });

        // Outside-Click schließt Menü
        document.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof Node)) return;

            const clickedInsideMenu = nav.contains(target);
            const clickedBurger = burger.contains(target);

            if (!clickedInsideMenu && !clickedBurger && nav.classList.contains('active')) {
                setMenuOpen(false);
            }
        });

        // ESC schließt Menü
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                setMenuOpen(false);
            }
        });
    }

    /* Aktiven Nav-Link anhand der aktuellen URL markieren
       (funktioniert auch auf Unterseiten wie /sites/impressum.html) */
    const currentPath = location.pathname.replace(/\/+$/, '');
    navLinks.forEach((a) => {
        const href = a.getAttribute('href');
        if (!href) return;

        const absPath = new URL(href, location.origin).pathname.replace(/\/+$/, '');
        if (absPath === currentPath) a.classList.add('is-current');
        else a.classList.remove('is-current');
    });

    // Fallback: Klick-Markierung (falls du auf derselben Seite bleibst)
    navLinks.forEach((a) => {
        a.addEventListener('click', () => {
            navLinks.forEach((x) => x.classList.remove('is-current'));
            a.classList.add('is-current');
        });
    });

    /* =========================
     *  SLIDER (Glide.js)
     * ========================= */
    const praxisSlider = document.querySelector('.glide.praxis-slider');
    if (praxisSlider && typeof Glide !== 'undefined') {
        new Glide(praxisSlider, {
            type: 'carousel',
            perView: 1,
            gap: 0,
            swipeThreshold: false,
            dragThreshold: false,
        }).mount();
    }

    /* =========================
     *  KLASSISCHES AKKORDEON
     *  - Für .accordion (Über mich)
     *  - Panel wird per [hidden] ein-/ausgeblendet
     * ========================= */
    document.querySelectorAll('.accordion-header').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.accordion') || btn.parentElement;
            if (!item) return;

            const body = item.querySelector('.accordion-body');
            if (!body) return;

            const isOpen = !item.classList.contains('open');

            item.classList.toggle('open', isOpen);
            body.hidden = !isOpen;

            // a11y
            btn.setAttribute('aria-expanded', String(isOpen));
        });
    });

    /* =========================
     *  TILES-AKKORDEON
     * ========================= */
    document.querySelectorAll('.tiles .tile').forEach((tile) => {
        const panel = tile.nextElementSibling;
        const hasPanel = panel && panel.classList.contains('tile-panel');
        if (!hasPanel) return;

        const chevronImg = tile.querySelector('.tile-chevron img');

        // Hinweis: deine Tiles nutzen aktuell relative Pfade in HTML.
        // Für Unterseiten wäre /assets/... ebenfalls robuster, aber hier lassen wir es wie gehabt.
        const ARROW_DOWN = 'assets/icons/arrow_down.svg';
        const ARROW_UP = 'assets/icons/arrow_up.svg';

        const setOpenState = (isOpen) => {
            tile.classList.toggle('open', isOpen);
            panel.hidden = !isOpen;

            tile.setAttribute('aria-expanded', String(isOpen));

            if (chevronImg) {
                chevronImg.src = isOpen ? ARROW_UP : ARROW_DOWN;
            }
        };

        // Initialzustand
        panel.hidden = true;
        setOpenState(false);

        tile.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = !tile.classList.contains('open');
            setOpenState(isOpen);
        });
    });
});