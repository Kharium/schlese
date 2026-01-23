document.addEventListener('DOMContentLoaded', () => {
    /* =========================
     *  NAV / BURGER-MENÜ
     * ========================= */
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

    if (burger && nav) {
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

    // Aktuellen Menüpunkt markieren (nur pathname-basiert; Hash bleibt frei)
    const currentPath = location.pathname.replace(/\/+$/, '');
    navLinks.forEach((a) => {
        const href = a.getAttribute('href');
        if (!href) return;

        const absPath = new URL(href, location.origin).pathname.replace(/\/+$/, '');
        a.classList.toggle('is-current', absPath === currentPath);
    });

    navLinks.forEach((a) => {
        a.addEventListener('click', () => {
            navLinks.forEach((x) => x.classList.remove('is-current'));
            a.classList.add('is-current');
        });
    });

    /* =========================
     *  ACCORDION-HELPER (clean)
     * ========================= */
    const initAccordion = ({
                               root = document,
                               triggerSelector,
                               itemSelector,
                               openClass = 'open',
                               closeOthers = false,
                               getPanel, // (trigger, item) => HTMLElement|null
                           }) => {
        const triggers = Array.from(root.querySelectorAll(triggerSelector));
        if (triggers.length === 0) return;

        const resolveItem = (trigger) =>
            (itemSelector ? trigger.closest(itemSelector) : null) || trigger.parentElement;

        const resolvePanel = (trigger, item) => {
            const panel = getPanel?.(trigger, item);
            return panel instanceof HTMLElement ? panel : null;
        };

        const setOpen = (trigger, item, panel, open) => {
            item.classList.toggle(openClass, open);
            panel.hidden = !open;
            trigger.setAttribute('aria-expanded', String(open));
        };

        // Initialzustand: alles zu (ARIA + hidden konsistent)
        triggers.forEach((trigger) => {
            const item = resolveItem(trigger);
            if (!item) return;
            const panel = resolvePanel(trigger, item);
            if (!panel) return;

            setOpen(trigger, item, panel, false);
        });

        const closeAllExcept = (exceptTrigger) => {
            if (!closeOthers) return;

            triggers.forEach((t) => {
                if (t === exceptTrigger) return;
                const item = resolveItem(t);
                if (!item) return;
                const panel = resolvePanel(t, item);
                if (!panel) return;

                setOpen(t, item, panel, false);
            });
        };

        triggers.forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                const item = resolveItem(trigger);
                if (!item) return;

                const panel = resolvePanel(trigger, item);

                // WICHTIG:
                // Wenn kein Panel existiert, ist es kein Accordion-Trigger.
                // Dann NICHT preventDefault() -> Links (z.B. "Termin vereinbaren") funktionieren normal.
                if (!panel) return;

                // Für echte Accordion-Trigger Klickverhalten übernehmen
                e.preventDefault();

                const nextOpen = !item.classList.contains(openClass);
                closeAllExcept(trigger);
                setOpen(trigger, item, panel, nextOpen);
            });
        });
    };

    /* =========================
     *  ÜBER MICH (Accordion)
     * ========================= */
    initAccordion({
        triggerSelector: '.accordion-header',
        itemSelector: '.accordion',
        openClass: 'open',
        closeOthers: false,
        getPanel: (_trigger, item) => item?.querySelector('.accordion-body') || null,
    });

    /* =========================
     *  STARTSEITE (Tiles)
     *  - Accordion nur auf Buttons, nicht auf Links
     *  - "Termin vereinbaren" bleibt <a> und navigiert normal
     * ========================= */
    initAccordion({
        triggerSelector: '.tiles button.tile',
        itemSelector: '.tile-group',
        openClass: 'open',
        closeOthers: false,
        getPanel: (trigger) => trigger.nextElementSibling, // Panel ist direkt nach dem Button
    });
});