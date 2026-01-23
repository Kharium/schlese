document.addEventListener('DOMContentLoaded', () => {
    /* =========================
     *  NAV / BURGER-MENÜ ...
     *  (bleibt wie bei dir)
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
            const open = !nav.classList.contains('active');
            setMenuOpen(open);
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
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                setMenuOpen(false);
            }
        });
    }

    const currentPath = location.pathname.replace(/\/+$/, '');
    navLinks.forEach((a) => {
        const href = a.getAttribute('href');
        if (!href) return;

        const absPath = new URL(href, location.origin).pathname.replace(/\/+$/, '');
        if (absPath === currentPath) a.classList.add('is-current');
        else a.classList.remove('is-current');
    });

    navLinks.forEach((a) => {
        a.addEventListener('click', () => {
            navLinks.forEach((x) => x.classList.remove('is-current'));
            a.classList.add('is-current');
        });
    });

    /* =========================
     *  ACCORDION-HELPER (shared)
     * ========================= */
    const initAccordion = ({
                               triggerSelector,
                               itemSelector,
                               panelSelector,
                               openClass = 'open',
                               closeOthers = false,
                               getPanel = null, // optional: (trigger, item) => panel
                           }) => {
        const triggers = Array.from(document.querySelectorAll(triggerSelector));
        if (triggers.length === 0) return;

        const resolveItem = (trigger) =>
            (itemSelector ? trigger.closest(itemSelector) : null) || trigger.parentElement;

        const resolvePanel = (trigger, item) => {
            if (typeof getPanel === 'function') return getPanel(trigger, item);
            return item?.querySelector(panelSelector) || null;
        };

        const setOpen = (trigger, item, panel, isOpen) => {
            if (!item || !panel) return;

            item.classList.toggle(openClass, isOpen);
            panel.hidden = !isOpen;
            trigger.setAttribute('aria-expanded', String(isOpen));
        };

        // Initial: alles zu (Panels hidden)
        triggers.forEach((trigger) => {
            const item = resolveItem(trigger);
            const panel = resolvePanel(trigger, item);
            if (!item || !panel) return;
            setOpen(trigger, item, panel, false);
        });

        // Click
        triggers.forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                // nur für <a> nötig; <button> ist ok
                if (trigger instanceof HTMLAnchorElement) e.preventDefault();

                const item = resolveItem(trigger);
                const panel = resolvePanel(trigger, item);
                if (!item || !panel) return;

                const isOpenNext = !item.classList.contains(openClass);

                if (closeOthers) {
                    triggers.forEach((other) => {
                        if (other === trigger) return;
                        const otherItem = resolveItem(other);
                        const otherPanel = resolvePanel(other, otherItem);
                        if (!otherItem || !otherPanel) return;
                        setOpen(other, otherItem, otherPanel, false);
                    });
                }

                setOpen(trigger, item, panel, isOpenNext);
            });
        });
    };

    /* =========================
     *  ÜBER MICH (Accordion)
     * ========================= */
    initAccordion({
        triggerSelector: '.accordion-header',
        itemSelector: '.accordion',
        panelSelector: '.accordion-body',
        openClass: 'open',
        closeOthers: false,
    });

    /* =========================
     *  STARTSEITE (Tiles)
     *  Erwartet: .tile (button) direkt vor .tile-panel
     * ========================= */
    initAccordion({
        triggerSelector: '.tiles .tile',
        itemSelector: '.tile-group',
        panelSelector: '.tile-panel',
        openClass: 'open',
        closeOthers: false,
        getPanel: (trigger) => trigger.nextElementSibling, // wichtig: Panel ist direkt daneben
    });
});