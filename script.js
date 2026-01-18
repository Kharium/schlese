// Scroll-Position beim Reload nicht wiederherstellen (verhindert "Springen")
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Beim Reload immer ganz nach oben (Startseite)
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});

// script.js
document.addEventListener('DOMContentLoaded', () => {
    /* =========================
     *  NAV / BURGER-MENÜ
     * ========================= */
    const burger = document.querySelector('.burger-menu');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Burger toggeln
    if (burger && nav) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Links klicken -> Menü auf Mobil schließen
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) {
                    burger.classList.remove('active');
                    nav.classList.remove('active');
                }
            });
        });

        // Outside-Click schließt Menü
        document.addEventListener('click', (e) => {
            const clickedInsideMenu = nav.contains(e.target);
            const clickedBurger = burger.contains(e.target);
            if (!clickedInsideMenu && !clickedBurger && nav.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
            }
        });

        // ESC schließt Menü
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                burger.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }

    /* Aktiven Nav-Link anhand der aktuellen URL markieren
       (funktioniert auch auf Unterseiten wie /seite/impressum.html) */
    const currentPath = location.pathname.replace(/\/+$/, '');
    navLinks.forEach(a => {
        const href = a.getAttribute('href');
        if (!href) return;
        const absPath = new URL(href, location.origin).pathname.replace(/\/+$/, '');
        if (absPath === currentPath) a.classList.add('is-current');
        else a.classList.remove('is-current');
    });

    // Fallback: Klick-Markierung (falls du auf derselben Seite bleibst)
    navLinks.forEach(a => {
        a.addEventListener('click', () => {
            navLinks.forEach(x => x.classList.remove('is-current'));
            a.classList.add('is-current');
        });
    });

    /* =========================
     *  SLIDER (Glide.js)
     * ========================= */
    // Praxis-Slider
    const praxisSlider = document.querySelector('.glide.praxis-slider');
    if (praxisSlider && typeof Glide !== 'undefined') {
        new Glide(praxisSlider, {
            type: 'carousel',
            perView: 1,
            gap: 0,
            swipeThreshold: false,
            dragThreshold: false
        }).mount();
    }

    /* =========================
     *  KLASSISCHES AKKORDEON
     * ========================= */
    document.querySelectorAll('.accordion-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.accordion-item') || btn.parentElement;
            item?.classList.toggle('open');

            const icon = btn.querySelector('.material-symbols-rounded, .material-symbols-outlined');
            if (icon) {
                icon.textContent = item.classList.contains('open') ? 'stat_minus_1' : 'stat_1';
            }
        });
    });

    /* =========================
     *  TILES-AKKORDEON
     * ========================= */
    document.querySelectorAll('.tiles .tile').forEach(tile => {
        const panel = tile.nextElementSibling;
        const hasPanel = panel && panel.classList.contains('tile-panel');

        if (!hasPanel) return;

        const chevronImg = tile.querySelector('.tile-chevron img');

        const ARROW_DOWN = 'assets/icons/arrow_down.svg';
        const ARROW_UP = 'assets/icons/arrow_up.svg';

        const setOpenState = (isOpen) => {
            tile.classList.toggle('open', isOpen);
            panel.hidden = !isOpen;

            // optional, aber gut für Accessibility + CSS-Hooks
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