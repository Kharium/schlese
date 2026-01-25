function initAccordion({
                           root = document,
                           triggerSelector,
                           itemSelector,
                           openClass = 'open',
                           closeOthers = false,
                           getPanel, // (trigger, item) => HTMLElement|null
                       }) {
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
}

export function initAccordions() {
    // ÜBER MICH
    initAccordion({
        triggerSelector: '.accordion-header',
        itemSelector: '.accordion',
        openClass: 'open',
        closeOthers: false,
        getPanel: (_trigger, item) => item?.querySelector('.accordion-body') || null,
    });

    // STARTSEITE (Tiles)
    initAccordion({
        triggerSelector: '.tiles button.tile',
        itemSelector: '.tile-group',
        openClass: 'open',
        closeOthers: false,
        getPanel: (trigger) => trigger.nextElementSibling, // Panel ist direkt nach dem Button
    });
}
