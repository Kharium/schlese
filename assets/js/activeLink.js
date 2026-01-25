export function initActiveLinks() {
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length === 0) return;

    // Aktuellen Menüpunkt markieren (nur pathname-basiert; Hash bleibt frei)
    const currentPath = location.pathname.replace(/\/+$/, '');

    navLinks.forEach((a) => {
        const href = a.getAttribute('href');
        if (!href) return;

        const absPath = new URL(href, location.origin).pathname.replace(/\/+$/, '');
        a.classList.toggle('is-current', absPath === currentPath);
    });

    // Beim Klicken visuell setzen (für Single-Page/Anchor-Navigation)
    navLinks.forEach((a) => {
        a.addEventListener('click', () => {
            navLinks.forEach((x) => x.classList.remove('is-current'));
            a.classList.add('is-current');
        });
    });
}
